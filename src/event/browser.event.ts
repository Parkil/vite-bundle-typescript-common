import {chkBrowserIsValid, printErrorMsg} from "../util"
import {inject, injectable} from "inversify"
import {LoadEventDetail} from "./load.event.detail"
import {UnLoadEventDetail} from "./unload.event.detail"

@injectable()
export class BrowserEvent {

  @inject('LoadEventDetail') private loadEventDetail: LoadEventDetail
  @inject('UnLoadEventDetail') private unLoadEventDetail: UnLoadEventDetail

  /*
    주의 할점
    this.setWindowEvent("load", this.loadEventDetail.onLoad) 이런식으로 바로 Function 을 인자로 전달할 
    경우 inversify DI 가 작동하지 않아 전부 undefined 오류가 발생한다
   */
  setLoadEvent(): void {
    this.#setWindowEvent("load", () => {
      this.loadEventDetail.onLoad()
    })
  }

  setUnloadEvent(): void {
    this.#setVisibilitychangeEvent()
    this.#setPageHideEvent()
    this.#setBeforeunloadEvent()
  }

  #setVisibilitychangeEvent(): void {
    this.#setDocumentEvent("visibilitychange", () => {
      const visibilityState =  document.visibilityState

      if (visibilityState == 'hidden') {
        // this.manageStorageData.findUnloadEventExecuted() === 'true'
        // 위 로직 때문에 visibilityState 가 visible <-> hidden 을 여러번 반복해도 로그는 단 한번만 전송된다
        this.unLoadEventDetail.onUnLoad()
      }
    })
  }

  #setPageHideEvent(): void {
    this.#setWindowEvent("pagehide", () => {
      this.unLoadEventDetail.onUnLoad()
    })
  }

  #setBeforeunloadEvent(): void {
    this.#setWindowEvent("beforeunload", () => {
      this.unLoadEventDetail.onUnLoad()
    })
  }

  #setWindowEvent(eventName: string, listener: Function): void {
    if (!chkBrowserIsValid()) {
      printErrorMsg("웹 브라우저 환경이 아닙니다")
      return
    }

    window.addEventListener(eventName, listener as EventListener)
  }

  #setDocumentEvent(eventName: string, listener: Function): void {
    if (!chkBrowserIsValid()) {
      printErrorMsg("웹 브라우저 환경이 아닙니다")
      return
    }

    document.addEventListener(eventName, listener as EventListener)
  }
}
