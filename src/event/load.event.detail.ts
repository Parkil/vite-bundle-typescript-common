import {inject, injectable} from "inversify"
import {ManageStorageData} from "../storage/manage.storage.data"
import {FindBrowserInfo} from "../browserinfo/find.browser.info"
import {ManageConversionInfo} from "../conversion/manage.conversion.info"
import PAGE_ACTIVITY_TYPE from "../enums/page.activity.type"
import {SendHttpRequest} from "../sendhttprequest/send.http.request"
import {findApiKeyHeader} from "../util"
import {BrowserInfoDto} from "../dtos"

@injectable()
export class LoadEventDetail {
  @inject('ManageStorageData') private manageStorageData!: ManageStorageData
  @inject('FindBrowserInfo') private findBrowserInfo!: FindBrowserInfo
  @inject('SendHttpRequest') private sendHttpRequest!: SendHttpRequest
  @inject('ManageConversionInfo') private manageConversionInfo!: ManageConversionInfo

  onLoad() {
    this.#setBasicInfo()
    this.#updateInCompleteLogInfo()
    this.#execChkConversion()
    this.#postProcess()
  }

  #setBasicInfo() {
    this.manageStorageData.setBrowserId(this.manageStorageData.findCurrentHostName() ?? "")
  }

  #updateInCompleteLogInfo() {
    this.findBrowserInfo.findInfo().then((infoDto) => {
      this.#sendLog(infoDto)
    })
  }

  #sendLog(infoDto: BrowserInfoDto) {
    this.manageStorageData.setBrowserInfo(infoDto)
    const incompleteLogInfo = this.manageStorageData.findIncompleteLogInfo()
    this.manageStorageData.setPageStartDtm(new Date())

    if (incompleteLogInfo) {
      const browserInfoDto = this.manageStorageData.findBrowserInfo()

      const data = {
        pageEndDtm: this.manageStorageData.findPageStartDtm(),
        nextUrl: browserInfoDto.pageUrl,
        prevUrl: incompleteLogInfo.pageUrl,
        browserId: incompleteLogInfo.browserId,
        domain: this.manageStorageData.findCurrentHostName() ?? "",
      }

      if (data.prevUrl !== data.nextUrl) {
        this.sendHttpRequest.updateInCompleteLogInfo(findApiKeyHeader(), data).then(() => {})
        this.manageStorageData.clearIncompleteLogInfo()
      }
    }
  }

  #execChkConversion() {
    this.manageConversionInfo.chkIsConversionInfoUpdated().then((isConversionInfoUpdated) => {
      if (isConversionInfoUpdated) {
        this.manageConversionInfo.updateConversionInfo().then(() => {})
      }
    })
  }

  #postProcess() {
    this.manageStorageData.setPageActivity(PAGE_ACTIVITY_TYPE.VIEW, true)
    this.manageStorageData.clearUnloadEventExecuted()
  }
}
