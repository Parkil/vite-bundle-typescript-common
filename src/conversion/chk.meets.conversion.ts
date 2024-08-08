import {ManageConversionInfo} from "./manage.conversion.info"
import {inject, injectable} from "inversify"

@injectable()
export class ChkMeetsConversion {
  @inject('ManageConversionInfo') private manageConversionInfo: ManageConversionInfo


  check(): boolean {
    this.manageConversionInfo.findConversionInfo()
    return true
  }
}
