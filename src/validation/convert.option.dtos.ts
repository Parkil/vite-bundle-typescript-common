import DATA_TYPE from "../enums/data.type"
import {ValidateOptionDto} from "../dtos"
import {ValidateOptionRecord} from "../types/validation.type"

export const convertOptionDtos = (options: ValidateOptionRecord): ValidateOptionDto[] => {
  return Object.keys(options).map((key) => convertOptionDto(key, options))
}

const convertOptionDto = (key: string, options: ValidateOptionRecord): ValidateOptionDto => {
  let option = options[key]
  let minMaxArr = convertMinMax(option.min, option.max, option.dataType)
  const elementOption = typeof option.elementOption === 'undefined' ? {} : option.elementOption
  return new ValidateOptionDto(key, option.dataType, option.required, minMaxArr[0], minMaxArr[1], elementOption)
}

const convertMinMax = (rawMin: number | undefined, rawMax: number | undefined, datatype: string) => {
  let min: number
  let max: number
  if (datatype == DATA_TYPE.STRING) {
    min = !rawMin ? 0 : rawMin
    max = !rawMax ? Number.MAX_SAFE_INTEGER : rawMax
  } else {
    min = !rawMin ? Number.MIN_SAFE_INTEGER : rawMin
    max = !rawMax ? Number.MAX_SAFE_INTEGER : rawMax
  }

  return [min, max]
}
