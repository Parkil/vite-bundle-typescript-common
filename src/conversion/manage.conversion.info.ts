import {inject, injectable} from "inversify"
import {AxiosClient} from "../httpclient/axios.client"
import {CONVERSION_INFO_SERVER_URL} from "../constants/constants"
import HTTP_METHOD from "../enums/http.method"
import {ManageStorageData} from "../storage/manage.storage.data"
import {findApiKeyHeader} from "../util"

@injectable()
export class ManageConversionInfo {
  @inject('AxiosClient') private httpClient!: AxiosClient
  @inject('ManageStorageData') private manageStorageData!: ManageStorageData

  async chkIsConversionInfoUpdated(): Promise<boolean> {
    const apiKeyHeader = findApiKeyHeader()
    const chkResult = await this.httpClient.sendRequest(CONVERSION_INFO_SERVER_URL, HTTP_METHOD.GET, apiKeyHeader)
    return !!(chkResult)
  }

  async updateConversionInfo() {
    const apiKeyHeader = findApiKeyHeader()
    const updateData = await this.httpClient.sendRequest(CONVERSION_INFO_SERVER_URL, HTTP_METHOD.GET, apiKeyHeader)
    this.manageStorageData.updateConversionInfo(updateData)
  }

  // todo 여기에서 서버 통신하는 부분을 제거(나중에 전환정보 구현할때 수행)
  findConversionInfo(): any {
    let info = this.manageStorageData.findConversionInfo()
    if (!info) {
      this.updateConversionInfo().then(() => {
        info = this.manageStorageData.findConversionInfo()
      })
    }

    return info
  }
}
