export class LocalStorage {
  private storage: Record<string, any> = {}

  setItem(key: string, value: string) {
    this.storage[key] = value
  }

  getItem (key: string): any {
    return this.storage[key]
  }

  removeItem(key: string): void {
    delete this.storage[key]
  }
}
