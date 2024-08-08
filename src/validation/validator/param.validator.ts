import {ValidateOptionDto, ValidateParamResultDto} from "../../dtos"
import {ValidateTargetParam} from "../../types/validation.type"

export interface ParamValidator {
  isValid(optionDto: ValidateOptionDto, param: ValidateTargetParam): ValidateParamResultDto
}
