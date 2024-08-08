import * as CryptoJS from 'crypto-js'

export const encryptAES = (plainText: string, secret: string): string => {
  return CryptoJS.AES.encrypt(plainText, secret).toString()
}

export const decryptAES = (encryptText:string, secret: string): string => {
  const bytes  = CryptoJS.AES.decrypt(encryptText, secret)
  return bytes.toString(CryptoJS.enc.Utf8)
}
