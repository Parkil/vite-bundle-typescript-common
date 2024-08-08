import {convertOptionDtos} from "./convert.option.dtos"
import DATA_TYPE from "../enums/data.type"
import {ValidateOptionDto, ValidateParamResultDto} from "../dtos"
import {NumberParamValidatorImpl} from "./validator/impl/number.param.validator.impl"
import {StringParamValidatorImpl} from "./validator/impl/string.param.validator.impl"
import VALIDATE_ERROR_TYPE from "../enums/validate.error.type"
import {InvalidKeyValidator} from "./validator/invalid.key.validator"
import {BooleanParamValidatorImpl} from "./validator/impl/boolean.param.validator.impl"
import {ValidateOptionRecord, ValidateTargetRecord} from "../types/validation.type"
import {RecordArrayParamValidatorImpl} from "./validator/impl/record.array.param.validator.impl"

export const validateMultiParam = (option: ValidateOptionRecord, targets: ValidateTargetRecord[]): string => {
  return targets.map((data) => validateSingleParam(option, data)).filter((errorMsg) => errorMsg !== '').join(' , ')
}

export const validateSingleParam = (option: ValidateOptionRecord, target: ValidateTargetRecord): string => {
  
  // option 이 전혀 지정되지 않은 경우 무조건 검증을 통과하도록 설정
  if (Object.keys(option).length === 0) {
    return ''
  }

  let resultDtos: ValidateParamResultDto[] = []
  let optionDtos: ValidateOptionDto[] = convertOptionDtos(option)

  resultDtos.push(InvalidKeyValidator.isValid(option, target))

  optionDtos.forEach((optionDto) => {
    let paramValue = target[optionDto.paramName]

    if (!paramValue) {
      if (optionDto.required) {
        resultDtos.push(new ValidateParamResultDto(optionDto, paramValue, VALIDATE_ERROR_TYPE.VALUE_EMPTY, [], ''))
      }
    } else {
      // todo 나중에 number, string 배열 로직 처리시 DI로 처리하도록 수정
      let resultDto: ValidateParamResultDto
      switch (optionDto.dataType){
        case DATA_TYPE.NUMBER:
          resultDto = new NumberParamValidatorImpl().isValid(optionDto, paramValue)
          break
        case DATA_TYPE.STRING:
          resultDto = new StringParamValidatorImpl().isValid(optionDto, paramValue)
          break
        case DATA_TYPE.BOOLEAN:
          resultDto = new BooleanParamValidatorImpl().isValid(optionDto, paramValue)
          break
        default: // RECORD_ARRAY
          resultDto = new RecordArrayParamValidatorImpl().isValid(optionDto, paramValue)
      }

      resultDtos.push(resultDto)
    }
  })

  return resultDtos.filter((dto) => dto.errorMsg != null).map((dto) => dto.errorMsg).join(',')
}
