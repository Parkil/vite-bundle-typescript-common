import container from "./config/inversify_config"
import {LoadEventDetail} from "./event/load.event.detail.ts"
import {ManageSaveUserData} from "./userdata/manage.save.user.data.ts"
import {ManageStorageData} from "./storage/manage.storage.data.ts"
import {UnLoadEventDetail} from "./event/unload.event.detail.ts"
import {ScrappingReview} from "./scrapping/scrapping.review.ts"
import {printErrorMsg} from "./util"

const loadEventDetail = container.get<LoadEventDetail>('LoadEventDetail')
const unLoadEventDetail = container.get<UnLoadEventDetail>('UnLoadEventDetail')
const manageSaveUserData = container.get<ManageSaveUserData>('ManageSaveUserData')
const manageStorageData = container.get<ManageStorageData>('ManageStorageData')
const scrappingReview = container.get<ScrappingReview>('ScrappingReview')


export const runLoadEvent = () => {
  loadEventDetail.onLoad()
}

export const runUnloadEvent = (url: string) => {
  unLoadEventDetail.onUnLoad(url)
}

export const findReviewContents = (url: string) => {
  const userData = manageStorageData.findUserData(url)

  if (userData.reviewSelector) {
    const reviewList = scrappingReview.findReviewContents(
      userData.reviewSelector.list_area_selector,
      userData.reviewSelector.row_contents_selector,
      document)

    manageStorageData.setReviewListStr(reviewList.join('|'))
  } else {
    printErrorMsg(`review selector not found: ${url}`)
  }
}

export const saveApiKey = (apiKey: string) => {
  manageStorageData.setApiKey(apiKey)
}

export const saveUrl = (url: string) => {
  manageStorageData.setCurrentUrl(url)
}

export const saveHostName = (hostname: string) => {
  manageStorageData.setCurrentHostName(hostname)
}

export const saveUserData = (paramArr: { [key: string]: any }[]) => {
  manageSaveUserData.save(paramArr)
}

const isScriptInserted = (): boolean => {
  const scriptTags = document.getElementsByTagName('script')
  let isScriptInserted: boolean = false

  for(const element of scriptTags) {
    if (element.innerHTML.indexOf('recoble script') !== -1) {
      isScriptInserted = true
    }
  }

  return isScriptInserted
}

export const insertScript = () => {

  if (isScriptInserted()) {
    return
  }

  const script = document.createElement('script')
  script.innerHTML = `
    // recoble script
    console.log('recoble script')
  `
  document.head.appendChild(script)
}

