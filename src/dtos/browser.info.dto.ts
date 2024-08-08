
export class BrowserInfoDto {
  readonly #userAgent: string
  readonly #referrer: string
  readonly #pageUrl: string
  readonly #ip: string
  readonly #countryCode: string

  constructor(userAgent: string, referrer: string, pageUrl: string, ip: string, countryCode: string) {
    this.#userAgent = userAgent
    this.#referrer = referrer
    this.#pageUrl = pageUrl
    this.#ip = ip
    this.#countryCode = countryCode
  }

  get pageUrl(): string {
    return this.#pageUrl
  }

  toJSON(): Record<string, any> {
    return {
      userAgent: this.#userAgent,
      referrer: this.#referrer,
      pageUrl: this.#pageUrl,
      ip: this.#ip,
      countryCode: this.#countryCode,
    }
  }
}
