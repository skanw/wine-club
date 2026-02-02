/**
 * SMS message templates and formatting
 */

interface Campaign {
  productName: string
  productPrice?: number
  message: string
  imageUrl?: string | null
}

interface Member {
  name: string
  phone?: string | null
}

/**
 * Format campaign message for SMS
 * Handles 160-character limit and includes unsubscribe info
 */
export function formatCampaignMessage(
  campaign: Campaign,
  member: Member
): string {
  let smsMessage = ''

  // Add personalized greeting if member name is available
  if (member.name) {
    smsMessage += `Bonjour ${member.name.split(' ')[0]},\n\n`
  }

  // Add product name
  if (campaign.productName) {
    smsMessage += `🍷 ${campaign.productName}`
    if (campaign.productPrice) {
      smsMessage += ` - ${campaign.productPrice.toFixed(2)}€`
    }
    smsMessage += '\n\n'
  }

  // Add campaign message
  smsMessage += campaign.message

  // Add unsubscribe info (required for GDPR compliance)
  const unsubscribeText = '\n\nRépondez STOP pour vous désabonner'
  const maxLength = 160 - unsubscribeText.length

  // Truncate if too long (SMS single message limit is 160 chars)
  // Twilio will auto-split longer messages, but we try to keep it to one message
  if (smsMessage.length > maxLength) {
    smsMessage = smsMessage.substring(0, maxLength - 3) + '...'
  }

  smsMessage += unsubscribeText

  return smsMessage
}

/**
 * Split long SMS into multiple messages if needed
 * Returns array of message parts
 */
export function splitLongSMS(message: string, maxLength: number = 160): string[] {
  if (message.length <= maxLength) {
    return [message]
  }

  const parts: string[] = []
  let currentPart = ''

  // Split by sentences or words to avoid breaking mid-word
  const sentences = message.split(/([.!?]\s+)/)

  for (const sentence of sentences) {
    if ((currentPart + sentence).length <= maxLength) {
      currentPart += sentence
    } else {
      if (currentPart) {
        parts.push(currentPart.trim())
      }
      // If single sentence is too long, split by words
      if (sentence.length > maxLength) {
        const words = sentence.split(/\s+/)
        let wordPart = ''
        for (const word of words) {
          if ((wordPart + ' ' + word).length <= maxLength) {
            wordPart += (wordPart ? ' ' : '') + word
          } else {
            if (wordPart) {
              parts.push(wordPart)
            }
            wordPart = word
          }
        }
        if (wordPart) {
          currentPart = wordPart
        } else {
          currentPart = sentence.substring(0, maxLength)
        }
      } else {
        currentPart = sentence
      }
    }
  }

  if (currentPart) {
    parts.push(currentPart.trim())
  }

  return parts.length > 0 ? parts : [message.substring(0, maxLength)]
}
