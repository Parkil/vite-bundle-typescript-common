export class SessionStorage {
  private readonly storage

  constructor() {
    this.storage = window.sessionStorage
  }

  setItem(key: string, value: string) {
    this.storage.setItem(key, value)
  }

  getItem (key: string): any {
    return this.storage.getItem(key)
  }

  removeItem(key: string): void {
    this.storage.removeItem(key)
  }
}
