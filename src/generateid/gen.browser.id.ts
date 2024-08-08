import {injectable} from "inversify"
import {v4 as uuidv4, v5 as uuidv5} from "uuid"

@injectable()
export class GenBrowserId {

  generateId(domain: string): string {
    return this.generateUUID(domain)
  }

  private generateUUID = (seed: string): string => {
    return uuidv5(seed, uuidv4())
  }
}
