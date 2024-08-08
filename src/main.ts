import container from "./config/inversify_config"
import {BrowserEvent} from "./event/browser.event"
import {ManageSaveUserData} from "./userdata/manage.save.user.data"
import {RECOBLE_INIT_KEY, RECOBLE_KEY} from "./constants/constants"
import {ManageStorageData} from "./storage/manage.storage.data";

const browserEvent = container.get<BrowserEvent>('BrowserEvent')
const manageSaveUserData = container.get<ManageSaveUserData>('ManageSaveUserData')
const manageStorageData = container.get<ManageStorageData>('ManageStorageData')

browserEvent.setLoadEvent()
browserEvent.setUnloadEvent()

const recoble = (paramArr: { [key: string]: any }[]) => {
  manageSaveUserData.save(paramArr)
}

const init = (apiKey: string) => {
  manageStorageData.setApiKey(apiKey)
}

// @ts-ignore
window[RECOBLE_KEY] = recoble

// @ts-ignore
window[RECOBLE_INIT_KEY] = init


