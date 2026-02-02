import {
  getQueuedActions,
  updateQueuedActionStatus,
  removeQueuedAction,
  queueAction,
  type QueuedAction,
} from './queue-manager'
import { createMember } from 'wasp/client/operations'
import { createCampaign, sendCampaign } from 'wasp/client/operations'

type SyncEventType = 'sync-start' | 'sync-complete' | 'sync-error' | 'action-synced' | 'action-failed'

interface SyncEvent {
  type: SyncEventType
  actionId?: string
  actionType?: string
  error?: string
  queuedCount?: number
}

type SyncEventListener = (event: SyncEvent) => void

const MAX_RETRIES = 3
const RETRY_DELAY_BASE = 1000 // 1 second base delay

class SyncService {
  private listeners: Set<SyncEventListener> = new Set()
  private isSyncing = false
  private syncAborted = false

  addListener(listener: SyncEventListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private emit(event: SyncEvent): void {
    this.listeners.forEach((listener) => listener(event))
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private async syncSingleAction(action: QueuedAction): Promise<boolean> {
    try {
      // Update status to syncing
      await updateQueuedActionStatus(action.id, 'syncing')
      this.emit({
        type: 'action-synced',
        actionId: action.id,
        actionType: action.type,
        queuedCount: (await getQueuedActions('pending')).length,
      })

      let result: any

      // Execute the actual operation based on action type
      switch (action.type) {
        case 'createMember':
          result = await createMember(action.payload)
          break
        case 'createCampaign':
          result = await createCampaign(action.payload)
          // If campaign was created and should be sent immediately
          if (action.payload.sendImmediately && result?.id) {
            try {
              await sendCampaign({ id: result.id })
            } catch (sendError: any) {
              // If send fails, queue the send action separately
              console.warn('Failed to send campaign immediately, will queue:', sendError)
              await queueAction('sendCampaign', { id: result.id }, {
                status: 'pending',
              })
            }
          }
          break
        case 'sendCampaign':
          result = await sendCampaign(action.payload)
          break
        default:
          throw new Error(`Unknown action type: ${(action as any).type}`)
      }

      // Success - remove from queue
      await removeQueuedAction(action.id)
      return true
    } catch (error: any) {
      const errorMessage = error?.message || String(error)
      
      // Check if it's a duplicate/conflict error
      const isConflictError =
        errorMessage.includes('déjà existant') ||
        errorMessage.includes('already exists') ||
        errorMessage.includes('duplicate') ||
        errorMessage.includes('unique constraint')

      if (isConflictError && action.metadata.retryCount >= 1) {
        // Conflict after retry - likely duplicate, remove from queue
        await removeQueuedAction(action.id)
        this.emit({
          type: 'action-failed',
          actionId: action.id,
          actionType: action.type,
          error: 'Action déjà effectuée (doublon détecté)',
        })
        return true // Consider resolved (duplicate)
      }

      // Check retry count
      if (action.metadata.retryCount >= MAX_RETRIES) {
        // Max retries reached - mark as failed
        await updateQueuedActionStatus(action.id, 'failed', errorMessage)
        this.emit({
          type: 'action-failed',
          actionId: action.id,
          actionType: action.type,
          error: errorMessage,
        })
        return false
      }

      // Retry with exponential backoff
      const delay = RETRY_DELAY_BASE * Math.pow(2, action.metadata.retryCount)
      await this.delay(delay)
      await updateQueuedActionStatus(action.id, 'pending', errorMessage)
      return false
    }
  }

  async processQueue(): Promise<void> {
    if (this.isSyncing) {
      return
    }

    if (!navigator.onLine) {
      return
    }

    this.isSyncing = true
    this.syncAborted = false

    try {
      const pendingActions = await getQueuedActions('pending')

      if (pendingActions.length === 0) {
        this.isSyncing = false
        return
      }

      // Sort by timestamp (oldest first)
      pendingActions.sort(
        (a, b) =>
          a.metadata.timestamp.getTime() - b.metadata.timestamp.getTime()
      )

      this.emit({
        type: 'sync-start',
        queuedCount: pendingActions.length,
      })

      // Process actions sequentially
      for (const action of pendingActions) {
        if (this.syncAborted || !navigator.onLine) {
          break
        }

        await this.syncSingleAction(action)

        // Small delay between actions to avoid overwhelming the server
        await this.delay(100)
      }

      const remainingCount = (await getQueuedActions('pending')).length

      this.emit({
        type: 'sync-complete',
        queuedCount: remainingCount,
      })
    } catch (error: any) {
      this.emit({
        type: 'sync-error',
        error: error?.message || String(error),
      })
    } finally {
      this.isSyncing = false
    }
  }

  abort(): void {
    this.syncAborted = true
  }

  isProcessing(): boolean {
    return this.isSyncing
  }
}

// Singleton instance
export const syncService = new SyncService()

// Auto-process queue when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncService.processQueue()
  })
}

// Process queue periodically in case online event was missed
if (typeof window !== 'undefined') {
  setInterval(() => {
    if (navigator.onLine && !syncService.isProcessing()) {
      syncService.processQueue()
    }
  }, 30000) // Check every 30 seconds
}
