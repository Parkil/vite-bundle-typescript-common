import container from "./config/inversify_config"
import {ManageSaveUserData} from "./userdata/manage.save.user.data.ts"
import {ManageStorageData} from "./storage/manage.storage.data.ts"
import {ScrappingReview} from "./scrapping/scrapping.review.ts"
import {printErrorMsg} from "./util"
import {SpaLoadEvent} from "./event/impl/spa.load.event.ts"
import {SpaUnloadEvent} from "./event/impl/spa.unload.event.ts"
import {WebLoadEvent} from "./event/impl/web.load.event.ts"
import {WebUnloadEvent} from "./event/impl/web.unload.event.ts"

const spaLoadEvent = container.get<SpaLoadEvent>('SpaLoadEvent')
const spaUnloadEvent = container.get<SpaUnloadEvent>('SpaUnloadEvent')
const webLoadEvent = container.get<WebLoadEvent>('WebLoadEvent')
const webUnloadEvent = container.get<WebUnloadEvent>('WebUnloadEvent')
const manageSaveUserData = container.get<ManageSaveUserData>('ManageSaveUserData')
const manageStorageData = container.get<ManageStorageData>('ManageStorageData')
const scrappingReview = container.get<ScrappingReview>('ScrappingReview')

export const runSpaLoadEvent = () => {
  spaLoadEvent.onload()
}

export const runWebLoadEvent = () => {
  webLoadEvent.onload()
}

export const runSpaUnloadEvent = (url: string) => {
  spaUnloadEvent.onUnload(url)
}

export const runWebUnloadEvent = () => {
  webUnloadEvent.onUnload()
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

export const insertSpaPageCloseEventScript = () => {

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

export const errorMsg = (msg: string) => {
  printErrorMsg(msg)
}
