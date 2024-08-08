import {injectable, multiInject} from "inversify"

import {SaveUserData} from "./save.user.data"
import {printErrorMsg} from "../util"

@injectable()
export class ManageSaveUserData {

  @multiInject('SaveUserData') private saveUserDatas: SaveUserData[]

  save(dataArr: { [key: string]: any }[]): void {
    dataArr.forEach((data) => {
      if (data.hasOwnProperty('event')) {
        const eventKey = data['event']
        const saveUserData = this.filterObj(eventKey)
        saveUserData?.save(data)
      }
    })
  }

  private filterObj = (key: string): SaveUserData | undefined => {
    let filterArr = this.saveUserDatas.filter(row => row.getIdentifier() === key)

    if (filterArr.length < 1) {
      printErrorMsg(`'${key}'는 유효하지 않은 event 입니다 사용자 정의 데이터를 입력하려면 event: setCustomData 를 이용하세요`)
    } else {
      return filterArr[0]
    }
  }
}
