import { queueAction } from './queue-manager'
import { createMember } from 'wasp/client/operations'
import { createCampaign, sendCampaign } from 'wasp/client/operations'
import { syncService } from './sync-service'

interface OfflineResult<T> {
  id?: string
  queued?: boolean
  data?: T
}

/**
 * Check if the app is currently online
 */
export function isOnline(): boolean {
  return navigator.onLine
}

/**
 * Offline-aware wrapper for createMember
 * If online, calls the operation directly
 * If offline, queues the action and returns optimistic result
 */
export async function createMemberOffline(payload: any): Promise<OfflineResult<{ id: string }>> {
  if (isOnline()) {
    try {
      const result = await createMember(payload)
      return { data: result, queued: false }
    } catch (error) {
      throw error
    }
  } else {
    // Queue the action
    const queuedId = await queueAction('createMember', payload, {
      status: 'pending',
    })

    // Trigger sync when back online (if not already syncing)
    if (!syncService.isProcessing()) {
      syncService.processQueue()
    }

    return {
      id: queuedId,
      queued: true,
    }
  }
}

/**
 * Offline-aware wrapper for createCampaign
 */
export async function createCampaignOffline(payload: any): Promise<OfflineResult<{ id: string }>> {
  if (isOnline()) {
    try {
      const result = await createCampaign(payload)
      return { data: result, queued: false }
    } catch (error) {
      throw error
    }
  } else {
    const queuedId = await queueAction('createCampaign', payload, {
      status: 'pending',
    })

    if (!syncService.isProcessing()) {
      syncService.processQueue()
    }

    return {
      id: queuedId,
      queued: true,
    }
  }
}

/**
 * Offline-aware wrapper for sendCampaign
 * Note: This should only be called when online since sending requires immediate network access
 * For offline scenarios, use createCampaignOffline with sendImmediately: false, then sync will handle it
 */
export async function sendCampaignOffline(payload: { id: string }): Promise<OfflineResult<any>> {
  if (isOnline()) {
    try {
      const result = await sendCampaign(payload)
      return { data: result, queued: false }
    } catch (error) {
      throw error
    }
  } else {
    // Queue the send action
    const queuedId = await queueAction('sendCampaign', payload, {
      status: 'pending',
    })

    if (!syncService.isProcessing()) {
      syncService.processQueue()
    }

    return {
      id: queuedId,
      queued: true,
    }
  }
}
