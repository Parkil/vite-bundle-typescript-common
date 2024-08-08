import {inject, injectable} from "inversify"
import {PageActivity} from "../types/page.activity"
import {ManageStorageData} from "../storage/manage.storage.data"
import {ChkMeetsConversion} from "../conversion/chk.meets.conversion"
import {Conversion, LogData} from "../types/log.data"
import {ManageLogData} from "../logdata/manage.log.data.ts"
import {UNLOAD_ENUM} from "../enums/unload.type.ts"
import {formatDate} from "../util";

@injectable()
export class UnLoadEventDetail {
  @inject('ManageStorageData') private manageStorageData!: ManageStorageData
  @inject('ChkMeetsConversion') private chkMeetsConversion!: ChkMeetsConversion
  @inject('ManageLogData') private manageLogData!: ManageLogData

  onUnLoad(currentUrl: string, unloadType: UNLOAD_ENUM = UNLOAD_ENUM.PAGE_UNMOUNT) {

    if (unloadType === UNLOAD_ENUM.PAGE_UNLOAD && this.manageStorageData.findUnloadEventExecuted() === 'true') {
      return
    }

    // todo 전환정보 충족여부 확인 (현재는 임시 구현이며 나중에 변경될 수 있다)
    this.chkMeetsConversion.check()
    const logData = this.#assemblyData(currentUrl)
    this.manageLogData.addLog(logData, unloadType).then(() => {})
    this.manageStorageData.clearUserData(currentUrl)
    this.manageStorageData.clearReviewListStr()

    if (unloadType === UNLOAD_ENUM.PAGE_UNLOAD) {
      this.manageStorageData.setUnloadEventExecuted()
    }
  }

  #assemblyData(currentUrl: string): LogData {
    const browserInfo: Record<string, any> = this.manageStorageData.findBrowserInfo()
    browserInfo['pageUrl'] = currentUrl

    const activityData: PageActivity = this.manageStorageData.findPageActivity()
    const userData: Record<string, any> = this.manageStorageData.findUserData(currentUrl)

    const loginAccount = userData.loginAccount
    const searchWord = userData.searchWord
    const pageName = userData.pageName

    let reviewList = null
    const reviewListStr = this.manageStorageData.findReviewListStr()

    if (reviewListStr) {
      reviewList = reviewListStr.split('|')
    }

    const scrollLoc = this.manageStorageData.findScrollLoc() ?? '0'


    const conversion = this.#assemblyConversion()

    return {
      browserId: this.manageStorageData.findBrowserId(),
      ...(searchWord && {searchWord}),
      ...(pageName && {pageName}),
      ...(reviewList && {reviewList}),
      ...(loginAccount && {loginAccount}),
      ...browserInfo,
      pageStartDtm: this.manageStorageData.findPageStartDtm(),
      pageEndDtm: null,
      pageActivity: {
        view: activityData.VIEW,
        scroll: scrollLoc,
        click: activityData.CLICK,
      },
      pageMoveType: {
        isNextPage: false,
        isExitPage: false,
        isLeavePage: false,
      },
      regDtm: formatDate(new Date()),
      ...(conversion && {conversion}),
    }
  }

  #assemblyConversion(): Conversion | null {
    const userData: Record<string, any> = this.manageStorageData.findUserData()

    const registerUser = userData.user
    const productView = userData.product?.productView
    const productBasket = userData.product?.basketProduct
    const productPurchase = userData.product?.purchaseProduct

    if (!registerUser && !productView && !productBasket && !productPurchase) {
      return null
    } else {
      return {
        ...(registerUser && {registerUser}),
        ...(productView && {productView}),
        ...(productBasket && {productBasket}),
        ...(productPurchase && {productPurchase}),
      }
    }
  }
}
