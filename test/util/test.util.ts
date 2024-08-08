import {jest} from '@jest/globals'
import * as fs from "node:fs"
import SpiedClass = jest.SpiedClass
import SpiedFunction = jest.SpiedFunction

export const mockFunction = (protoType: any, functionName: string, mockImpl: (...args: unknown[]) => any):  SpiedClass<any> | SpiedFunction<any> => {
  const mock = jest.spyOn(protoType, functionName)
  mock.mockImplementation(mockImpl)
  return mock
}

export const loadFile = (path: string): string => {
  return fs.readFileSync(path, {encoding: 'utf-8', flag: 'r'})
}

export const loadDomFromFile = (path: string): Document => {
  const fileCon = loadFile(path)
  return new DOMParser().parseFromString(fileCon, "text/html");
}
