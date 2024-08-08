import {inject, injectable} from "inversify"
import {GenBrowserId} from "../generateid/gen.browser.id"
import {
  RECOBLE_BROWSER_ID_KEY,
  RECOBLE_BROWSER_INFO_KEY,
  RECOBLE_CONVERSION_INFO_KEY,
  RECOBLE_PAGE_ACTIVITY_KEY,
  RECOBLE_PAGE_START_DTM_KEY,
  RECOBLE_INCOMPLETE_LOG_INFO_KEY,
  RECOBLE_UNLOAD_EVENT_EXECUTED_KEY,
  RECOBLE_USER_DATA_KEY,
  RECOBLE_API_KEY_KEY
} from "../constants/constants"
import {BrowserInfoDto, PrevPageInfoDto} from "../dtos"
import PAGE_ACTIVITY_TYPE from "../enums/page.activity.type"
import {PageActivityType} from "../types/page.activity.type"
import {emptyPageActivityObj, printErrorMsg, decryptAES, encryptAES, formatDate} from "../util"
import {Storage} from "./storage"

@injectable()
export class ManageStorageData {
  #storage: Storage
  @inject('GenBrowserId') private genBrowserId: GenBrowserId
  
  constructor() {
    this.#storage = new Storage()
  }
  
  setBrowserId(domain: string): string | null {
    let browserId = this.#storage.getItem(RECOBLE_BROWSER_ID_KEY)
    
    if (!browserId) {
      browserId = this.genBrowserId.generateId(domain)
      this.#storage.setItem(RECOBLE_BROWSER_ID_KEY, browserId)
    }

    return browserId
  }

  findBrowserId(): string | null {
    return this.#storage.getItem(RECOBLE_BROWSER_ID_KEY)
  }

  updateConversionInfo(data: any): void {
    this.#storage.setItem(RECOBLE_CONVERSION_INFO_KEY, data)
  }

  findConversionInfo(): string | null {
    return this.#storage.getItem(RECOBLE_CONVERSION_INFO_KEY)
  }

  setIncompleteLogInfo(browserId: string | null, pageUrl: string) {
    if (!browserId) {
      printErrorMsg('브라우저 고유 ID가 생성되지 않았습니다')
    } else {
      const dto = new PrevPageInfoDto(browserId, pageUrl)
      return this.#storage.setItem(RECOBLE_INCOMPLETE_LOG_INFO_KEY, JSON.stringify(dto.toJSON()))
    }
  }

  findIncompleteLogInfo(): PrevPageInfoDto | null {
    const jsonStr = this.#storage.getItem(RECOBLE_INCOMPLETE_LOG_INFO_KEY)

    if (!jsonStr) {
      return null
    }

    return PrevPageInfoDto.fromJSON(jsonStr)
  }

  clearIncompleteLogInfo(): void {
    this.#storage.removeItem(RECOBLE_INCOMPLETE_LOG_INFO_KEY)
  }

  setPageActivity(activityType: PAGE_ACTIVITY_TYPE, value: number | boolean): void {
    let storeData = this.findPageActivity()
    const typeStr: string = activityType.toString()

    // @ts-ignore
    storeData[typeStr] = value
    this.#storage.setItem(RECOBLE_PAGE_ACTIVITY_KEY, JSON.stringify(storeData))
  }

  findPageActivity(): PageActivityType {
    const prevData = this.#storage.getItem(RECOBLE_PAGE_ACTIVITY_KEY)
    return (!prevData) ? emptyPageActivityObj() : JSON.parse(prevData)
  }

  setBrowserInfo(infoDto: BrowserInfoDto): void {
    this.#storage.setItem(RECOBLE_BROWSER_INFO_KEY, JSON.stringify(infoDto))
  }

  findBrowserInfo(): Record<string, any> {
    const browserInfoData = this.#storage.getItem(RECOBLE_BROWSER_INFO_KEY)
    return (!browserInfoData) ? {} : JSON.parse(browserInfoData)
  }

  setPageStartDtm(pageStartDtm: Date): void {
    this.#storage.setItem(RECOBLE_PAGE_START_DTM_KEY, formatDate(pageStartDtm))
  }

  findPageStartDtm(): string | null {
    return this.#storage.getItem(RECOBLE_PAGE_START_DTM_KEY)
  }

  setUnloadEventExecuted(): void {
    this.#storage.setItem(RECOBLE_UNLOAD_EVENT_EXECUTED_KEY, "true")
  }

  findUnloadEventExecuted(): string | null {
    return this.#storage.getItem(RECOBLE_UNLOAD_EVENT_EXECUTED_KEY)
  }

  clearUnloadEventExecuted(): void {
    this.#storage.removeItem(RECOBLE_UNLOAD_EVENT_EXECUTED_KEY)
  }

  setUserData(targetRecord: Record<string, any>, groupKey: string) {
    let orgRecord = this.findUserData()
    let sourceRecord = orgRecord

    if (groupKey !== '') {
      sourceRecord = orgRecord[groupKey]

      if (!sourceRecord) {
        orgRecord[groupKey] = {}
        sourceRecord = orgRecord[groupKey]
      }
    }

    Object.assign(sourceRecord, targetRecord)

    const secret = window.location.host
    this.#storage.setItem(RECOBLE_USER_DATA_KEY, encryptAES(JSON.stringify(orgRecord), secret))
  }

  findUserData(): Record<string, any> {
    const secret = window.location.host
    const prevData = this.#storage.getItem(RECOBLE_USER_DATA_KEY)
    return (!prevData) ? {} : JSON.parse(decryptAES(prevData, secret))
  }

  clearUserData() {
    this.#storage.removeItem(RECOBLE_USER_DATA_KEY)
  }

  setApiKey(apiKey: string): void {
    console.log('apiKey: ', apiKey)
    this.#storage.setItem(RECOBLE_API_KEY_KEY, apiKey)
  }

  findApiKey(): string | null {
    return this.#storage.getItem(RECOBLE_API_KEY_KEY)
  }
}
