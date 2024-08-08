import {injectable} from "inversify"
import {SaveUserData} from "../save.user.data"
import DATA_TYPE from "../../enums/data.type"
import {ValidateOptionRecord} from "../../types/validation"

@injectable()
export class SetPhone extends SaveUserData {

  getValidateOption(): ValidateOptionRecord {
    return {
      event: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 90,
      },
      phone: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 13,
      }
    }
  }

  getIdentifier(): string {
    return 'setPhone'
  }

  getDataKey(): string {
    return 'phone'
  }

  getGroupKey(): string {
    return 'user'
  }
}
