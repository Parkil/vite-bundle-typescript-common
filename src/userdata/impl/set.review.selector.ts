import {injectable} from "inversify"
import {SaveUserData} from "../save.user.data"
import DATA_TYPE from "../../enums/data.type"
import {ValidateOptionRecord} from "../../types/validation.type"

@injectable()
export class SetReviewSelector extends SaveUserData {

  getValidateOption(): ValidateOptionRecord {
    return {
      event: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 90,
      },
      list_area_selector: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 200,
      },
      row_contents_selector: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 200,
      },
    }
  }

  getIdentifier(): string {
    return 'setReviewSelector'
  }

  getDataKey(): string {
    return 'reviewSelector'
  }

  getGroupKey(): string {
    return ''
  }
}
