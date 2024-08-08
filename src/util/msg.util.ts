export const printErrorMsg = (msg: string) => {
  console.error(`recoable error : ${msg}`)
}

export const printErrorObj = (error: any): string => {
  let message

  if (error instanceof Error) {
    message = error.message
  } else {
    message = String(error)
  }

  return message
}
