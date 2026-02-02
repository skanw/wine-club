import type { QueuedItem, QueuedItemMeta } from '../hooks/useQueuedItems'

/**
 * Type for a member as displayed in MemberListPage
 */
export interface MemberDisplayItem {
  id: string
  name: string
  email: string | null
  phone: string
  tags: string[]
  preferredRegion: string | null
  consentEmail: boolean
  consentSms: boolean
  createdAt: Date
}

/**
 * Type for a campaign as displayed in CampaignListPage
 */
export interface CampaignDisplayItem {
  id: string
  name: string
  type: string
  status: string
  productName: string
  productPrice: number
  message: string
  imageUrl: string | null
  audience: { type: string; value: string[] }
  channels: string[]
  sentCount: number
  deliveredCount: number
  openedCount: number
  clickedCount: number
  createdAt: Date
  sentAt: Date | null
}

/**
 * Wrapper type for items that may be queued or from server
 */
export type MaybeQueuedItem<T> = 
  | (T & { isQueued?: false })
  | QueuedItem<T>

/**
 * Check if an item is a queued item
 */
export function isQueuedItem<T>(item: MaybeQueuedItem<T>): item is QueuedItem<T> {
  return 'isQueued' in item && item.isQueued === true
}

/**
 * Get the underlying data from a possibly queued item
 */
export function getItemData<T>(item: MaybeQueuedItem<T>): T {
  if (isQueuedItem(item)) {
    return item.data
  }
  return item
}

/**
 * Merge queued items with server items.
 * Queued items appear first (sorted by queuedAt desc),
 * followed by server items (keeping their original order).
 */
export function mergeWithQueuedItems<T extends { id: string }>(
  serverItems: T[],
  queuedItems: QueuedItem<T>[]
): MaybeQueuedItem<T>[] {
  // Create a Set of server IDs to check for duplicates
  const serverIds = new Set(serverItems.map((item) => item.id))
  
  // Filter out any queued items that might have been synced
  // (their ID would now exist in server data, though with different prefix)
  const pendingQueued = queuedItems.filter(
    (q) => !serverIds.has(q.data.id.replace('queued-', ''))
  )

  // Queued items first, then server items
  return [...pendingQueued, ...serverItems.map((item) => ({ ...item, isQueued: false as const }))]
}

/**
 * Filter queued items by search term
 */
export function filterQueuedMembers(
  items: QueuedItem<MemberDisplayItem>[],
  search: string
): QueuedItem<MemberDisplayItem>[] {
  if (!search.trim()) return items
  
  const searchLower = search.toLowerCase()
  return items.filter((item) => {
    const data = item.data
    return (
      data.name.toLowerCase().includes(searchLower) ||
      (data.email && data.email.toLowerCase().includes(searchLower)) ||
      data.phone.includes(search)
    )
  })
}

/**
 * Filter queued campaigns by status
 */
export function filterQueuedCampaigns(
  items: QueuedItem<CampaignDisplayItem>[],
  statusFilter?: string
): QueuedItem<CampaignDisplayItem>[] {
  // Queued campaigns are always shown unless filtering for 'sent' or 'failed'
  if (statusFilter === 'sent' || statusFilter === 'failed') {
    return []
  }
  return items
}

/**
 * Get queue status badge text in French
 */
export function getQueueStatusText(status: QueuedItemMeta['status']): string {
  switch (status) {
    case 'pending':
      return 'En attente'
    case 'syncing':
      return 'Synchro...'
    case 'failed':
      return 'Échec'
    default:
      return 'En attente'
  }
}

/**
 * Get queue status badge color classes
 */
export function getQueueStatusClasses(status: QueuedItemMeta['status']): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'syncing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse'
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
  }
}

/**
 * Get ghost card classes for queued items
 */
export function getGhostCardClasses(status: QueuedItemMeta['status']): string {
  const baseClasses = 'opacity-80 border-l-4'
  
  switch (status) {
    case 'pending':
      return `${baseClasses} border-l-yellow-500`
    case 'syncing':
      return `${baseClasses} border-l-blue-500 animate-pulse`
    case 'failed':
      return `${baseClasses} border-l-red-500`
    default:
      return `${baseClasses} border-l-yellow-500`
  }
}
