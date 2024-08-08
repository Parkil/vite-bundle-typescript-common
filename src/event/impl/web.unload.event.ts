import {UnloadEvent} from "../unload.event.ts"
import {inject, injectable} from "inversify"
import {ManageStorageData} from "../../storage/manage.storage.data.ts"
import {ChkMeetsConversion} from "../../conversion/chk.meets.conversion.ts"
import {SendHttpRequest} from "../../sendhttprequest/send.http.request.ts"
import {ScrappingReview} from "../../scrapping/scrapping.review.ts"
import {UNLOAD_ENUM} from "../../enums/unload.type.ts"
import {calcScrollLoc, findApiKeyHeader, formatDate} from "../../util"
import PAGE_ACTIVITY_TYPE from "../../enums/page.activity.type.ts"
import {PageActivity} from "../../types/page.activity"
import {LOG_SERVER_SEND_LOG_URL} from "../../constants/constants.ts";

@injectable()
export class WebUnloadEvent implements UnloadEvent {
  @inject('ManageStorageData') private manageStorageData!: ManageStorageData
  @inject('ChkMeetsConversion') private chkMeetsConversion!: ChkMeetsConversion
  @inject('SendHttpRequest') private sendHttpRequest!: SendHttpRequest
  @inject('ScrappingReview') private scrappingReview!: ScrappingReview

  onUnload(_?: string, __?: UNLOAD_ENUM) {
    // window sessionStorage 가 비동기 상황에서 정상적으로 작동하지 않는다
    if (this.manageStorageData.findUnloadEventExecuted() === 'true') {
      return
    }

    this.manageStorageData.setPageActivity(PAGE_ACTIVITY_TYPE.SCROLL, calcScrollLoc())
    // todo 전환정보 충족여부 확인 (현재는 임시 구현이며 나중에 변경될 수 있다)
    this.chkMeetsConversion.check()

    const data = this.#assemblyData()
    const userAgent = this.manageStorageData.findBrowserInfo()['userAgent']

    const apiKeyHeader = findApiKeyHeader()
    this.sendHttpRequest.sendLog(LOG_SERVER_SEND_LOG_URL, data, userAgent, apiKeyHeader).then(() => {})

    this.manageStorageData.setIncompleteLogInfo(this.manageStorageData.findBrowserId(), window.location.href)
    this.manageStorageData.setUnloadEventExecuted()
    this.manageStorageData.clearUserData()
  }

  #assemblyData(): object {
    const browserInfo: Record<string, any> = this.manageStorageData.findBrowserInfo()
    const activityData: PageActivity = this.manageStorageData.findPageActivity()
    const userData: Record<string, any> = this.manageStorageData.findUserData()

    const loginAccount = userData.loginAccount
    const reviewSelector = userData.reviewSelector
    const searchWord = userData.searchWord
    const pageName = userData.pageName

    let reviewList = null

    if (reviewSelector) {
      reviewList = this.scrappingReview.findReviewContents(
        reviewSelector['list_area_selector'], reviewSelector['row_contents_selector'], document)
    }

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
        scroll: activityData.SCROLL,
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

  #assemblyConversion() {
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
