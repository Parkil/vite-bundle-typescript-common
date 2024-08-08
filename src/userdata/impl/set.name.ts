import {injectable} from "inversify"
import {SaveUserData} from "../save.user.data"
import DATA_TYPE from "../../enums/data.type"
import {ValidateOptionRecord} from "../../types/validation"

@injectable()
export class SetName extends SaveUserData {

  getValidateOption(): ValidateOptionRecord {
    return {
      event: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 90,
      },
      name: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 30,
      }
    }
  }

  getIdentifier(): string {
    return 'setName'
  }

  getDataKey(): string {
    return 'name'
  }

  getGroupKey(): string {
    return 'user'
  }
}
