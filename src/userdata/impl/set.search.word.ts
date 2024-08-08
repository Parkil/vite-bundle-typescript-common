import {injectable} from "inversify"
import {SaveUserData} from "../save.user.data"
import DATA_TYPE from "../../enums/data.type"
import {ValidateOptionRecord} from "../../types/validation"

@injectable()
export class SetSearchWord extends SaveUserData {

  getValidateOption(): ValidateOptionRecord {
    return {
      event: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 90,
      },
      search_word: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 200,
      },
    }
  }

  getIdentifier(): string {
    return 'setSearchWord'
  }

  getDataKey(): string {
    return 'searchWord'
  }

  getGroupKey(): string {
    return ''
  }
}
