import {ValidateOptionDto, ValidateParamResultDto} from "../../../dtos"
import {ParamValidator} from "../param.validator"
import VALIDATE_ERROR_TYPE from "../../../enums/validate.error.type"
import {ValidateTargetParam} from "../../../types/validation.type"

export class BooleanParamValidatorImpl implements ParamValidator {
  isValid(optionDto: ValidateOptionDto, param: ValidateTargetParam): ValidateParamResultDto {
    const isTypeValid: boolean = typeof param === 'boolean'
    const isValueNotEmpty: boolean = typeof param !== 'undefined'

    let errorType: VALIDATE_ERROR_TYPE = VALIDATE_ERROR_TYPE.NONE

    if (!isTypeValid) {
      errorType = VALIDATE_ERROR_TYPE.INVALID_VALUE_TYPE
    } else if (!isValueNotEmpty) {
      errorType = VALIDATE_ERROR_TYPE.VALUE_EMPTY
    }

    return new ValidateParamResultDto(optionDto, param, errorType, [], '')
  }
}
