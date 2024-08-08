export const chkBrowserIsValid = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined' && typeof navigator !== 'undefined'
}

// 일반 웹과 react 의 계산 법이 다름 아래는 react 에서 스크롤 위치를 계산하는 방법
export const calcScrollLoc = (): string => {
  if (!chkBrowserIsValid()) {
    return '0'
  }

  const totalHeight = document.body.scrollHeight - window.innerHeight
  const currentVerticalPos = window.scrollY

  const currentScrollPos = (currentVerticalPos / totalHeight) * 100
	return currentScrollPos.toFixed(2)
}
