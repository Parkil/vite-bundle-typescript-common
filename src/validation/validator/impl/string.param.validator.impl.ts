import {ValidateOptionDto, ValidateParamResultDto} from "../../../dtos"
import {ParamValidator} from "../param.validator"
import VALIDATE_ERROR_TYPE from "../../../enums/validate.error.type"
import {ValidateTargetParam} from "../../../types/validation.type"

export class StringParamValidatorImpl implements ParamValidator {
  isValid(optionDto: ValidateOptionDto, param: ValidateTargetParam): ValidateParamResultDto {
    const isTypeValid = typeof param === 'string'
    let isValueNotEmpty
    let isLengthValid = false
    let errorType: VALIDATE_ERROR_TYPE = VALIDATE_ERROR_TYPE.NONE

    if (isTypeValid) {
      const chkParam = param
      isValueNotEmpty = chkParam.length !== 0 && chkParam.trim() !== ''

      if (isValueNotEmpty) {
        isLengthValid = param.length <= optionDto.max && param.length >= optionDto.min
      }
    }

    if (!isTypeValid) {
      errorType = VALIDATE_ERROR_TYPE.INVALID_VALUE_TYPE
    } else if (!isValueNotEmpty) {
      errorType = VALIDATE_ERROR_TYPE.VALUE_EMPTY
    } else if (!isLengthValid) {
      errorType = VALIDATE_ERROR_TYPE.DATA_LENGTH_EXCEED
    }

    return new ValidateParamResultDto(optionDto, param, errorType, [], '')
  }
}
