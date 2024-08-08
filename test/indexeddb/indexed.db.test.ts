import {describe, test, expect, beforeAll, afterEach} from '@jest/globals'
import {IndexedDbWrapper} from "../../src/indexeddb/indexed.db.wrapper"
import container from "../../src/config/inversify_config"

describe('indexedDB', () => {
  let indexedDbWrapper: IndexedDbWrapper
  let dbObj: IDBDatabase

  beforeAll(async () => {
    indexedDbWrapper = container.get<IndexedDbWrapper>('IndexedDbWrapper')

    const options = [
      {
        'storeName': 'logDetail',
        'subOption': {keyPath: 'id', autoIncrement: true}
      }
    ]

    dbObj = await indexedDbWrapper.connectIndexedDB('MyDatabase', 1, options)
  })

  afterEach(async () => {
    await indexedDbWrapper.clearAll(dbObj, 'logDetail')
  })

  test('indexedDB 데이터 저장 테스트', async () => {
    const addResult = await indexedDbWrapper.addData(dbObj, 'logDetail', {'aaa': 'aaa', 'bbb': 'bbb'})
    expect(addResult).toEqual(true)
  })

  test('indexedDB 데이터 전체조회 테스트', async () => {
    const dataParam = {'aaa': 'aaa', 'bbb': 'bbb'}
    const addResult = await indexedDbWrapper.addData(dbObj, 'logDetail', dataParam)

    const result = await indexedDbWrapper.findAll(dbObj, 'logDetail')

    expect(addResult).toEqual(true)
    expect(result[0]).toEqual({'aaa': 'aaa', 'bbb': 'bbb', 'id': 2})
  })

  test('indexedDB 데이터 전체삭제 테스트', async () => {
    const addResult = await indexedDbWrapper.addData(dbObj, 'logDetail', {'aaa': 'aaa', 'bbb': 'bbb'})
    const clearResult = await indexedDbWrapper.clearAll(dbObj, 'logDetail')
    const findAllResult = await indexedDbWrapper.findAll(dbObj, 'logDetail')

    expect(addResult).toEqual(true)
    expect(clearResult).toEqual(true)
    expect(findAllResult.length).toEqual(0)
  })
})
