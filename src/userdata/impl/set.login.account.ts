import {injectable} from "inversify"
import {SaveUserData} from "../save.user.data"
import DATA_TYPE from "../../enums/data.type"
import {ValidateOptionRecord} from "../../types/validation"

@injectable()
export class SetLoginAccount extends SaveUserData {

  getValidateOption(): ValidateOptionRecord {
    return {
      event: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 90,
      },
      hash_account: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 50,
      },
      hash_method: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 50,
      }
    }
  }

  getIdentifier(): string {
    return 'setLoginAccount'
  }

  getDataKey(): string {
    return 'loginAccount'
  }

  getGroupKey(): string {
    return ''
  }
}
