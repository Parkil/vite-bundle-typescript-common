import {injectable} from "inversify"
import {LogData} from "../types/log.data"

@injectable()
export class SetCompleteInfo {
  async setInfo(rawList: LogData[]): Promise<LogData[]> {
    const completeInfoList: LogData[] = []
    rawList.forEach((item, index, list) => {
      const prevElement = list[index - 1]
      const nextElement = list[index + 1]
      item.lastLogFlag = (typeof item.lastLogFlag === 'undefined' ? false : item.lastLogFlag)

      if (typeof prevElement !== 'undefined') {
        item['referrer'] = prevElement['pageUrl']
      }

      if (typeof nextElement !== 'undefined') {
        item['pageEndDtm'] = nextElement['pageStartDtm']
        item['pageMoveType']['isNextPage'] = true
      }

      completeInfoList.push(item)
    })

    return completeInfoList
  }
}
