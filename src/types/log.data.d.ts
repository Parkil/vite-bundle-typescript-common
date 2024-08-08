export type LogData = {
  browserId: string,
  searchWord?: string,
  pageName?: string,
  reviewList?: string[],
  loginAccount?: { hash_account: string, hash_method: string },
  userAgent: string,
  referrer: string,
  pageUrl: string,
  ip: string,
  countryCode: string,
  pageStartDtm: string,
  pageEndDtm: string | null,
  pageActivity: { view: boolean, scroll: string, click: boolean },
  pageMoveType: { isNextPage: boolean, isExitPage: boolean, isLeavePage: boolean },
  conversion?: Conversion,
  lastLogFlag?: boolean,
}

export type Conversion = {
  registerUser?: any, productView?: any, productBasket?: any, productPurchase?: any
}

