import "reflect-metadata"
import {Container} from "inversify"
import {FindBrowserInfo} from "../browserinfo/find.browser.info"
import {AxiosClient} from "../httpclient/axios.client"
import {ManageStorageData} from "../storage/manage.storage.data"
import {GenBrowserId} from "../generateid/gen.browser.id"
import {ManageConversionInfo} from "../conversion/manage.conversion.info"
import {BrowserEvent} from "../event/browser.event"
import {LoadEventDetail} from "../event/load.event.detail"
import {ChkMeetsConversion} from "../conversion/chk.meets.conversion"
import {UnLoadEventDetail} from "../event/unload.event.detail"
import {SendHttpRequest} from "../sendhttprequest/send.http.request"
import {SaveUserData} from "../userdata/save.user.data"
import {SetLoginAccount} from "../userdata/impl/set.login.account"
import {SetAge} from "../userdata/impl/set.age"
import {SetDomestic} from "../userdata/impl/set.domestic"
import {SetEmail} from "../userdata/impl/set.email"
import {SetGender} from "../userdata/impl/set.gender"
import {SetLoginType} from "../userdata/impl/set.login.type"
import {SetName} from "../userdata/impl/set.name"
import {SetPhone} from "../userdata/impl/set.phone"
import {SetRegisterDate} from "../userdata/impl/set.register.date"
import {ManageSaveUserData} from "../userdata/manage.save.user.data"
import {SetCustomData} from "../userdata/impl/set.custom.data"
import {SetProductView} from "../userdata/impl/set.product.view"
import {SetPurchaseProduct} from "../userdata/impl/set.purchase.product"
import {SetBasketProduct} from "../userdata/impl/set.basket.product"
import {XhrClient} from "../httpclient/xhr.client"
import {SetRegisterAccount} from "../userdata/impl/set.register.account"
import {SetReviewSelector} from "../userdata/impl/set.review.selector"
import {ScrappingReview} from "../scrapping/scrapping.review"
import {SetSearchWord} from "../userdata/impl/set.search.word"
import {SetPageName} from "../userdata/impl/set.page.name"

const container = new Container()

container.bind<SaveUserData>('SaveUserData').to(SetAge)
container.bind<SaveUserData>('SaveUserData').to(SetDomestic)
container.bind<SaveUserData>('SaveUserData').to(SetEmail)
container.bind<SaveUserData>('SaveUserData').to(SetGender)
container.bind<SaveUserData>('SaveUserData').to(SetLoginType)
container.bind<SaveUserData>('SaveUserData').to(SetName)
container.bind<SaveUserData>('SaveUserData').to(SetPhone)
container.bind<SaveUserData>('SaveUserData').to(SetRegisterDate)
container.bind<SaveUserData>('SaveUserData').to(SetProductView)
container.bind<SaveUserData>('SaveUserData').to(SetPurchaseProduct)
container.bind<SaveUserData>('SaveUserData').to(SetBasketProduct)
container.bind<SaveUserData>('SaveUserData').to(SetLoginAccount)
container.bind<SaveUserData>('SaveUserData').to(SetRegisterAccount)
container.bind<SaveUserData>('SaveUserData').to(SetReviewSelector)
container.bind<SaveUserData>('SaveUserData').to(SetSearchWord)
container.bind<SaveUserData>('SaveUserData').to(SetPageName)
container.bind<SaveUserData>('SaveUserData').to(SetCustomData)

container.bind<ManageSaveUserData>('ManageSaveUserData').to(ManageSaveUserData)
container.bind<FindBrowserInfo>('FindBrowserInfo').to(FindBrowserInfo)
container.bind<AxiosClient>('AxiosClient').to(AxiosClient)
container.bind<XhrClient>('XhrClient').to(XhrClient)
container.bind<ManageStorageData>('ManageStorageData').to(ManageStorageData)
container.bind<GenBrowserId>('GenBrowserId').to(GenBrowserId)
container.bind<ManageConversionInfo>('ManageConversionInfo').to(ManageConversionInfo)
container.bind<ChkMeetsConversion>('ChkMeetsConversion').to(ChkMeetsConversion)
container.bind<BrowserEvent>('BrowserEvent').to(BrowserEvent)
container.bind<LoadEventDetail>('LoadEventDetail').to(LoadEventDetail)
container.bind<UnLoadEventDetail>('UnLoadEventDetail').to(UnLoadEventDetail)
container.bind<SendHttpRequest>('SendHttpRequest').to(SendHttpRequest)
container.bind<ScrappingReview>('ScrappingReview').to(ScrappingReview)

export default container
