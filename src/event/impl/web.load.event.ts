import {LoadEvent} from "../load.event.ts"
import {inject, injectable} from "inversify"
import {ManageStorageData} from "../../storage/manage.storage.data.ts"
import {FindBrowserInfo} from "../../browserinfo/find.browser.info.ts"
import {SendHttpRequest} from "../../sendhttprequest/send.http.request.ts"
import {ManageConversionInfo} from "../../conversion/manage.conversion.info.ts"
import {BrowserInfoDto} from "../../dtos"
import {findApiKeyHeader} from "../../util"
import PAGE_ACTIVITY_TYPE from "../../enums/page.activity.type.ts"

@injectable()
export class WebLoadEvent implements LoadEvent {
  @inject('ManageStorageData') private manageStorageData!: ManageStorageData
  @inject('FindBrowserInfo') private findBrowserInfo!: FindBrowserInfo
  @inject('SendHttpRequest') private sendHttpRequest!: SendHttpRequest
  @inject('ManageConversionInfo') private manageConversionInfo!: ManageConversionInfo

  onload(): void {
    this.#setBasicInfo()
    this.#updateInCompleteLogInfo()
    this.#execChkConversion()
    this.#postProcess()
  }

  #setBasicInfo() {
    this.manageStorageData.setBrowserId(window.location.hostname)
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
        domain: window.location.hostname,
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
