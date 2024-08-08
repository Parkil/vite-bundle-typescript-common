import {injectable} from "inversify"
import {SaveUserData} from "../save.user.data"
import DATA_TYPE from "../../enums/data.type"
import {ValidateOptionRecord} from "../../types/validation.type"

@injectable()
export class SetProductView extends SaveUserData {

  getValidateOption() :ValidateOptionRecord {
    return {
      event: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 90,
      },
      productCode: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 90,
      },
      productName: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 200,
      },
      price: {
        required: true,
        dataType: DATA_TYPE.NUMBER,
        min: 1,
        max: 99999999,
      },
      category: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 200,
      },
      subCategory: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 200,
      }
    }
  }

  getIdentifier(): string {
    return 'setProductView'
  }

  getDataKey(): string {
    return 'productView'
  }

  getGroupKey(): string {
    return "product"
  }
}
