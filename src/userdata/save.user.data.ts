import {inject, injectable} from "inversify"
import {validateMultiParam} from "../validation"
import {printErrorMsg} from "../util"
import {ManageStorageData} from "../storage/manage.storage.data"
import {ValidateOptionRecord, ValidateTargetRecord} from "../types/validation"

@injectable()
export abstract class SaveUserData {
  private validateErrorMsg!: string
  @inject('ManageStorageData') private manageStorageData!: ManageStorageData

  save(param: { [key: string]: any }): boolean {
    if (!this.#validateParam(param)) {
      printErrorMsg(this.validateErrorMsg)
      return false
    } else {
      this.#saveUserData(param)
      return true
    }
  }

  #saveUserData(param: { [key: string]: any }) {
    const convertedParam = this.convertParam(param)
    this.manageStorageData.setUserData(this.#modifyData(convertedParam), this.getGroupKey())
  }

  #modifyData(param: { [key: string]: any }): { [key: string]: any } {
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

  #validateParam(data: ValidateTargetRecord): boolean {
    let errorMsg = validateMultiParam(this.getValidateOption(), [data])
    this.validateErrorMsg = errorMsg
    return errorMsg === ''
  }
  
  convertParam(param: { [key: string]: any }): { [key: string]: any } {
    return param
  }
  
  abstract getValidateOption(): ValidateOptionRecord
  abstract getIdentifier(): string
  abstract getDataKey(): string
  abstract getGroupKey(): string
}
