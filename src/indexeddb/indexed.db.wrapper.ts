import {injectable} from "inversify"
import {IndexedDBOption} from "../types/indexed.db"

@injectable()
export class IndexedDbWrapper {
  connectIndexedDB(dbName: string, version: number, options?: IndexedDBOption[]): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version)

      request.onsuccess = () => {
        const db = request.result
        resolve(db)
      }

      request.onerror = () => {
        reject(new Error(`IndexedDB Connect error: ${request.error}`))
      }

      request.onupgradeneeded = () => {
        const db = request.result

        options?.forEach((option) => {
          db.createObjectStore(option.storeName, option.subOption)
        })
      }
    })
  }

  addData(db: IDBDatabase, objectStoreName: string, data: any): Promise<boolean>{
    return new Promise((resolve, reject) => {
      const request = db.transaction([objectStoreName], 'readwrite').objectStore(objectStoreName).add(data)

      request.onsuccess = () => {
        resolve(true)
      }

      request.onerror = () => {
        reject(new Error(`IndexedDB addData error: ${request.error}`))
      }
    })
  }

  findAll(db: IDBDatabase, objectStoreName: string): Promise<any>{
    return new Promise((resolve, reject) => {
      const request = db.transaction([objectStoreName], 'readonly').objectStore(objectStoreName).getAll()

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(new Error(`IndexedDB findAll error: ${request.error}`))
      }
    })
  }

  clearAll(db: IDBDatabase, objectStoreName: string): Promise<boolean>{
    return new Promise((resolve, reject) => {
      const request = db.transaction([objectStoreName], 'readwrite').objectStore(objectStoreName).clear()

      request.onsuccess = () => {
        resolve(true)
      }

      request.onerror = () => {
        reject(new Error(`IndexedDB clearAll error: ${request.error}`))
      }
    })
  }
}


