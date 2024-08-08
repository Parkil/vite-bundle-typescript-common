import {ValidateOptionDto, ValidateParamResultDto} from "../../../dtos"
import {ParamValidator} from "../param.validator"
import VALIDATE_ERROR_TYPE from "../../../enums/validate.error.type"
import {ValidateTargetParam} from "../../../types/validation"

export class NumberParamValidatorImpl implements ParamValidator {
  isValid(optionDto: ValidateOptionDto, param: ValidateTargetParam): ValidateParamResultDto {
    const isTypeValid: boolean = typeof param === 'number'
    const isValueNotEmpty: boolean = typeof param !== 'undefined'
    let isLengthValid: boolean = false
    let errorType: VALIDATE_ERROR_TYPE = VALIDATE_ERROR_TYPE.NONE

    if (isTypeValid && isValueNotEmpty) {
      const chkParam = param as number
      isLengthValid = chkParam >= optionDto.min && chkParam <= optionDto.max
    }

    if (!isTypeValid) {
      errorType = VALIDATE_ERROR_TYPE.INVALID_VALUE_TYPE
    } else if (!isValueNotEmpty) {
      errorType = VALIDATE_ERROR_TYPE.VALUE_EMPTY
    } else if (!isLengthValid) {
      errorType = VALIDATE_ERROR_TYPE.DATA_RANGE_EXCEED
    }

    return new ValidateParamResultDto(optionDto, param, errorType, [], '')
  }
}
