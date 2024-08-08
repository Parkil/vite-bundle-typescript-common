import {injectable} from "inversify"
import {SaveUserData} from "../save.user.data"
import DATA_TYPE from "../../enums/data.type"
import {ValidateOptionRecord} from "../../types/validation"

@injectable()
export class SetAge extends SaveUserData {

  getValidateOption(): ValidateOptionRecord {
    return {
      event: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 90,
      },
      age: {
        required: true,
        dataType: DATA_TYPE.NUMBER,
        min: 1,
        max: 99,
      },
    }
  }

  getIdentifier(): string {
    return 'setAge'
  }

  getDataKey(): string {
    return 'age'
  }

  getGroupKey(): string {
    return 'user'
  }
}
