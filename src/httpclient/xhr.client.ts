import HTTP_METHOD from "../enums/http.method"
import {printErrorMsg} from "../util"
import {injectable} from "inversify"

@injectable()
export class XhrClient {

  private readonly xhr: XMLHttpRequest

  constructor() {
    this.xhr = new XMLHttpRequest()
  }

  // FireFox 에서 unload / pagehide event 에 http request 를 전달하고자 할때
  // async 로 호출을 하면 NS_BINDING_ABORTED 에러가 발생
  sendRequest(url: string, method: HTTP_METHOD, headers: Record<string, string>, data?: object): Promise<any> {
    this.xhr.open(method.toString(), url, false)
    this.xhr.setRequestHeader('content-type', 'application/json')
    for (let key in headers) {
      this.xhr.setRequestHeader(key, headers[key])
    }
    this.xhr.onerror = () => {
      printErrorMsg(this.xhr.statusText)
    }

    const jsonStr = (!data) ? null : JSON.stringify(data)
    this.xhr.send(jsonStr)

    return Promise.resolve()
  }
}
