const UNLOAD_ENUM = {
  PAGE_UNMOUNT: {capacity: 5},
  PAGE_UNLOAD: {capacity: 0},
  PAGE_UNMOUNT_TEST: {capacity: 2},
}

type UNLOAD_ENUM = typeof UNLOAD_ENUM[keyof typeof UNLOAD_ENUM]

export { UNLOAD_ENUM }
