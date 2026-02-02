import { useOfflineStatus } from '../hooks/useOfflineStatus'

export function OfflineIndicator() {
  const { isOnline, queuedCount, isSyncing } = useOfflineStatus()

  // Don't show anything if online, synced, and no queued actions
  if (isOnline && queuedCount === 0 && !isSyncing) {
    return null
  }

  // Get status text and dot color
  const getStatus = () => {
    if (!isOnline) {
      return { 
        text: queuedCount > 0 ? `Hors ligne (${queuedCount})` : 'Hors ligne', 
        dotColor: 'bg-yellow-500' 
      }
    }
    if (isSyncing) {
      return { text: 'Synchro...', dotColor: 'bg-blue-500 animate-pulse' }
    }
    if (queuedCount > 0) {
      return { text: `En attente (${queuedCount})`, dotColor: 'bg-orange-500' }
    }
    return { text: 'Synchronisé', dotColor: 'bg-green-500' }
  }

  const status = getStatus()

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full shadow-sm">
        <span className={`w-2 h-2 rounded-full ${status.dotColor}`} />
        <span className="text-xs text-muted-foreground">{status.text}</span>
      </div>
    </div>
  )
}
