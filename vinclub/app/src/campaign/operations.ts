import { type Prisma } from '@prisma/client';
import { HttpError, prisma } from 'wasp/server';
import type {
  GetPaginatedCampaigns,
  GetCampaignById,
  CreateCampaign,
  SendCampaign,
  UpdateCampaign,
  DeleteCampaign,
} from 'wasp/server/operations';
import { getUserCaveId, ensureCaveAccess, ensureRequiredRole, requireAuthenticatedCave } from '../server/utils/tenant';
import { randomUUID } from 'crypto';
import {
  createCampaignSchema,
  updateCampaignSchema,
  getPaginatedCampaignsSchema,
  campaignIdSchema,
  type CreateCampaignInput,
  type UpdateCampaignInput,
  type GetPaginatedCampaignsInput,
  type CampaignIdInput,
  type Audience,
} from '../server/validation/campaign';
import { ensureArgsSchemaOrThrowHttpError } from '../server/validation';
import { validateMessageLoiEvin, substitutePlaceholders, type PlaceholderContext } from '../server/validation/loiEvin';
import { uploadCampaignImage } from './imageUpload';
import { CampaignStatus, CampaignType, MessageChannel, MessageStatus } from '@prisma/client';
import { sendCampaignMessagesBatch } from './message-sender';

/**
 * Get paginated list of campaigns for the authenticated cave
 */
export const getPaginatedCampaigns: GetPaginatedCampaigns<
  GetPaginatedCampaignsInput,
  {
    data: Array<{
      id: string;
      name: string;
      type: string;
      status: string;
      productName: string;
      productPrice: number;
      message: string;
      imageUrl: string | null;
      audience: Audience;
      channels: string[];
      sentCount: number;
      deliveredCount: number;
      openedCount: number;
      clickedCount: number;
      createdAt: Date;
      sentAt: Date | null;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }
> = async (rawArgs, context) => {
  const caveId = requireAuthenticatedCave(context);

  const { page, limit, status, sort, order } = ensureArgsSchemaOrThrowHttpError(
    getPaginatedCampaignsSchema,
    rawArgs
  );

  const skip = (page - 1) * limit;

  const where: Prisma.CampaignWhereInput = {
    caveId,
    ...(status && { status }),
  };

  const [campaigns, total] = await Promise.all([
    context.entities.Campaign.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sort]: order,
      },
    }),
    context.entities.Campaign.count({ where }),
  ]);

  return {
    data: campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      type: campaign.type,
      status: campaign.status,
      productName: campaign.productName,
      productPrice: campaign.productPrice,
      message: campaign.message,
      imageUrl: campaign.imageUrl,
      audience: campaign.audience as Audience,
      channels: campaign.channels as string[],
      sentCount: campaign.sentCount,
      deliveredCount: campaign.deliveredCount,
      openedCount: campaign.openedCount,
      clickedCount: campaign.clickedCount,
      createdAt: campaign.createdAt,
      sentAt: campaign.sentAt,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get campaign details including statistics
 */
export const getCampaignById: GetCampaignById<
  { id: string },
  {
    id: string;
    name: string;
    status: string;
    productName: string;
    productPrice: number;
    message: string;
    imageUrl: string | null;
    audience: Audience;
    channels: string[];
    statistics: {
      sentCount: number;
      deliveredCount: number;
      failedCount: number;
      openedCount: number;
      clickedCount: number;
      conversionCount: number;
      revenue: number;
    };
    createdAt: Date;
    sentAt: Date | null;
  }
> = async (rawArgs, context) => {
  const caveId = requireAuthenticatedCave(context);

  const { id } = ensureArgsSchemaOrThrowHttpError(campaignIdSchema, rawArgs);

  const campaign = await context.entities.Campaign.findFirst({
    where: {
      id,
      caveId,
    },
  });

  if (!campaign) {
    throw new HttpError(404, 'Campagne introuvable');
  }

  ensureCaveAccess(context.user, campaign.caveId);

  // Use database aggregation instead of loading all messages into memory
  // This is much more efficient for campaigns with thousands of messages
  const [statusStats, conversionCount] = await Promise.all([
    context.entities.CampaignMessage.groupBy({
      by: ['status'],
      where: { campaignId: id },
      _count: true,
    }),
    context.entities.CampaignMessage.count({
      where: {
        campaignId: id,
        clickedAt: { not: null },
      },
    }),
  ]);

  // Calculate failed count from status stats
  const failedCount = statusStats.find((stat) => stat.status === 'failed')?._count || 0;

  // Calculate revenue with validation
  const productPrice = Number(campaign.productPrice) || 0;
  if (!isFinite(productPrice) || productPrice < 0) {
    const requestId = randomUUID();
    console.error('Invalid product price in campaign', {
      requestId,
      campaignId: campaign.id,
      productPrice: campaign.productPrice,
      timestamp: new Date().toISOString(),
    });
  }
  const revenue = conversionCount * (isFinite(productPrice) ? productPrice : 0);

  return {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    productName: campaign.productName,
    productPrice: campaign.productPrice,
    message: campaign.message,
    imageUrl: campaign.imageUrl,
    audience: campaign.audience as Audience,
    channels: campaign.channels as string[],
    statistics: {
      sentCount: campaign.sentCount,
      deliveredCount: campaign.deliveredCount,
      failedCount,
      openedCount: campaign.openedCount,
      clickedCount: campaign.clickedCount,
      conversionCount,
      revenue,
    },
    createdAt: campaign.createdAt,
    sentAt: campaign.sentAt,
  };
};

/**
 * Create a new campaign (Daily Drop)
 * Validates inputs, uploads image, calculates audience count
 */
export const createCampaign: CreateCampaign<CreateCampaignInput, { id: string }> = async (
  rawArgs,
  context
) => {
  const caveId = requireAuthenticatedCave(context);

  const data = ensureArgsSchemaOrThrowHttpError(createCampaignSchema, rawArgs);

  // Resolve message: from template + placeholders or use provided message
  let messageToUse = data.message;
  if (data.templateId) {
    const template = await context.entities.EvinTemplate.findFirst({
      where: { id: data.templateId, isActive: true },
    });
    if (!template) {
      throw new HttpError(400, 'Template Loi Evin introuvable ou inactif');
    }
    const cave = await context.entities.Cave.findUnique({
      where: { id: caveId },
      select: { name: true },
    });
    const caveName = cave?.name ?? '';
    const firstProductName = data.products?.[0]?.name ?? data.productName ?? '';
    const firstProductPrice = data.products?.[0]?.price ?? data.productPrice ?? 0;
    const contextPlaceholders: PlaceholderContext = {
      productName: firstProductName,
      productPrice: typeof firstProductPrice === 'number' ? firstProductPrice : parseFloat(String(firstProductPrice)),
      caveName,
    };
    messageToUse = substitutePlaceholders(template.body, contextPlaceholders);
  }

  // Loi Evin: validate message (block on errors)
  const loiEvin = validateMessageLoiEvin(messageToUse);
  if (!loiEvin.valid && loiEvin.errors?.length) {
    throw new HttpError(400, loiEvin.errors.join(' '));
  }

  // Upload image if provided
  let imageUrl: string | null = null;
  if (data.imageUrl) {
    try {
      // If imageUrl is a base64 string, upload it
      if (data.imageUrl.startsWith('data:image/')) {
        const uploadResult = await uploadCampaignImage(data.imageUrl, caveId);
        imageUrl = uploadResult.url;
      } else {
        // Assume it's already a URL
        imageUrl = data.imageUrl;
      }
    } catch (error) {
      throw new HttpError(400, `Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Handle products: use products array if provided, otherwise use single productName/productPrice
  let productName: string;
  let productPrice: number;
  let productsJson: Prisma.InputJsonValue | undefined;

  if (data.products && data.products.length > 0) {
    // Use first product for backward compatibility
    productName = data.products[0].name;
    productPrice = data.products[0].price;
    // Store all products as JSON (we'll need to add a products field to schema later)
    // For now, we can store it in a custom JSON structure or add it to audience
    productsJson = data.products as Prisma.InputJsonValue;
  } else if (data.productName && data.productPrice !== undefined) {
    // Backward compatibility: use single product
    productName = data.productName;
    productPrice = data.productPrice;
    productsJson = [{ name: productName, price: productPrice }] as Prisma.InputJsonValue;
  } else {
    throw new HttpError(400, 'Vous devez fournir au moins un produit');
  }

  // Calculate audience count (simplified - will be calculated when sending)
  const members = await fetchAudienceMembers(data.audience, caveId, context);
  const audienceCount = members.length;

  // Create campaign
  // Note: We store products in audience JSON temporarily until schema migration
  // The audience structure will be: { type, value, products? }
  const audienceWithProducts = {
    ...data.audience,
    products: productsJson,
  };

  const campaign = await context.entities.Campaign.create({
    data: {
      caveId,
      name: data.name,
      type: data.type,
      status: data.sendImmediately ? CampaignStatus.sending : CampaignStatus.draft,
      productName,
      productPrice,
      message: messageToUse,
      imageUrl,
      audience: audienceWithProducts as Prisma.InputJsonValue,
      channels: data.channels as Prisma.InputJsonValue,
      maxQuantity: data.maxQuantity,
    },
  });

  // If sendImmediately is true, queue the campaign for sending
  if (data.sendImmediately) {
    // TODO: Queue campaign for sending via background job
    // This will be implemented when the background job is set up
  }

  return { id: campaign.id };
};

/**
 * Send a campaign
 * Validates status, fetches audience members, queues messages
 */
export const sendCampaign: SendCampaign<{ id: string }, { message: string; campaignId: string }> =
  async (rawArgs, context) => {
    const caveId = requireAuthenticatedCave(context);

    const { id } = ensureArgsSchemaOrThrowHttpError(campaignIdSchema, rawArgs);

    const campaign = await context.entities.Campaign.findFirst({
      where: {
        id,
        caveId,
      },
    });

    if (!campaign) {
      throw new HttpError(404, 'Campagne introuvable');
    }

    ensureCaveAccess(context.user, campaign.caveId);

    if (campaign.status !== CampaignStatus.draft && campaign.status !== CampaignStatus.scheduled) {
      throw new HttpError(400, 'La campagne ne peut être envoyée que si elle est en brouillon ou planifiée');
    }

    // Loi Evin: re-validate message before sending
    const loiEvinSend = validateMessageLoiEvin(campaign.message);
    if (!loiEvinSend.valid && loiEvinSend.errors?.length) {
      throw new HttpError(400, `Message non conforme à la Loi Evin: ${loiEvinSend.errors.join(' ')}`);
    }

    // Fetch audience members
    const audience = campaign.audience as Audience;
    const members = await fetchAudienceMembers(audience, caveId, context);

    // Filter by channels and consent
    const channels = campaign.channels as string[];
    if (!channels || channels.length === 0) {
      throw new HttpError(400, 'Au moins un canal doit être sélectionné');
    }

    const filteredMembers = members.filter((member) => {
      return channels.some((channel) => {
        if (channel === 'sms') return member.consentSms;
        if (channel === 'email') return member.consentEmail;
        return false;
      });
    });

    // Create campaign messages
    const campaignMessages = filteredMembers.flatMap((member) =>
      channels.map((channel) => ({
        campaignId: id,
        memberId: member.id,
        channel: channel as MessageChannel,
        status: MessageStatus.pending,
      }))
    );

    // Wrap all database operations in a transaction to ensure consistency
    const createdMessages = await prisma.$transaction(async (tx) => {
      // Update campaign status to sending
      await tx.campaign.update({
        where: { id },
        data: {
          status: CampaignStatus.sending,
          sentAt: new Date(),
        },
      });

      // Create campaign messages
      let createdMessagesData: Array<{ id: string; memberId: string; channel: MessageChannel }> = []
      if (campaignMessages.length > 0) {
        await tx.campaignMessage.createMany({
          data: campaignMessages,
        });
        
        // Fetch created messages to get their IDs
        createdMessagesData = await tx.campaignMessage.findMany({
          where: {
            campaignId: id,
            status: MessageStatus.pending,
          },
          select: {
            id: true,
            memberId: true,
            channel: true,
          },
        });
      }

      // Update campaign sent count
      await tx.campaign.update({
        where: { id },
        data: {
          sentCount: campaignMessages.length,
        },
      });

      return createdMessagesData;
    });

    // Send messages (synchronous for now, will be replaced by background job)
    // TODO: Replace with background job processing in Priority 3
    if (createdMessages.length > 0) {
      try {
        // Fetch full member data (name, phone, email) for message sending
        const memberIds = Array.from(new Set(createdMessages.map((m) => m.memberId)))
        const fullMembers = await context.entities.Member.findMany({
          where: {
            id: { in: memberIds },
            caveId,
          },
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        })

        // Create members map for quick lookup
        const membersMap = new Map(
          fullMembers.map((m) => [m.id, m])
        )

        // Prepare campaign data
        const campaignData = {
          id: campaign.id,
          productName: campaign.productName,
          productPrice: campaign.productPrice,
          message: campaign.message,
          imageUrl: campaign.imageUrl,
        };

        // Send messages in batches
        const sendResults = await sendCampaignMessagesBatch(
          createdMessages.map((m) => ({
            id: m.id,
            campaignId: id,
            memberId: m.memberId,
            channel: m.channel as MessageChannel,
            status: MessageStatus.pending,
          })),
          campaignData,
          membersMap,
          context,
          50 // Batch size
        );

        // Update campaign statistics
        await context.entities.Campaign.update({
          where: { id },
          data: {
            deliveredCount: sendResults.sent,
            // Note: failedCount doesn't exist in schema, using sentCount - failedCount calculation
          },
        });

        return {
          message: `Campaign sent: ${sendResults.sent} delivered, ${sendResults.failed} failed`,
          campaignId: id,
        };
      } catch (error: any) {
        console.error('Error sending campaign messages:', error);
        // Don't fail the entire operation - messages are created and can be retried
        return {
          message: 'Campaign messages created but sending encountered errors. Messages will be retried.',
          campaignId: id,
        };
      }
    }

    return {
      message: 'Campaign queued for sending',
      campaignId: id,
    };
  };

/**
 * Update a campaign (only draft campaigns can be updated)
 */
export const updateCampaign: UpdateCampaign<
  { id: string } & UpdateCampaignInput,
  { id: string }
> = async (rawArgs, context) => {
  const caveId = requireAuthenticatedCave(context);

  const { id, ...updateDataRaw } = rawArgs;
  const { id: validatedId } = ensureArgsSchemaOrThrowHttpError(campaignIdSchema, { id });
  const validatedData = ensureArgsSchemaOrThrowHttpError(updateCampaignSchema, updateDataRaw);

  const campaign = await context.entities.Campaign.findFirst({
    where: {
      id: validatedId,
      caveId,
    },
  });

  if (!campaign) {
    throw new HttpError(404, 'Campagne introuvable');
  }

  ensureCaveAccess(context.user, campaign.caveId);

  if (campaign.status !== CampaignStatus.draft) {
    throw new HttpError(400, 'Seules les campagnes en brouillon peuvent être modifiées');
  }

  // Handle image upload if imageUrl is being updated
  let imageUrl = validatedData.imageUrl;
  if (imageUrl && imageUrl.startsWith('data:image/')) {
    try {
      const uploadResult = await uploadCampaignImage(imageUrl, caveId);
      imageUrl = uploadResult.url;
    } catch (error) {
      throw new HttpError(400, `Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Prepare update data object - only include fields that are being updated
  const updateData: Prisma.CampaignUpdateInput = {};

  if (validatedData.name) {
    updateData.name = validatedData.name;
  }
  if (validatedData.productName) {
    updateData.productName = validatedData.productName;
  }
  if (validatedData.productPrice !== undefined) {
    updateData.productPrice = validatedData.productPrice;
  }
  if (validatedData.message) {
    const loiEvinUpdate = validateMessageLoiEvin(validatedData.message);
    if (!loiEvinUpdate.valid && loiEvinUpdate.errors?.length) {
      throw new HttpError(400, loiEvinUpdate.errors.join(' '));
    }
    updateData.message = validatedData.message;
  }
  if (imageUrl) {
    updateData.imageUrl = imageUrl;
  }
  if (validatedData.maxQuantity !== undefined) {
    updateData.maxQuantity = validatedData.maxQuantity;
  }

  // Handle audience update - only if provided
  if (validatedData.audience) {
    updateData.audience = validatedData.audience as unknown as Prisma.InputJsonValue;
  }

  // Handle channels update - only if provided
  if (validatedData.channels) {
    updateData.channels = validatedData.channels as unknown as Prisma.InputJsonValue;
  }

  const updatedCampaign = await context.entities.Campaign.update({
    where: { id: validatedId },
    data: updateData,
  });

  return { id: updatedCampaign.id };
};

/**
 * Delete a campaign (only draft or scheduled campaigns can be deleted)
 */
export const deleteCampaign: DeleteCampaign<{ id: string }, void> = async (rawArgs, context) => {
  // Only OWNER and MANAGER can delete campaigns
  ensureRequiredRole(context.user, ['OWNER', 'MANAGER']);

  const caveId = requireAuthenticatedCave(context);

  const { id } = ensureArgsSchemaOrThrowHttpError(campaignIdSchema, rawArgs);

  const campaign = await context.entities.Campaign.findFirst({
    where: {
      id,
      caveId,
    },
  });

  if (!campaign) {
    throw new HttpError(404, 'Campagne introuvable');
  }

  ensureCaveAccess(context.user, campaign.caveId);

  if (
    campaign.status !== CampaignStatus.draft &&
    campaign.status !== CampaignStatus.scheduled
  ) {
    throw new HttpError(400, 'Seules les campagnes en brouillon ou planifiées peuvent être supprimées');
  }

  await context.entities.Campaign.delete({
    where: { id },
  });
};

/**
 * Helper function to fetch audience members based on audience criteria
 * Uses prisma directly to avoid requiring Member entity in context
 */
async function fetchAudienceMembers(
  audience: Audience,
  caveId: string,
  _context: any // Context not needed since we use prisma directly
): Promise<Array<{ id: string; consentEmail: boolean; consentSms: boolean }>> {
  const where: Prisma.MemberWhereInput = {
    caveId,
    deletedAt: null,
  };

  if (audience.type === 'all') {
    // All members
  } else if (audience.type === 'tag') {
    // Members with specific tags
    where.tags = {
      array_contains: audience.value,
    };
  } else if (audience.type === 'region') {
    // Members in specific region
    where.preferredRegion = {
      in: audience.value,
    };
  } else if (audience.type === 'custom') {
    // Custom filter criteria (can be extended)
    // For now, treat as all members
  }

  const members = await prisma.member.findMany({
    where,
    select: {
      id: true,
      consentEmail: true,
      consentSms: true,
    },
  });

  return members;
}

