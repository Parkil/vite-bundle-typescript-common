import container from "./config/inversify_config"
import {ManageSaveUserData} from "./userdata/manage.save.user.data.ts"
import {ManageStorageData} from "./storage/manage.storage.data.ts"
import {ScrappingReview} from "./scrapping/scrapping.review.ts"
import {chkBrowserIsValid, printErrorMsg} from "./util"
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

export const runSpaUnMountEvent = (url: string) => {
  spaUnloadEvent.onUnMount(url)
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

const isScriptInserted = (uniqueStr: string): boolean => {
  const scriptTags = document.getElementsByTagName('script')
  let isScriptInserted: boolean = false

  for(const element of scriptTags) {
    if (element.innerHTML.indexOf(uniqueStr) !== -1) {
      isScriptInserted = true
    }
  }

  return isScriptInserted
}

export const insertSpaPageCloseEventScript = (scriptContent: string, uniqueStr: string) => {

  if (isScriptInserted(uniqueStr)) {
    return
  }

  const script = document.createElement('script')
  script.defer = true
  script.innerHTML = scriptContent
  document.head.appendChild(script)
}

export const errorMsg = (msg: string) => {
  printErrorMsg(msg)
}

export const setWindowEvent = (eventName: string, listener: Function) => {
  if (!chkBrowserIsValid()) {
    printErrorMsg("웹 브라우저 환경이 아닙니다")
    return
  }

  window.addEventListener(eventName, listener as EventListener)
}

export const setDocumentEvent = (eventName: string, listener: Function) => {
  if (!chkBrowserIsValid()) {
    printErrorMsg("웹 브라우저 환경이 아닙니다")
    return
  }

  document.addEventListener(eventName, listener as EventListener)
}
