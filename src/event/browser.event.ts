import {calcScrollLoc, chkBrowserIsValid, printErrorMsg} from "../util"
import {inject, injectable} from "inversify"
import {UnLoadEventDetail} from "./unload.event.detail.ts"
import {ManageStorageData} from "../storage/manage.storage.data.ts"
import {UNLOAD_ENUM} from "../enums/unload.type.ts"

@injectable()
export class BrowserEvent {
  @inject('UnLoadEventDetail') private unLoadEventDetail!: UnLoadEventDetail
  @inject('ManageStorageData') private manageStorageData!: ManageStorageData

  setBrowserEvent(): void {
    this.#setDocumentEvent('visibilitychange', this.#visibilityChangeUnLoad)
    this.#setDocumentEvent('scroll', this.#scrollChange)
    this.#setWindowEvent('pagehide', this.#execUnload)
    this.#setWindowEvent('beforeunload', this.#execUnload)
  }

  removeBrowserEvent(): void {
    this.#removeDocumentEvent('visibilitychange', this.#visibilityChangeUnLoad)
    this.#removeDocumentEvent('scroll', this.#scrollChange)
    this.#removeWindowEvent('pagehide', this.#execUnload)
    this.#removeWindowEvent('beforeunload', this.#execUnload)
  }

  #execUnload = () => {
    this.unLoadEventDetail.onUnLoad(window.location.href, UNLOAD_ENUM.PAGE_UNLOAD)
  }

  #visibilityChangeUnLoad = () => {
    const visibilityState = document.visibilityState

    if (visibilityState == 'hidden') {
      // this.manageStorageData.findUnloadEventExecuted() === 'true'
      // 위 로직 때문에 visibilityState 가 visible <-> hidden 을 여러번 반복해도 로그는 단 한번만 전송된다
      this.unLoadEventDetail.onUnLoad(window.location.href, UNLOAD_ENUM.PAGE_UNLOAD)
    }
  }

  #scrollChange = () => {
    const pos = calcScrollLoc()
    this.manageStorageData.setScrollLoc(pos)
  }

  /*
    주의 할점
    this.setWindowEvent("load", this.loadEventDetail.onLoad) 이런식으로 바로 Function 을 인자로 전달할
    경우 inversify DI 가 작동하지 않아 전부 undefined 오류가 발생한다
  */

  #setWindowEvent(eventName: string, listener: Function): void {
    if (!chkBrowserIsValid()) {
      printErrorMsg("웹 브라우저 환경이 아닙니다")
      return
    }

    window.addEventListener(eventName, listener as EventListener)
  }

  #removeWindowEvent(eventName: string, listener: Function): void {
    window.removeEventListener(eventName, listener as EventListener)
  }

  #setDocumentEvent(eventName: string, listener: Function): void {
    if (!chkBrowserIsValid()) {
      printErrorMsg("웹 브라우저 환경이 아닙니다")
      return
    }

    document.addEventListener(eventName, listener as EventListener)
  }

  #removeDocumentEvent(eventName: string, listener: Function): void {
    document.removeEventListener(eventName, listener as EventListener)
  }
}
