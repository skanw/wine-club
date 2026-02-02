/**
 * Email templates for Brevo campaigns
 */

interface Campaign {
  productName: string
  productPrice?: number
  message: string
  imageUrl?: string | null
}

interface Member {
  name: string
  email?: string | null
}

/**
 * Generate HTML email template for campaign
 */
export function formatCampaignEmail(
  campaign: Campaign,
  member: Member,
  unsubscribeUrl?: string
): { html: string; plainText: string } {
  const firstName = member.name.split(' ')[0]

  // Generate unsubscribe URL (if not provided, use placeholder)
  const unsubscribeLink =
    unsubscribeUrl ||
    `https://vinclub.fr/unsubscribe?email=${encodeURIComponent(member.email || '')}`

  // HTML version
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle Arrivée - ${campaign.productName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 20px 0; text-align: center; background-color: #8B2635;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">VinClub</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 20px; background-color: #ffffff; max-width: 600px; margin: 0 auto;">
        ${firstName ? `<p style="font-size: 16px; color: #333333; margin: 0 0 20px 0;">Bonjour ${firstName},</p>` : ''}
        
        ${campaign.imageUrl ? `
        <div style="text-align: center; margin: 20px 0;">
          <img src="${campaign.imageUrl}" alt="${campaign.productName}" style="max-width: 100%; height: auto; border-radius: 8px;">
        </div>
        ` : ''}
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #8B2635; margin: 0 0 10px 0; font-size: 20px;">
            🍷 ${campaign.productName}
            ${campaign.productPrice ? `<span style="color: #666666; font-size: 18px; font-weight: normal;"> - ${campaign.productPrice.toFixed(2)}€</span>` : ''}
          </h2>
        </div>
        
        <div style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0;">
          ${campaign.message.split('\n').map((line) => `<p style="margin: 0 0 10px 0;">${escapeHtml(line)}</p>`).join('')}
        </div>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="https://vinclub.fr" style="display: inline-block; background-color: #8B2635; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Découvrir</a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #f5f5f5; font-size: 12px; color: #666666;">
        <p style="margin: 0 0 10px 0;">
          Vous recevez cet email car vous êtes membre de VinClub.
        </p>
        <p style="margin: 0;">
          <a href="${unsubscribeLink}" style="color: #8B2635; text-decoration: underline;">Se désabonner</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  // Plain text version
  const plainText = `
Bonjour ${firstName || 'Cher membre'},

🍷 ${campaign.productName}${campaign.productPrice ? ` - ${campaign.productPrice.toFixed(2)}€` : ''}

${campaign.message}

Découvrir: https://vinclub.fr

---
Vous recevez cet email car vous êtes membre de VinClub.
Pour vous désabonner: ${unsubscribeLink}
  `.trim()

  return { html, plainText }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
