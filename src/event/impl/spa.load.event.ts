import {LoadEvent} from "../load.event.ts"
import {inject, injectable} from "inversify"
import {ManageStorageData} from "../../storage/manage.storage.data.ts"
import {FindBrowserInfo} from "../../browserinfo/find.browser.info.ts"
import {ManageConversionInfo} from "../../conversion/manage.conversion.info.ts"
import PAGE_ACTIVITY_TYPE from "../../enums/page.activity.type.ts"

@injectable()
export class SpaLoadEvent implements LoadEvent {
  @inject('ManageStorageData') private manageStorageData!: ManageStorageData
  @inject('FindBrowserInfo') private findBrowserInfo!: FindBrowserInfo
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
      this.manageStorageData.setBrowserInfo(infoDto)
    })
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
