import {inject, injectable} from "inversify"
import {AxiosClient} from "../httpclient/axios.client"
import {GEO_URL, LOG_SERVER_SEND_LOG_URL, LOG_SERVER_UPDATE_INCOMPLETE_LOG_URL} from "../constants/constants"
import HTTP_METHOD from "../enums/http.method"
import {XhrClient} from "../httpclient/xhr.client"

@injectable()
export class SendHttpRequest {
  @inject('AxiosClient') private axiosClient!: AxiosClient
  @inject('XhrClient') private xhrClient!: XhrClient

  async sendLog(data: any, userAgent: string, headers: Record<string, string>): Promise<any> {
    if (userAgent.toLowerCase().indexOf('firefox') !== -1) {
      return this.xhrClient.sendRequest(LOG_SERVER_SEND_LOG_URL, HTTP_METHOD.POST, headers, data)
    } else{
      return this.axiosClient.sendRequest(LOG_SERVER_SEND_LOG_URL, HTTP_METHOD.POST, headers, data)
    }
  }

  async findGeoInfo(): Promise<string> {
    const retJson = await this.axiosClient.sendRequest(GEO_URL, HTTP_METHOD.GET, {})
    return retJson.ip+','+retJson.country_code
  }

  async updateInCompleteLogInfo(headers: Record<string, string>, data: any): Promise<void> {
    return this.axiosClient.sendRequest(LOG_SERVER_UPDATE_INCOMPLETE_LOG_URL, HTTP_METHOD.POST, headers, data)
  }
}
