import {injectable} from "inversify"

@injectable()
export class ScrappingReview {
  findReviewContents(reviewListSelector: string, reviewRowContentSelector: string, doc: Document): string[]  {
    let returnList: string[] = []
    const reviewListArea = doc.querySelector(reviewListSelector)

    if (reviewListArea) {
      const reviewContents = reviewListArea.querySelectorAll(reviewRowContentSelector)
      reviewContents.forEach((el) => {
        if (el.textContent) {
          returnList.push(el.textContent)
        }
      })
    }
    return returnList
  }
}
