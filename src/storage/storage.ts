import {chkBrowserIsValid} from "../util"
import {SessionStorage} from "./session.storage"
import {LocalStorage} from "./local.storage"

export class Storage {
  private readonly innerStorage

  constructor() {
    if (chkBrowserIsValid()) {
      this.innerStorage = new SessionStorage()
    } else {
      this.innerStorage = new LocalStorage()
    }
  }

  setItem = (key: string, value: string) => {
    this.innerStorage.setItem(key, value)
  }

  getItem = (key: string): any => {
    return this.innerStorage.getItem(key)
  }

  removeItem = (key: string) => {
    return this.innerStorage.removeItem(key)
  }
}

