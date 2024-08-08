import {beforeAll, describe, expect, test} from '@jest/globals'
import {ManageStorageData} from "../../src/storage/manage.storage.data"
import container from "../../src/config/inversify_config"
import {ManageSaveUserData} from "../../src/userdata/manage.save.user.data"

describe('userData', () => {
  let manageStorageData: ManageStorageData
  let manageSaveUserData: ManageSaveUserData

  beforeAll(() => {
    manageStorageData = container.get<ManageStorageData>('ManageStorageData')
    manageSaveUserData = container.get<ManageSaveUserData>('ManageSaveUserData')
  })

  test('로그인 계정 정보 정상입력 확인', () => {
    manageSaveUserData.save([
      {event: "setLoginAccount", hash_account: "해시된 로그인 ID 정보", hash_method: "sha256"},
    ])

    const userData = manageStorageData.findUserData()
    expect(userData.loginAccount).toEqual({hash_account: "해시된 로그인 ID 정보", hash_method: "sha256"})
  })

  test('리뷰 html selector 정보 정상입력 확인', () => {
    manageSaveUserData.save([
      {
        event: "setReviewSelector",
        list_area_selector: "div#tab3",
        row_contents_selector: "div.reviewtxt"
      }
    ])

    const userData = manageStorageData.findUserData()
    expect(userData.reviewSelector).toEqual({
      list_area_selector: "div#tab3",
      row_contents_selector: "div.reviewtxt"
    })
  })

  test('계정 관련 정보 정상 입력 확인', () => {
    manageSaveUserData.save([
      {event: "setRegisterAccount", hash_account: "해시된 신규등록 로그인 ID 정보", hash_method: "sha256"},
      {event: "setAge", age: 25},
      {event: "setDomestic", is_domestic: true},
      {event: "setEmail", email: "test@gmail.com"},
      {event: "setGender", gender: "M"},
      {event: "setLoginType", login_type: "email"},
      {event: "setName", name: "가나다"},
      {event: "setPhone", phone: "010-1111-2222"},
      {event: "setRegisterDate", register_date: "2022.09.11"},
      {event: "setCustomData", custom_data1: "##SHA256로 해시된 유저의 이메일 주소##", custom_data2: 'sha256'},
    ])

    const userData = manageStorageData.findUserData()
    expect(userData.user.registerAccount).toEqual({hash_account: '해시된 신규등록 로그인 ID 정보', hash_method: 'sha256'})
    expect(userData.user.age).toEqual(25)
    expect(userData.user.domestic).toEqual(true)
    expect(userData.user.email).toEqual('test@gmail.com')
    expect(userData.user.gender).toEqual('M')
    expect(userData.user.loginType).toEqual('email')
    expect(userData.user.name).toEqual('가나다')
    expect(userData.user.phone).toEqual('010-1111-2222')
    expect(userData.user.registerDate).toEqual('2022.09.11')
    expect(userData.customData).toEqual({custom_data1: '##SHA256로 해시된 유저의 이메일 주소##', custom_data2: 'sha256'})
  })

  test('단일 상품 조회 정상 입력 확인', () => {
    manageSaveUserData.save([
      {
        event: "setProductView",
        productCode: 'Z1235455',
        productName: '상품',
        price: 60000,
        category: '잡화',
        subCategory: '의류'
      },
    ])

    const userData = manageStorageData.findUserData()
    expect(userData.product.productView.productCode).toEqual('Z1235455')
    expect(userData.product.productView.productName).toEqual('상품')
    expect(userData.product.productView.price).toEqual(60000)
    expect(userData.product.productView.category).toEqual('잡화')
    expect(userData.product.productView.subCategory).toEqual('의류')
  })

  test('장바구니 상품 조회 정상 입력 확인', () => {
    manageSaveUserData.save([
      {
        event: "setBasketProduct",
        productList: [{productCode: 'Z1235455', productName: '상품', price: 60000, category: '잡화', subCategory: '의류'},
          {productCode: 'Z1235456', productName: '상품2', price: 70000, category: '잡화', subCategory: '공구'}]
      },
    ])

    const userData = manageStorageData.findUserData()
    expect(userData.product.basketProduct[0].productCode).toEqual('Z1235455')
    expect(userData.product.basketProduct[0].productName).toEqual('상품')
    expect(userData.product.basketProduct[0].price).toEqual(60000)
    expect(userData.product.basketProduct[0].category).toEqual('잡화')
    expect(userData.product.basketProduct[0].subCategory).toEqual('의류')

    expect(userData.product.basketProduct[1].productCode).toEqual('Z1235456')
    expect(userData.product.basketProduct[1].productName).toEqual('상품2')
    expect(userData.product.basketProduct[1].price).toEqual(70000)
    expect(userData.product.basketProduct[1].category).toEqual('잡화')
    expect(userData.product.basketProduct[1].subCategory).toEqual('공구')
  })

  test('구매 상품 조회 정상 입력 확인', () => {
    manageSaveUserData.save([
      {
        event: "setPurchaseProduct",
        productList: [{productCode: 'Z1235455', productName: '상품', price: 60000, category: '잡화', subCategory: '의류'},
          {productCode: 'Z1235456', productName: '상품2', price: 70000, category: '잡화', subCategory: '공구'}]
      },
    ])

    const userData = manageStorageData.findUserData()
    expect(userData.product.purchaseProduct[0].productCode).toEqual('Z1235455')
    expect(userData.product.purchaseProduct[0].productName).toEqual('상품')
    expect(userData.product.purchaseProduct[0].price).toEqual(60000)
    expect(userData.product.purchaseProduct[0].category).toEqual('잡화')
    expect(userData.product.purchaseProduct[0].subCategory).toEqual('의류')

    expect(userData.product.purchaseProduct[1].productCode).toEqual('Z1235456')
    expect(userData.product.purchaseProduct[1].productName).toEqual('상품2')
    expect(userData.product.purchaseProduct[1].price).toEqual(70000)
    expect(userData.product.purchaseProduct[1].category).toEqual('잡화')
    expect(userData.product.purchaseProduct[1].subCategory).toEqual('공구')
  })

  test('검색어 정보 정상입력 확인', () => {
    manageSaveUserData.save([
      {event: "setSearchWord", search_word: "검색어1"},
    ])

    const userData = manageStorageData.findUserData()
    expect(userData.searchWord).toEqual("검색어1")
  })

  test('페이지명 정보 정상입력 확인', () => {
    manageSaveUserData.save([
      {event: "setPageName", page_name: "페이지명1"},
    ])

    const userData = manageStorageData.findUserData()
    expect(userData.pageName).toEqual("페이지명1")
  })
})
