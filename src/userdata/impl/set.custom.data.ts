import {injectable} from "inversify"
import {SaveUserData} from "../save.user.data"
import {ValidateOptionRecord} from "../../types/validation"

@injectable()
export class SetCustomData extends SaveUserData {

  getValidateOption(): ValidateOptionRecord {
    return {}
  }

  getIdentifier(): string {
    return 'setCustomData'
  }

  getDataKey(): string {
    return 'customData'
  }

  getGroupKey(): string {
    return ""
  }
}
