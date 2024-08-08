export const chkBrowserIsValid = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined' && typeof navigator !== 'undefined'
}

export const calcScrollLoc = (): number => {
  if (!chkBrowserIsValid()) {
    return 0
  }
  const totalHeight = document.body.scrollHeight
	const currentPos  = (window.scrollY <= window.innerHeight) ? window.scrollY : window.innerHeight + window.scrollY
	return (currentPos / totalHeight) * 100
}
