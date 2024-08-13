import {LoadEvent} from "../load.event.ts"
import {inject, injectable} from "inversify"
import {ManageStorageData} from "../../storage/manage.storage.data.ts"
import {FindBrowserInfo} from "../../browserinfo/find.browser.info.ts"
import {ManageConversionInfo} from "../../conversion/manage.conversion.info.ts"
import PAGE_ACTIVITY_TYPE from "../../enums/page.activity.type.ts"
import {IndexedDbWrapper} from "../../indexeddb/indexed.db.wrapper.ts";
import {INDEXED_DB_LAST_LOG, INDEXED_DB_LOG_DETAIL} from "../../constants/constants.ts"

@injectable()
export class SpaLoadEvent implements LoadEvent {
  @inject('ManageStorageData') private manageStorageData!: ManageStorageData
  @inject('FindBrowserInfo') private findBrowserInfo!: FindBrowserInfo
  @inject('ManageConversionInfo') private manageConversionInfo!: ManageConversionInfo
  @inject('IndexedDbWrapper') private indexedDbWrapper!: IndexedDbWrapper

  onload(): void {
    this.#initIndexedDB()
    this.#saveIndexedDBData()
    this.#setBasicInfo()
    this.#updateInCompleteLogInfo()
    this.#execChkConversion()
    this.#postProcess()
  }

  #initIndexedDB() {
    const isInit = this.manageStorageData.findIsIndexedDBInit()
    if (!isInit) {
      (async function (indexedDbWrapper) {
        const db = await indexedDbWrapper.connectRecobleDB()
        await indexedDbWrapper.clearAll(db, INDEXED_DB_LOG_DETAIL)
        await indexedDbWrapper.clearAll(db, INDEXED_DB_LAST_LOG)
      })(this.indexedDbWrapper).then(() => {})
      this.manageStorageData.setIsIndexedDBInit(true)
    }
  }

  #saveIndexedDBData() {
    (async function (indexedDbWrapper) {
      const db = await indexedDbWrapper.connectRecobleDB()
      const logDetailList = await indexedDbWrapper.findAll(db, INDEXED_DB_LOG_DETAIL)
      const lastLogList = await indexedDbWrapper.findAll(db, INDEXED_DB_LAST_LOG)

      return {'logDetailList': logDetailList, 'lastLogList': lastLogList}
    })(this.indexedDbWrapper).then((result) => {
      this.manageStorageData.setLogDetailList(result['logDetailList'])
      this.manageStorageData.setLastLogList(result['lastLogList'])
    })
  }

  #setBasicInfo() {
    this.manageStorageData.setBrowserId(window.location.hostname)
    this.manageStorageData.setPageStartDtm(new Date())
  }

  #updateInCompleteLogInfo() {
    this.findBrowserInfo.findInfo().then((infoDto) => {
      this.manageStorageData.setBrowserInfo(infoDto)
    })
  }

  #execChkConversion() {
    this.manageConversionInfo.chkIsConversionInfoUpdated().then((isConversionInfoUpdated) => {
      if (isConversionInfoUpdated) {
        this.manageConversionInfo.updateConversionInfo().then(() => {
        })
      }
    })
  }

  #postProcess() {
    this.manageStorageData.setPageActivity(PAGE_ACTIVITY_TYPE.VIEW, true)
    this.manageStorageData.clearUnloadEventExecuted()
  }
}
