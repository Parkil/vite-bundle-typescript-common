import {afterEach, beforeAll, describe, expect, jest, test} from '@jest/globals'
import container from "../../src/config/inversify_config"
import {ManageLogData} from "../../src/logdata/manage.log.data"
import {mockFunction} from "../util/test.util"
import {SendHttpRequest} from "../../src/sendhttprequest/send.http.request"
import {ManageStorageData} from "../../src/storage/manage.storage.data"
import {
  addLogParam_1,
  addLogParam_2,
  sendLogParam_1_apiHeader,
  sendLogParam_1_data,
  sendLogParam_1_userAgent,
  sendLogParam_2_apiHeader,
  sendLogParam_2_data,
  sendLogParam_2_userAgent
} from "./manage.log.data.test.data"
import {UNLOAD_ENUM} from "../../src/enums/unload.type"
import SpiedClass = jest.SpiedClass;
import SpiedFunction = jest.SpiedFunction;

describe('manageLogData', () => {
  let manageLogData: ManageLogData
  let sendLogMock: SpiedClass<any> | SpiedFunction<any>

  beforeAll(async () => {
    manageLogData = container.get<ManageLogData>('ManageLogData')

    sendLogMock = mockFunction(SendHttpRequest.prototype, 'sendLog', async (url, data, userAgent, apiKey) => {
      console.log('sendLog param : ', url, '/', data, '/', userAgent, '/', apiKey)
    })

    mockFunction(ManageStorageData.prototype, 'findApiKey', () => {
      return 'dummy API Key'
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // async block testcase 간에는 실행순서가 보장되지 않는다(= 상위 테스트 케이스가 완료되기전에 다음 테스트 케이스가 실행된다)
  test('capacity 에 저장된 로그 개수가 미치지 못하는 경우', async () => {
    await manageLogData.addLog(addLogParam_1, UNLOAD_ENUM.PAGE_UNMOUNT_TEST)

    expect(sendLogMock).toHaveBeenCalledTimes(0)
  })

  test('capacity 1회 달성', async () => {
    await manageLogData.addLog(addLogParam_1, UNLOAD_ENUM.PAGE_UNMOUNT_TEST)
    await manageLogData.addLog(addLogParam_2, UNLOAD_ENUM.PAGE_UNMOUNT_TEST)

    expect(sendLogMock).toHaveBeenCalledTimes(1)
    expect(sendLogMock).toBeCalledWith("http://localhost:3001/send_logs", sendLogParam_1_data, sendLogParam_1_userAgent, sendLogParam_1_apiHeader)
  })

  test('capacity 2회 달성', async () => {
    await manageLogData.addLog(addLogParam_1, UNLOAD_ENUM.PAGE_UNMOUNT_TEST)
    await manageLogData.addLog(addLogParam_2, UNLOAD_ENUM.PAGE_UNMOUNT_TEST)
    await manageLogData.addLog(addLogParam_1, UNLOAD_ENUM.PAGE_UNMOUNT_TEST)
    await manageLogData.addLog(addLogParam_2, UNLOAD_ENUM.PAGE_UNMOUNT_TEST)

    expect(sendLogMock).toHaveBeenCalledTimes(2)
    expect(sendLogMock).toBeCalledWith("http://localhost:3001/send_logs", sendLogParam_1_data, sendLogParam_1_userAgent, sendLogParam_1_apiHeader)
    expect(sendLogMock).toBeCalledWith("http://localhost:3001/send_logs", sendLogParam_2_data, sendLogParam_2_userAgent, sendLogParam_2_apiHeader)
  })
})
