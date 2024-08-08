import {ValidateOptionDto, ValidateParamResultDto} from "../../dtos"
import VALIDATE_ERROR_TYPE from "../../enums/validate.error.type"
import {ValidateOptionRecord, ValidateTargetRecord} from "../../types/validation"

export class InvalidKeyValidator {
  static isValid(option: ValidateOptionRecord, target: ValidateTargetRecord): ValidateParamResultDto {
    const optionKeys: string[] = Object.keys(option)
    const dataKeys: string[] = Object.keys(target)

    const invalidKeyArr: string[] = dataKeys.filter(dataKey => optionKeys.indexOf(dataKey) === -1)
    const errorType: VALIDATE_ERROR_TYPE = (invalidKeyArr.length > 0) ? VALIDATE_ERROR_TYPE.INVALID_DATA_KEY : VALIDATE_ERROR_TYPE.NONE


    return new ValidateParamResultDto(ValidateOptionDto.emptyDto(), '', errorType, invalidKeyArr, '')
  }
}
