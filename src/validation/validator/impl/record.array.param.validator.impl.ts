import {ValidateOptionDto, ValidateParamResultDto} from "../../../dtos"
import {ParamValidator} from "../param.validator"
import VALIDATE_ERROR_TYPE from "../../../enums/validate.error.type"
import {ValidateElementOptionRecord, ValidateTargetParam} from "../../../types/validation.type"
import {validateMultiParam} from "../../validation"

export class RecordArrayParamValidatorImpl implements ParamValidator {
  isValid(optionDto: ValidateOptionDto, param: ValidateTargetParam): ValidateParamResultDto {

    const params = param as Record<string, any>[]

    const isTypeValid: boolean = typeof param === 'object'
    const isValueNotEmpty: boolean = params.length !== 0

    let errorType: VALIDATE_ERROR_TYPE = VALIDATE_ERROR_TYPE.NONE

    if (!isTypeValid) {
      errorType = VALIDATE_ERROR_TYPE.INVALID_VALUE_TYPE
    } else if (!isValueNotEmpty) {
      errorType = VALIDATE_ERROR_TYPE.VALUE_EMPTY
    }

    const elementErrorMsg = this.#checkElements(optionDto.elementOption, params)

    if (elementErrorMsg !== '') {
      errorType = VALIDATE_ERROR_TYPE.INVALID_ELEMENTS
    }

    return new ValidateParamResultDto(optionDto, param, errorType, [], elementErrorMsg)
  }

  #checkElements(elementOption: ValidateElementOptionRecord, elementParam: Record<string, any>[]): string {
    return validateMultiParam(elementOption, elementParam)
  }
}
