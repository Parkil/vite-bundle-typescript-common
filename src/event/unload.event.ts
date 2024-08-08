import {UNLOAD_ENUM} from "../enums/unload.type.ts"

export interface UnloadEvent {
  onUnload(currentUrl: string, unloadType: UNLOAD_ENUM): void;
}
