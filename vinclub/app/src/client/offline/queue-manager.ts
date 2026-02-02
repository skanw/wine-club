import { getDB, type QueuedAction } from './db'

export type { QueuedAction } from './db'

export type QueuedActionType = QueuedAction['type']
export type QueuedActionStatus = QueuedAction['metadata']['status']

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export async function queueAction(
  type: QueuedActionType,
  payload: any,
  metadata?: Partial<QueuedAction['metadata']>
): Promise<string> {
  const db = await getDB()
  const id = generateId()

  const action: QueuedAction = {
    id,
    type,
    payload,
    metadata: {
      timestamp: new Date(),
      retryCount: 0,
      status: 'pending',
      ...metadata,
    },
  }

  await db.add('queuedActions', action)
  return id
}

export async function getQueuedActions(
  status?: QueuedActionStatus
): Promise<QueuedAction[]> {
  const db = await getDB()

  if (status) {
    const index = db.transaction('queuedActions').store.index('by-status')
    return index.getAll(status)
  }

  return db.getAll('queuedActions')
}

export async function getQueuedActionById(id: string): Promise<QueuedAction | undefined> {
  const db = await getDB()
  return db.get('queuedActions', id)
}

export async function removeQueuedAction(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('queuedActions', id)
}

export async function updateQueuedActionStatus(
  id: string,
  status: QueuedActionStatus,
  error?: string
): Promise<void> {
  const db = await getDB()
  const action = await db.get('queuedActions', id)

  if (!action) {
    throw new Error(`Queued action ${id} not found`)
  }

  action.metadata.status = status
  if (error) {
    action.metadata.lastError = error
  }
  if (status === 'syncing') {
    action.metadata.retryCount += 1
  }

  await db.put('queuedActions', action)
}

export async function getQueuedActionsByType(
  type: QueuedActionType
): Promise<QueuedAction[]> {
  const db = await getDB()
  const index = db.transaction('queuedActions').store.index('by-type')
  return index.getAll(type)
}

export async function getPendingActionsCount(): Promise<number> {
  const db = await getDB()
  const index = db.transaction('queuedActions').store.index('by-status')
  return index.count('pending')
}

export async function clearSyncedActions(): Promise<number> {
  const db = await getDB()
  const index = db.transaction('queuedActions').store.index('by-status')
  const synced = await index.getAll('synced')

  await Promise.all(synced.map((action) => db.delete('queuedActions', action.id)))

  return synced.length
}
