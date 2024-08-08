import {injectable} from "inversify"
import {SaveUserData} from "../save.user.data"
import DATA_TYPE from "../../enums/data.type"
import {ValidateOptionRecord} from "../../types/validation.type"

@injectable()
export class SetRegisterDate extends SaveUserData {

  getValidateOption(): ValidateOptionRecord {
    return {
      event: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 90,
      },
      register_date: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 10,
      }
    }
  }

  getIdentifier(): string {
    return 'setRegisterDate'
  }

  getDataKey(): string {
    return 'registerDate'
  }

  getGroupKey(): string {
    return 'user'
  }
}
