const DB_NAME = 'webora_media'
const STORE_NAME = 'assets'
const DB_VERSION = 1

function openDatabase() {
  if (!('indexedDB' in window)) {
    return Promise.reject(new Error('This browser does not support persistent media storage.'))
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new Error('Unable to open media storage.'))
    request.onblocked = () => reject(new Error('Media storage is blocked by another browser tab.'))
  })
}

function runTransaction(mode, operation) {
  return openDatabase().then((database) => new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode)
    const store = transaction.objectStore(STORE_NAME)
    let result
    try {
      result = operation(store)
    } catch (error) {
      database.close()
      reject(error)
      return
    }
    transaction.oncomplete = () => {
      database.close()
      resolve(result?.result)
    }
    transaction.onerror = () => {
      database.close()
      reject(new Error('Media storage operation failed.'))
    }
    transaction.onabort = () => {
      database.close()
      reject(new Error('Media storage operation was cancelled.'))
    }
  }))
}

export function putMediaBlob(id, blob) {
  return runTransaction('readwrite', (store) => store.put(blob, id))
}

export function getMediaBlob(id) {
  return runTransaction('readonly', (store) => store.get(id))
}

export function deleteMediaBlob(id) {
  return runTransaction('readwrite', (store) => store.delete(id))
}
