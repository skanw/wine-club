import { useState, useEffect } from 'react'
import { isOnline } from '../offline/offline-operations'
import { getPendingActionsCount } from '../offline/queue-manager'
import { syncService } from '../offline/sync-service'

interface OfflineStatus {
  isOnline: boolean
  queuedCount: number
  isSyncing: boolean
}

export function useOfflineStatus(): OfflineStatus {
  const [online, setOnline] = useState(isOnline())
  const [queuedCount, setQueuedCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Update queued count periodically
    const updateQueuedCount = async () => {
      try {
        const count = await getPendingActionsCount()
        setQueuedCount(count)
      } catch (error) {
        console.error('Error getting queued actions count:', error)
      }
    }

    updateQueuedCount()
    const interval = setInterval(updateQueuedCount, 5000) // Update every 5 seconds

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  // Listen to sync events
  useEffect(() => {
    const handleSyncStart = () => setIsSyncing(true)
    const handleSyncComplete = () => setIsSyncing(false)

    const unsubscribe = syncService.addListener((event: any) => {
      if (event.type === 'sync-start') {
        handleSyncStart()
      } else if (event.type === 'sync-complete' || event.type === 'sync-error') {
        handleSyncComplete()
        // Update queued count after sync
        getPendingActionsCount().then(setQueuedCount).catch(console.error)
      } else if (event.type === 'action-synced') {
        // Update queued count when action is synced
        if (event.queuedCount !== undefined) {
          setQueuedCount(event.queuedCount)
        }
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return {
    isOnline: online,
    queuedCount,
    isSyncing,
  }
}
