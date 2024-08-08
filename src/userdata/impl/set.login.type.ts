import {injectable} from "inversify"
import {SaveUserData} from "../save.user.data"
import DATA_TYPE from "../../enums/data.type"
import {ValidateOptionRecord} from "../../types/validation.type"

@injectable()
export class SetLoginType extends SaveUserData {

  getValidateOption(): ValidateOptionRecord {
    return {
      event: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 90,
      },
      login_type: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 20,
      }
    }
  }

  getIdentifier(): string {
    return 'setLoginType'
  }

  getDataKey(): string {
    return 'loginType'
  }

  getGroupKey(): string {
    return 'user'
  }
}
