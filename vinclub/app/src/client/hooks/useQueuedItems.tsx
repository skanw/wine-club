import { useState, useEffect, useCallback } from 'react'
import { getQueuedActionsByType, type QueuedAction } from '../offline/queue-manager'
import { syncService } from '../offline/sync-service'

export type QueuedItemStatus = 'pending' | 'syncing' | 'failed'

export interface QueuedItemMeta {
  isQueued: true
  queuedId: string
  queuedAt: Date
  status: QueuedItemStatus
  lastError?: string
}

export interface QueuedItem<T> extends QueuedItemMeta {
  data: T
}

type ActionType = QueuedAction['type']

interface UseQueuedItemsOptions<T> {
  /** The action type to filter by (e.g., 'createMember', 'createCampaign') */
  actionType: ActionType
  /** Transform the raw payload into the display format */
  transform: (payload: any, action: QueuedAction) => T
}

interface UseQueuedItemsResult<T> {
  /** Array of transformed queued items with metadata */
  items: QueuedItem<T>[]
  /** Whether the hook is currently loading */
  isLoading: boolean
  /** Force refresh the queued items */
  refresh: () => Promise<void>
}

/**
 * Hook to fetch and transform queued (offline) actions from IndexedDB.
 * Automatically refreshes when sync events occur.
 */
export function useQueuedItems<T>(
  options: UseQueuedItemsOptions<T>
): UseQueuedItemsResult<T> {
  const { actionType, transform } = options
  const [items, setItems] = useState<QueuedItem<T>[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchQueuedItems = useCallback(async () => {
    try {
      const actions = await getQueuedActionsByType(actionType)
      
      // Transform and sort by timestamp (newest first)
      const transformed = actions
        .map((action) => ({
          data: transform(action.payload, action),
          isQueued: true as const,
          queuedId: action.id,
          queuedAt: action.metadata.timestamp,
          status: action.metadata.status as QueuedItemStatus,
          lastError: action.metadata.lastError,
        }))
        .sort((a, b) => b.queuedAt.getTime() - a.queuedAt.getTime())

      setItems(transformed)
    } catch (error) {
      console.error(`Error fetching queued ${actionType} items:`, error)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [actionType, transform])

  // Initial fetch
  useEffect(() => {
    fetchQueuedItems()
  }, [fetchQueuedItems])

  // Listen to sync events and refresh
  useEffect(() => {
    const unsubscribe = syncService.addListener((event) => {
      // Refresh on any sync event that might affect our items
      if (
        event.type === 'sync-start' ||
        event.type === 'sync-complete' ||
        event.type === 'action-synced' ||
        event.type === 'action-failed'
      ) {
        // Only refresh if the event is related to our action type
        if (!event.actionType || event.actionType === actionType) {
          fetchQueuedItems()
        }
      }
    })

    return () => {
      unsubscribe()
    }
  }, [actionType, fetchQueuedItems])

  // Also refresh on visibility change (user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchQueuedItems()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchQueuedItems])

  return {
    items,
    isLoading,
    refresh: fetchQueuedItems,
  }
}

/**
 * Hook specifically for queued members.
 * Returns members formatted for display in MemberListPage.
 */
export function useQueuedMembers() {
  return useQueuedItems({
    actionType: 'createMember',
    transform: (payload, action) => ({
      id: `queued-${action.id}`,
      name: payload.name || 'Nouveau membre',
      email: payload.email || null,
      phone: payload.phone || '',
      tags: payload.tags || [],
      preferredRegion: payload.preferredRegion || null,
      consentEmail: payload.consentEmail || false,
      consentSms: payload.consentSms || false,
      createdAt: action.metadata.timestamp,
    }),
  })
}

/**
 * Hook specifically for queued campaigns.
 * Returns campaigns formatted for display in CampaignListPage.
 */
export function useQueuedCampaigns() {
  return useQueuedItems({
    actionType: 'createCampaign',
    transform: (payload, action) => ({
      id: `queued-${action.id}`,
      name: payload.name || 'Nouvelle campagne',
      type: payload.type || 'daily_drop',
      status: 'draft',
      productName: payload.productName || payload.products?.[0]?.name || 'Produit',
      productPrice: payload.productPrice || payload.products?.[0]?.price || 0,
      message: payload.message || '',
      imageUrl: payload.imageUrl || null,
      audience: payload.audience || { type: 'all', value: [] },
      channels: payload.channels || ['sms'],
      sentCount: 0,
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      createdAt: action.metadata.timestamp,
      sentAt: null,
    }),
  })
}
