import {injectable} from "inversify"
import {SaveUserData} from "../save.user.data"
import DATA_TYPE from "../../enums/data.type"
import {ValidateOptionRecord} from "../../types/validation"

@injectable()
export class SetGender extends SaveUserData {

  getValidateOption(): ValidateOptionRecord {
    return {
      event: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 90,
      },
      gender: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 1,
      },
    }
  }

  getIdentifier(): string {
    return 'setGender'
  }

  getDataKey(): string {
    return 'gender'
  }

  getGroupKey(): string {
    return 'user'
  }
}
