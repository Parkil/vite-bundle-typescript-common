import {inject, injectable} from "inversify"
import {IndexedDbWrapper} from "../indexeddb/indexed.db.wrapper.ts"
import {INDEXED_DB_LAST_LOG, INDEXED_DB_LOG_DETAIL} from "../constants/constants.ts"
import {findApiKeyHeader, printErrorMsg} from "../util"
import {SetCompleteInfo} from "./set.complete.info.ts"
import {LogData} from "../types/log.data"
import {SendHttpRequest} from "../sendhttprequest/send.http.request.ts"
import {UNLOAD_ENUM} from "../enums/unload.type.ts"

@injectable()
export class ManageLogData {
  @inject('IndexedDbWrapper') private indexedDbWrapper!: IndexedDbWrapper
  @inject('SetCompleteInfo') private setCompleteInfo!: SetCompleteInfo
  @inject('SendHttpRequest') private sendHttpRequest!: SendHttpRequest

  /*
    0. INDEXED_DB_LOG_DETAIL 에 데이터 추가
    1. INDEXED_DB_LOG_DETAIL 의 전체 데이터 가져오기
    2. INDEXED_DB_LOG_DETAIL 의 데이터 개수가 capacity 와 같거나 큰지 확인
      2-1. 조건 해당 안됨 -> 종료
      2-2. 조건 해당 됨
        2-2-1. 기존 INDEXED_DB_LAST_LOG 데이터를 가져와서 1번 데이터 앞에 붙임
        2-2-2. 2-2-1 데이터 정제
          2-2-1 리스트 first -> last 순으로 돌면서
            pageMoveType - 다음 index 에 값이 존재하면 next = true, 없으면 전부 false
            pageEndDtm - 다음 index에 값이 존재하면 다음 index 의 pageStartDtm, 없으면 null
            refererer - 이전 index에 값이 존재하면 이전 index의 pageURL 없으면 null
        2.2.3. INDEXED_DB_LAST_LOG clear
        2.2.4. 2-2-2 리스트의 마지막 값을 가져와서 INDEXED_DB_LAST_LOG 에 저장
        2.2.5. 로그서버에 데이터 전송
        2.2.6. INDEXED_DB_LOG_DETAIL clear
        2.2.7. unloadType 이 PAGE_UNLOAD 일 경우 INDEXED_DB_LAST_LOG clear
     */
  async addLog(logData: LogData, unloadType: UNLOAD_ENUM): Promise<void> {
    const database: IDBDatabase = await this.#connectDB()
    const addDataResult = await this.indexedDbWrapper.addData(database, INDEXED_DB_LOG_DETAIL, logData)

    if (!addDataResult) {
      printErrorMsg(`Log Data Not Inserted : ${JSON.stringify(logData)}`)
      return
    }

    const logDetailList = await this.indexedDbWrapper.findAll(database, INDEXED_DB_LOG_DETAIL)

    if (logDetailList.length !== 0 && logDetailList.length >= unloadType.capacity) {
      const lastLogList = await this.indexedDbWrapper.findAll(database, INDEXED_DB_LAST_LOG)
      const concatList = [...lastLogList, ...logDetailList]

      const completeList = await this.setCompleteInfo.setInfo(concatList)

      await this.indexedDbWrapper.clearAll(database, INDEXED_DB_LAST_LOG)
      const lastElement = concatList[completeList.length - 1]
      lastElement.lastLogFlag = true
      await this.indexedDbWrapper.addData(database, INDEXED_DB_LAST_LOG, lastElement)

      const userAgentStr = completeList[0].userAgent
      const apiKeyHeader = findApiKeyHeader()

      await this.indexedDbWrapper.clearAll(database, INDEXED_DB_LOG_DETAIL)
      if (unloadType === UNLOAD_ENUM.PAGE_UNLOAD) {
        await this.indexedDbWrapper.clearAll(database, INDEXED_DB_LAST_LOG)
      }

      await this.sendHttpRequest.sendLog(completeList, userAgentStr, apiKeyHeader)
    }
  }

  async #connectDB(): Promise<IDBDatabase> {
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

    return this.indexedDbWrapper.connectIndexedDB('RecobleDB', 1, options)
  }
}
