import {injectable} from "inversify"
import {SaveUserData} from "../save.user.data"
import DATA_TYPE from "../../enums/data.type"
import {ValidateOptionRecord} from "../../types/validation"

@injectable()
export class SetBasketProduct extends SaveUserData {

  getValidateOption(): ValidateOptionRecord {
    return {
     event: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 90,
      },
      productList: {
        required: true,
        dataType: DATA_TYPE.RECORD_ARRAY,
        elementOption: {
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
            max: 100,
          },
          subCategory: {
            required: true,
            dataType: DATA_TYPE.STRING,
            min: 1,
            max: 100,
          },
        }
      }
    }
  }

  getIdentifier(): string {
    return 'setBasketProduct'
  }

  getDataKey(): string {
    return 'basketProduct'
  }

  getGroupKey(): string {
    return "product"
  }
}
