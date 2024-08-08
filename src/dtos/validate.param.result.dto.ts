import {ValidateOptionDto} from "./validate.option.dto"
import VALIDATE_ERROR_TYPE from "../enums/validate.error.type"

export class ValidateParamResultDto {

  readonly #optionDto: ValidateOptionDto
  readonly #value: any
  readonly #errorType: VALIDATE_ERROR_TYPE
  readonly #invalidKeyArr: string[]
  readonly #elementErrorMsg: string

  constructor(optionDto: ValidateOptionDto, value: any, errorType: VALIDATE_ERROR_TYPE, invalidKeyArr: string[], elementErrorMsg: string) {
    this.#optionDto = optionDto
    this.#value = value
    this.#errorType = errorType
    this.#invalidKeyArr = invalidKeyArr
    this.#elementErrorMsg = elementErrorMsg
  }

  get errorMsg(): string | null {
    const optionDto = this.#optionDto
    const errorType = this.#errorType
    let errorMsg

    switch (errorType){
      case VALIDATE_ERROR_TYPE.INVALID_DATA_KEY:
        errorMsg = `[${this.#invalidKeyArr.join(',')}]는 잘못된 key 입니다`
        break
      case VALIDATE_ERROR_TYPE.VALUE_EMPTY:
        errorMsg = `파라메터 ${optionDto.paramName}의 값이 입력되지 않았습니다`
        break
      case VALIDATE_ERROR_TYPE.INVALID_VALUE_TYPE:
        errorMsg = `${this.#value}(${optionDto.paramName}) 값은 ${optionDto.dataType} 이어야 합니다`
        break
      case VALIDATE_ERROR_TYPE.DATA_RANGE_EXCEED:
        errorMsg = `${this.#value}(${optionDto.paramName}) 은 ${optionDto.min} ~ ${optionDto.max} 의 값을 가져야 합니다`
        break
      case VALIDATE_ERROR_TYPE.DATA_LENGTH_EXCEED:
        errorMsg = `${this.#value}(${optionDto.paramName}) 의 길이는 ${optionDto.min} ~ ${optionDto.max} 내여야 합니다`
        break
      case VALIDATE_ERROR_TYPE.INVALID_ELEMENTS:
        errorMsg = this.#elementErrorMsg
        break
      default:
        errorMsg = null
    }

    return errorMsg
  }
}
