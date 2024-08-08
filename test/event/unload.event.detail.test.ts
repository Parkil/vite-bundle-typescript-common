import {beforeAll, describe, test, expect} from '@jest/globals'
import container from "../../src/config/inversify_config"
import {ManageStorageData} from "../../src/storage/manage.storage.data"
import {ManageConversionInfo} from "../../src/conversion/manage.conversion.info"
import {mockFunction} from "../util/test.util"
import {UnLoadEventDetail} from "../../src/event/unload.event.detail"
import {ChkMeetsConversion} from "../../src/conversion/chk.meets.conversion"
import {SendHttpRequest} from "../../src/sendhttprequest/send.http.request"
import {UNLOAD_ENUM} from "../../src/enums/unload.type";

describe('UnLoadEventDetail', () => {
  let unLoadEventDetail: UnLoadEventDetail
  let manageStorageData: ManageStorageData

  beforeAll(() => {
    unLoadEventDetail = container.get<UnLoadEventDetail>('UnLoadEventDetail')
    manageStorageData = container.get<ManageStorageData>('ManageStorageData')

    mockFunction(ManageConversionInfo.prototype, 'chkIsConversionInfoUpdated', async () => {return false})
    mockFunction(ChkMeetsConversion.prototype, 'check', () => {return true})
    mockFunction(SendHttpRequest.prototype, 'sendLog', () => {})
    mockFunction(ManageStorageData.prototype, 'findBrowserId', () => {return 'testId'})
  })

  test('unload 실행', () => {
    unLoadEventDetail.onUnLoad(window.location.href, UNLOAD_ENUM.PAGE_UNLOAD)

    expect(manageStorageData.findUnloadEventExecuted()).toEqual('true')

    const prevPageInfo = manageStorageData.findIncompleteLogInfo()
    expect(prevPageInfo?.pageUrl).toEqual('http://localhost/')
    expect(prevPageInfo?.browserId).toEqual('testId')
  })
})
