import {injectable} from "inversify"
import {IndexedDBOption} from "../types/indexed.db"
import {INDEXED_DB_LAST_LOG, INDEXED_DB_LOG_DETAIL} from "../constants/constants.ts";
import {LogData} from "../types/log.data";

@injectable()
export class IndexedDbWrapper {

  connectRecobleDB(): Promise<IDBDatabase> {
    const options = [
      {
        'storeName': INDEXED_DB_LOG_DETAIL,
        'subOption': {keyPath: 'id', autoIncrement: true}
      },
      {
        'storeName': INDEXED_DB_LAST_LOG,
        'subOption': {keyPath: 'id', autoIncrement: true}
      }
    ]

    return this.connectIndexedDB('RecobleDB', 1, options)
  }

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

  async findAllAndClear(db: IDBDatabase, objectStoreName: string): Promise<any> {
    const list: LogData[] = await this.findAll(db, objectStoreName)
    await this.clearAll(db, objectStoreName)

    return list
  }

  findAll(db: IDBDatabase, objectStoreName: string): Promise<LogData[]>{
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


