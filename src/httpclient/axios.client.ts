import HTTP_METHOD from "../enums/http.method"
import axios, {AxiosResponse} from "axios"
import {HttpsAgent} from "agentkeepalive"
import {injectable} from "inversify"
import {printErrorObj} from "../util/msg.util.ts"

@injectable()
export class AxiosClient {

  private readonly axiosHttpsAgent: HttpsAgent

  constructor() {
    // HttpsAgent 라고 되어는 있지만 내부적으로는 httpAgent 를 상속 받는다
    this.axiosHttpsAgent = new HttpsAgent({
      timeout: 6000, // active socket keepalive for 6 seconds
      freeSocketTimeout: 3000, // free socket keepalive for 3 seconds
    })
  }

  private send(url: string, method: HTTP_METHOD, headers: Record<string, string>, data?: object): Promise<AxiosResponse<any, any>> {
    const baseConfig = {
      httpsAgent: this.axiosHttpsAgent,
      url: url,
      method: method.toString(),
      timeout: 6000,
      ...(headers && {headers})
    }

    let config = { ...baseConfig , ...(data && { data }) }

    return axios(config)
  }

  async sendRequest(url: string, method: HTTP_METHOD, headers: Record<string, string>, data?: object): Promise<any> {
    try {
      const resp = await this.send(url, method, headers, data)
      return resp.data
    } catch (e) {
      printErrorObj(e)
    }
  }
}
