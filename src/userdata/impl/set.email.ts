import {injectable} from "inversify"
import {SaveUserData} from "../save.user.data"
import DATA_TYPE from "../../enums/data.type"
import {ValidateOptionRecord} from "../../types/validation"

@injectable()
export class SetEmail extends SaveUserData {

  getValidateOption(): ValidateOptionRecord {
    return {
      event: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 90,
      },
      email: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 50,
      }
    }
  }

  getIdentifier(): string {
    return 'setEmail'
  }

  getDataKey(): string {
    return 'email'
  }

  getGroupKey(): string {
    return 'user'
  }
}
