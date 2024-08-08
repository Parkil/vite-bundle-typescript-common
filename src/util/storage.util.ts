import {PageActivityType} from "../types/page.activity.type"

export const emptyPageActivityObj = (): PageActivityType => {
  return {VIEW: false, SCROLL: 0.0, CLICK: false} 
}
