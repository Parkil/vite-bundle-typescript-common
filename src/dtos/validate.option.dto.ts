import DATA_TYPE from "../enums/data.type"
import {ValidateElementOptionRecord} from "../types/validation.type"

export class ValidateOptionDto {
  readonly #paramName: string
  readonly #dataType: DATA_TYPE
  readonly #required: boolean
  readonly #min: number
  readonly #max: number
  readonly #elementOption: ValidateElementOptionRecord

  constructor(paramName: string, dataType: DATA_TYPE, required: boolean, min: number, max: number, elementOption: ValidateElementOptionRecord) {
    this.#paramName = paramName
    this.#dataType = dataType
    this.#required = required
    this.#min = min
    this.#max = max
    this.#elementOption = elementOption
  }


  get paramName(): string {
    return this.#paramName
  }

  get dataType(): DATA_TYPE {
    return this.#dataType
  }

  get required(): boolean {
    return this.#required
  }

  get min(): number {
    return this.#min
  }

  get max(): number {
    return this.#max
  }

  get elementOption(): ValidateElementOptionRecord {
    return this.#elementOption
  }

  static emptyDto(): ValidateOptionDto {
    return new ValidateOptionDto('', DATA_TYPE.STRING, false, 0, 0, {})
  }
}
