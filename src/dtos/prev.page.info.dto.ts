import {printErrorMsg} from "../util"

export class PrevPageInfoDto {
  readonly #browserId: string
  readonly #pageUrl: string

  constructor(browserId: string, pageUrl: string) {
    this.#browserId = browserId
    this.#pageUrl = pageUrl
  }

  get browserId(): string {
    return this.#browserId
  }

  get pageUrl(): string {
    return this.#pageUrl
  }

  toJSON(): object {
    return {
      browserId: this.browserId,
      pageUrl: this.pageUrl,
    }
  }

  static fromJSON(jsonStr: string): PrevPageInfoDto {
    let json
    try {
      json = JSON.parse(jsonStr)
    } catch (e) {
      printErrorMsg('PrevPageInfoDto.fromJSON : 잘못된 JSON 형식입니다')
    }

    return new PrevPageInfoDto(json.browserId, json.pageUrl)
  }
}
