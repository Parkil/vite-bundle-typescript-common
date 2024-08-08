import {inject, injectable} from "inversify"
import {validateMultiParam} from "../validation"
import {printErrorMsg} from "../util"
import {ManageStorageData} from "../storage/manage.storage.data"
import {ValidateOptionRecord, ValidateTargetRecord} from "../types/validation.type"

/*
  크리테오 식으로 데이터를 받을 예정
  window.criteo_q.push(
   { event: "setAccount", account: 109243},

   // To Do 1. 현재 유저의 이메일 주소를 SHA256과 MD5로 해시화 시켜 문자열로 전달
   { event: "setEmail", email: "##SHA256로 해시된 유저의 이메일 주소##", hash_method: "sha256" },
   { event: "setEmail", email: "##MD5 해시된 유저의 이메일 주소##", hash_method: "md5" },

   // To Do 2. 현재 유저의 저장된 배송지 우편번호. 유저의 배송지 우편번호를 알수 없는 상황이면 빈 문자열로 전달
   { event: "setZipcode", zipcode: "##Zip Code##" },

   { event: "setSiteType", type: deviceType},
   { event: "viewHome"})

   사용자 데이터를 받는 단일 function 을 만든다음 배열로 데이터를 받아서 event 를 DI key 로 이용하여 event 별 로직을 수행하도록 설정
   key에 해당하는 값이 존재하지 않는 경우 사용자 정의 값으로 간주하고 이는 입력값 검증없이 저장하도록 설정

   event - DI key
   나머지 값만 검증
 */
@injectable()
export abstract class SaveUserData {
  private validateErrorMsg: string
  @inject('ManageStorageData') private manageStorageData: ManageStorageData

  save(param: { [key: string]: any }): boolean {
    if (!this.validateParam(param)) {
      printErrorMsg(this.validateErrorMsg)
      return false
    } else {
      this.saveUserData(param)
      return true
    }
  }

  private saveUserData(param: { [key: string]: any }) {
    this.manageStorageData.setUserData(this.modifyData(param), this.getGroupKey())
  }

  private modifyData(param: { [key: string]: any }): { [key: string]: any } {
    let modifyParam: { [key: string]: any } = {}
    delete param['event']
    const remainKeyArr = Object.keys(param)

    if (remainKeyArr.length === 1) {
      modifyParam[this.getDataKey()] = param[remainKeyArr[0]]
    } else if (remainKeyArr.length === 0) {
      modifyParam[this.getDataKey()] = {}
    } else {
      modifyParam[this.getDataKey()] = param
    }

    return modifyParam
  }

  private validateParam(data: ValidateTargetRecord): boolean {
    let errorMsg = validateMultiParam(this.getValidateOption(), [data])
    this.validateErrorMsg = errorMsg
    return errorMsg === ''
  }

  abstract getValidateOption(): ValidateOptionRecord
  abstract getIdentifier(): string
  abstract getDataKey(): string
  abstract getGroupKey(): string
}
