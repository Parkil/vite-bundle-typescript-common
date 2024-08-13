import {inject, injectable} from "inversify"
import {IndexedDbWrapper} from "../indexeddb/indexed.db.wrapper.ts"
import {INDEXED_DB_LAST_LOG, INDEXED_DB_LOG_DETAIL, LOG_SERVER_SEND_LOGS_URL} from "../constants/constants.ts"
import {findApiKeyHeader, printErrorMsg} from "../util"
import {SetCompleteInfo} from "./set.complete.info.ts"
import {LogData} from "../types/log.data"
import {SendHttpRequest} from "../sendhttprequest/send.http.request.ts"
import {UNLOAD_ENUM} from "../enums/unload.type.ts"
import {ManageStorageData} from "../storage/manage.storage.data.ts";

@injectable()
export class ManageLogData {
  @inject('IndexedDbWrapper') private indexedDbWrapper!: IndexedDbWrapper
  @inject('SetCompleteInfo') private setCompleteInfo!: SetCompleteInfo
  @inject('SendHttpRequest') private sendHttpRequest!: SendHttpRequest
  @inject('ManageStorageData') private manageStorageData!: ManageStorageData

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
     */
  async addUnMountLog(logData: LogData): Promise<void> {
    const database: IDBDatabase = await this.indexedDbWrapper.connectRecobleDB()
    const addDataResult = await this.indexedDbWrapper.addData(database, INDEXED_DB_LOG_DETAIL, logData)

    if (!addDataResult) {
      printErrorMsg(`Log Data Not Inserted : ${JSON.stringify(logData)}`)
      return
    }

    const logDetailList = await this.indexedDbWrapper.findAll(database, INDEXED_DB_LOG_DETAIL)

    if (logDetailList.length !== 0 && logDetailList.length >= UNLOAD_ENUM.PAGE_UNMOUNT.capacity) {
      const lastLogList = await this.indexedDbWrapper.findAllAndClear(database, INDEXED_DB_LAST_LOG)
      const concatList = [...lastLogList, ...logDetailList]

      const completeList = await this.setCompleteInfo.setInfoAsync(concatList)

      const lastElement = concatList[completeList.length - 1]
      lastElement.lastLogFlag = true
      await this.indexedDbWrapper.addData(database, INDEXED_DB_LAST_LOG, lastElement)

      await this.indexedDbWrapper.clearAll(database, INDEXED_DB_LOG_DETAIL)
      await this.sendHttpRequest.sendLog(LOG_SERVER_SEND_LOGS_URL, completeList, logData.userAgent, findApiKeyHeader())
    }
  }

  addUnloadLog(logData: LogData): void {
    let logDetailList = this.manageStorageData.findLogDetailList()
    const lastLogList = this.manageStorageData.findLastLogList()

    logDetailList = [...logDetailList, logData]
    const concatList = [...lastLogList, ...logDetailList]
    const completeList = this.setCompleteInfo.setInfoSync(concatList)
    this.sendHttpRequest.sendLog(LOG_SERVER_SEND_LOGS_URL, completeList, logData.userAgent, findApiKeyHeader()).then(() => {})
  }
}
