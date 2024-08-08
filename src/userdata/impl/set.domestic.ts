import {injectable} from "inversify"
import {SaveUserData} from "../save.user.data"
import DATA_TYPE from "../../enums/data.type"
import {ValidateOptionRecord} from "../../types/validation"

@injectable()
export class SetDomestic extends SaveUserData {

  getValidateOption(): ValidateOptionRecord {
    return {
      event: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 90,
      },
      is_domestic: {
        required: true,
        dataType: DATA_TYPE.BOOLEAN,
        min: 1,
        max: 1,
      }
    }
  }

  getIdentifier(): string {
    return 'setDomestic'
  }

  getDataKey(): string {
    return 'domestic'
  }

  getGroupKey(): string {
    return 'user'
  }
}
