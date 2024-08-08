import {beforeAll, describe, expect, test} from '@jest/globals'
import container from "../../src/config/inversify_config"
import {FindBrowserInfo} from "../../src/browserinfo/find.browser.info"
import {mockFunction} from "../util/test.util"
import {SendHttpRequest} from "../../src/sendhttprequest/send.http.request"

describe('FindBrowserInfo', () => {
  let findBrowserInfo: FindBrowserInfo

  beforeAll(() => {
    findBrowserInfo = container.get<FindBrowserInfo>('FindBrowserInfo')
    mockFunction(SendHttpRequest.prototype, 'findGeoInfo', async () => {return "0.0.0.0,KR"})
  })

  test('정보를 정상적으로 가져오는지 확인', async () => {
    const dto = await findBrowserInfo.findInfo()
    const data: Record<string, any> = dto.toJSON()

    expect(data.userAgent).toEqual('Mozilla/5.0 (win32) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/20.0.3')
    expect(data.referrer).toEqual('')
    expect(data.pageUrl).toEqual('http://localhost/')
    expect(data.ip).toEqual('0.0.0.0')
    expect(data.countryCode).toEqual('KR')
  })
})
