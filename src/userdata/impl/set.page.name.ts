import {injectable} from "inversify"
import {SaveUserData} from "../save.user.data"
import DATA_TYPE from "../../enums/data.type"
import {ValidateOptionRecord} from "../../types/validation.type"

@injectable()
export class SetPageName extends SaveUserData {

  getValidateOption(): ValidateOptionRecord {
    return {
      event: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 90,
      },
      page_name: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 99,
      },
    }
  }

  getIdentifier(): string {
    return 'setPageName'
  }

  getDataKey(): string {
    return 'pageName'
  }

  getGroupKey(): string {
    return ''
  }
}
