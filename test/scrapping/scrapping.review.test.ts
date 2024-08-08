import {beforeAll, describe, expect, test} from '@jest/globals'
import container from "../../src/config/inversify_config"
import {ScrappingReview} from "../../src/scrapping/scrapping.review"
import {loadDomFromFile} from "../util/test.util";
import * as path from "node:path";

describe('ScrappingReview', () => {
  let scrappingReview: ScrappingReview

  beforeAll(() => {
    scrappingReview = container.get<ScrappingReview>('ScrappingReview')
  })

  test('리뷰를 정상적으로 가져오는지 확인', async () => {
    const htmlString = "<div id='list'><div id='row'>가가가</div><div id='row'>나나나</div></div>";
    const doc = new DOMParser().parseFromString(htmlString, "text/html");

    const list = scrappingReview.findReviewContents('div#list', 'div#row', doc)
    expect(list[0]).toEqual('가가가')
    expect(list[1]).toEqual('나나나')
  })

  test('리뷰를 정상적으로 가져오는지 확인(쿠팡)', async () => {
    const filePath = path.join(__dirname, "./", "coupang_review.html");
    const doc = loadDomFromFile(filePath)

    const list = scrappingReview.findReviewContents('section.js_reviewArticleListContainer', 'div.sdp-review__article__list__review__content.js_reviewArticleContent', doc)
    expect(list[0]).toContain("내돈내산 찐 후기입니다!!!")
    expect(list[1]).toContain("아이패드 10세대는 보급형이지만, 그동안 가격이 너무 비싸서 구매망설이신분이 많을거같아요!")
    expect(list[2]).toContain("패드자체는 디자인이 아주이쁘고 원래부터 패드를하나 장만해야겠다는 생각이 있었어서 만족도가 정말 아주높다")
    expect(list[3]).toContain("애플유저 사야낫는병...")
    expect(list[4]).toContain("Apple 정품 2022 아이패드 10세대, 실버, 256GB, Wi-Fi")
  })

  test('리뷰를 정상적으로 가져오는지 확인(네이버 스마트 스토어)', async () => {
    const filePath = path.join(__dirname, "./", "naver_smart_store.html");
    const doc = loadDomFromFile(filePath)

    const list = scrappingReview.findReviewContents('div#tab3', 'div.reviewtxt', doc)
    expect(list[0]).toContain("구성도좋고 여름맞춤이라 다양하게 먹을수있는것도 좋았어요.")
    expect(list[1]).toContain("이메뉴로 아쉽지 않을까 우려했는데")
    expect(list[2]).toContain("300샐러드랑 300라이스밀만 먹어봤었는데 여름 행사하는 김에 시켜보았습니다.")
    expect(list[3]).toContain("생각보다 배부르고 맛있어요! 상담도 곧 받을 예정입니다.")
  })
})
