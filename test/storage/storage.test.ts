import {describe, expect, test, beforeAll} from '@jest/globals'
import {ManageStorageData} from "../../src/storage/manage.storage.data"
import container from "../../src/config/inversify_config"
import {BrowserInfoDto, PrevPageInfoDto} from "../../src/dtos"

describe('storage', () => {
  let manageStorageData: ManageStorageData
  const testDomain = 'http://localhost:8080'

  beforeAll(() => {
    manageStorageData = container.get<ManageStorageData>('ManageStorageData')
  })

  test('browserId 가 정상적으로 반환되는지 확인', () => {
    const browserId = manageStorageData.setBrowserId(testDomain)
    expect(browserId).not.toBeNull()
    // @ts-ignore
    expect(browserId.length).toBeGreaterThan(0)
  })

  test('연속 호출시 기존 생성된 ID를 반환하는지 확인', () => {
    const browserId = manageStorageData.setBrowserId(testDomain)
    const newBrowserId = manageStorageData.setBrowserId(testDomain)
    expect(browserId).toEqual(newBrowserId)
  })

  test('기존 페이지 정보가 정상적으로 저장되고 반환되는지 확인', () => {
    const browserId = 'browserId'
    const pageUrl = 'http://localhost:8080'
    manageStorageData.setIncompleteLogInfo(browserId, pageUrl)
    const prevInfoDto: PrevPageInfoDto | null = manageStorageData.findIncompleteLogInfo()

    expect(prevInfoDto).not.toBeNull()
    // @ts-ignore
    expect(prevInfoDto.browserId).toEqual(browserId)
    // @ts-ignore
    expect(prevInfoDto.pageUrl).toEqual(pageUrl)
  })

  test('기존 페이지 정보 삭제 여부 확인', () => {
    const browserId = 'browserId'
    const pageUrl = 'http://localhost:8080'
    manageStorageData.setIncompleteLogInfo(browserId, pageUrl)
    manageStorageData.clearIncompleteLogInfo()

    const prevInfoDto: PrevPageInfoDto | null = manageStorageData.findIncompleteLogInfo()

    expect(prevInfoDto).toBeNull()
  })

  test('browserInfo 가 정상적으로 저장되고 반환되는지 확인', () => {
    const browserInfo = new BrowserInfoDto('agent', 'referer', 'http://localhost:8080' , '0.0.0.0', 'KR')
    manageStorageData.setBrowserInfo(browserInfo)

    const obj = manageStorageData.findBrowserInfo()
    const orgObj = browserInfo.toJSON()

    Object.keys(orgObj).forEach(key => {
      expect(orgObj[key]).toEqual(obj[key])
    })
  })
})
