export const formatDate = (date: Date): string => {
  // local en-CA 가 yyyy-mm-dd format 을 가짐
  let formatDateStr = new Intl.DateTimeFormat('en-CA', {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).format(date)

  return formatDateStr.replace(', ', 'T')
}
