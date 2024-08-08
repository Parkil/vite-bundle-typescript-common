import {beforeAll, describe, expect, test} from '@jest/globals'
import container from "../../src/config/inversify_config"
import {LoadEventDetail} from "../../src/event/load.event.detail"
import {ManageStorageData} from "../../src/storage/manage.storage.data"
import {ManageConversionInfo} from "../../src/conversion/manage.conversion.info"
import {mockFunction} from "../util/test.util"
import {SendHttpRequest} from "../../src/sendhttprequest/send.http.request"

describe('LoadEventDetail', () => {
  let loadEventDetail: LoadEventDetail
  let manageStorageData: ManageStorageData

  beforeAll(() => {
    loadEventDetail = container.get<LoadEventDetail>('LoadEventDetail')
    manageStorageData = container.get<ManageStorageData>('ManageStorageData')

    mockFunction(SendHttpRequest.prototype, 'findGeoInfo', async () => {return "0.0.0.0,KR"})
    mockFunction(ManageConversionInfo.prototype, 'chkIsConversionInfoUpdated', async () => {return false})
  })

  test('load 실행(이전 페이지 정보 없음, 전환정보 업데이트 안됨)', async () => {
    await loadEventDetail.onLoad()

    const browserInfo = manageStorageData.findBrowserInfo()
    expect(browserInfo.userAgent).toEqual('Mozilla/5.0 (win32) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/20.0.3')
    expect(browserInfo.referrer).toEqual('')
    expect(browserInfo.pageUrl).toEqual('http://localhost/')
    expect(browserInfo.ip).toEqual('0.0.0.0')
    expect(browserInfo.countryCode).toEqual('KR')

    expect(manageStorageData.findPageStartDtm()).not.toBeNull()

    const activityData = manageStorageData.findPageActivity()
    expect(activityData.VIEW).toEqual(true)
    expect(activityData.SCROLL).toEqual(0)
    expect(activityData.CLICK).toEqual(false)
  })
})
