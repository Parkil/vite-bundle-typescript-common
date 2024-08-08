import {inject, injectable} from "inversify"
import {BrowserInfoDto} from "../dtos"
import {chkBrowserIsValid} from "../util"
import {SendHttpRequest} from "../sendhttprequest/send.http.request"

@injectable()
export class FindBrowserInfo {

  @inject('SendHttpRequest') private sendHttpRequest: SendHttpRequest

  async findInfo(): Promise<BrowserInfoDto> {
    let userAgent = ''
    let referrer = ''
    let pageUrl = ''
    let ip = ''
    let countryCode = ''

    if (chkBrowserIsValid()) {
      userAgent = navigator.userAgent
      referrer = document.referrer
      pageUrl = window.location.href

      const geoInfoStr = await this.sendHttpRequest.findGeoInfo()
      const [ip_str, country_code_str] = geoInfoStr.split(',')

      ip = ip_str
      countryCode = country_code_str
    }

    return new BrowserInfoDto(userAgent, referrer, pageUrl, ip, countryCode)
  }
}
