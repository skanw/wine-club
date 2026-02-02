import { openDB, DBSchema, IDBPDatabase } from 'idb'

export interface QueuedAction {
  id: string
  type: 'createMember' | 'createCampaign' | 'sendCampaign'
  payload: any
  metadata: {
    timestamp: Date
    retryCount: number
    lastError?: string
    status: 'pending' | 'syncing' | 'synced' | 'failed'
  }
}

interface VinClubDB extends DBSchema {
  queuedActions: {
    key: string
    value: QueuedAction
    indexes: { 'by-status': string; 'by-type': string; 'by-timestamp': Date }
  }
  pendingSyncs: {
    key: string
    value: {
      id: string
      actionId: string
      timestamp: Date
      status: 'syncing' | 'failed'
    }
    indexes: { 'by-action-id': string }
  }
}

const DB_NAME = 'vinclub-offline'
const DB_VERSION = 1

let dbInstance: IDBPDatabase<VinClubDB> | null = null

export async function getDB(): Promise<IDBPDatabase<VinClubDB>> {
  if (dbInstance) {
    return dbInstance
  }

  dbInstance = await openDB<VinClubDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create queuedActions store
      if (!db.objectStoreNames.contains('queuedActions')) {
        const actionStore = db.createObjectStore('queuedActions', {
          keyPath: 'id',
        })
        actionStore.createIndex('by-status', 'metadata.status')
        actionStore.createIndex('by-type', 'type')
        actionStore.createIndex('by-timestamp', 'metadata.timestamp')
      }

      // Create pendingSyncs store (for tracking in-progress syncs)
      if (!db.objectStoreNames.contains('pendingSyncs')) {
        const syncStore = db.createObjectStore('pendingSyncs', {
          keyPath: 'id',
        })
        syncStore.createIndex('by-action-id', 'actionId')
      }
    },
  })

  return dbInstance
}

export async function closeDB(): Promise<void> {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}
