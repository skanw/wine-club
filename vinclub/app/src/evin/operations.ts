import { HttpError } from 'wasp/server';
import type {
  GetEvinTemplates,
  GetAdminEvinTemplates,
  CreateEvinTemplate,
  UpdateEvinTemplate,
  DeleteEvinTemplate,
} from 'wasp/server/operations';
import { EvinTemplateType } from '@prisma/client';
import { z } from 'zod';

const createEvinTemplateSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(200),
  slug: z.string().min(1, 'Le slug est requis').max(100).regex(/^[a-z0-9_]+$/, 'Slug: minuscules, chiffres et underscores uniquement'),
  body: z.string().min(1, 'Le corps du template est requis').max(2000),
  type: z.enum(['arrivage', 'flash', 'box']),
  isActive: z.boolean().default(true),
});

const updateEvinTemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9_]+$/).optional(),
  body: z.string().min(1).max(2000).optional(),
  type: z.enum(['arrivage', 'flash', 'box']).optional(),
  isActive: z.boolean().optional(),
});

/**
 * Get active Loi Evin templates for cavistes (campaign creator).
 */
export const getEvinTemplates: GetEvinTemplates<
  void,
  Array<{ id: string; name: string; slug: string; body: string; type: string }>
> = async (_args, context) => {
  const templates = await context.entities.EvinTemplate.findMany({
    where: { isActive: true },
    orderBy: { type: 'asc' },
    select: { id: true, name: true, slug: true, body: true, type: true },
  });
  return templates.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    body: t.body,
    type: t.type,
  }));
};

/**
 * Get all Evin templates for admin (including inactive).
 */
export const getAdminEvinTemplates: GetAdminEvinTemplates<
  void,
  Array<{ id: string; name: string; slug: string; body: string; type: string; isActive: boolean; createdAt: Date; updatedAt: Date }>
> = async (_args, context) => {
  if (!context.user?.isAdmin) {
    throw new HttpError(403, 'Accès admin requis');
  }
  const templates = await context.entities.EvinTemplate.findMany({
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
  });
  return templates.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    body: t.body,
    type: t.type,
    isActive: t.isActive,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }));
};

/**
 * Create a new Evin template (admin only).
 */
export const createEvinTemplate: CreateEvinTemplate<
  z.infer<typeof createEvinTemplateSchema>,
  { id: string }
> = async (rawArgs, context) => {
  if (!context.user?.isAdmin) {
    throw new HttpError(403, 'Accès admin requis');
  }
  const data = createEvinTemplateSchema.parse(rawArgs);
  const existing = await context.entities.EvinTemplate.findUnique({
    where: { slug: data.slug },
  });
  if (existing) {
    throw new HttpError(400, 'Un template avec ce slug existe déjà');
  }
  const template = await context.entities.EvinTemplate.create({
    data: {
      name: data.name,
      slug: data.slug,
      body: data.body,
      type: data.type as EvinTemplateType,
      isActive: data.isActive,
    },
  });
  return { id: template.id };
};

/**
 * Update an Evin template (admin only).
 */
export const updateEvinTemplate: UpdateEvinTemplate<
  z.infer<typeof updateEvinTemplateSchema>,
  { id: string }
> = async (rawArgs, context) => {
  if (!context.user?.isAdmin) {
    throw new HttpError(403, 'Accès admin requis');
  }
  const { id, ...rest } = updateEvinTemplateSchema.parse(rawArgs);
  const updateData: Record<string, unknown> = { ...rest };
  if (updateData.slug !== undefined) {
    const existing = await context.entities.EvinTemplate.findFirst({
      where: { slug: updateData.slug as string, id: { not: id } },
    });
    if (existing) {
      throw new HttpError(400, 'Un template avec ce slug existe déjà');
    }
  }
  const template = await context.entities.EvinTemplate.update({
    where: { id },
    data: {
      ...(updateData.name !== undefined && { name: updateData.name as string }),
      ...(updateData.slug !== undefined && { slug: updateData.slug as string }),
      ...(updateData.body !== undefined && { body: updateData.body as string }),
      ...(updateData.type !== undefined && { type: updateData.type as EvinTemplateType }),
      ...(updateData.isActive !== undefined && { isActive: updateData.isActive as boolean }),
    },
  });
  return { id: template.id };
};

/**
 * Delete an Evin template (admin only). Hard delete.
 */
export const deleteEvinTemplate: DeleteEvinTemplate<
  { id: string },
  void
> = async (rawArgs, context) => {
  if (!context.user?.isAdmin) {
    throw new HttpError(403, 'Accès admin requis');
  }
  const { id } = z.object({ id: z.string().uuid() }).parse(rawArgs);
  await context.entities.EvinTemplate.delete({
    where: { id },
  });
};
