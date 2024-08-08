import {injectable} from "inversify"
import {SaveUserData} from "../save.user.data"
import DATA_TYPE from "../../enums/data.type"
import {ValidateOptionRecord} from "../../types/validation"

@injectable()
export class SetAccount extends SaveUserData {

  getValidateOption(): ValidateOptionRecord {
    return {
      event: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 90,
      },
      account: {
        required: true,
        dataType: DATA_TYPE.NUMBER,
        min: 1,
        max: 99999999,
      }
    }
  }

  getIdentifier(): string {
    return 'setAccount'
  }

  getDataKey(): string {
    return 'account'
  }

  getGroupKey(): string {
    return "user"
  }
}
