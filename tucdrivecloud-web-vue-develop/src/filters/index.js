import dayjs from 'dayjs'

import numeral from 'numeral'

const urlParser = document.createElement('a')

export function domain (url) {
  urlParser.href = url
  return urlParser.hostname
}

export function count (arr) {
  return arr.length
}

export function prettyDate (date) {
  var a = new Date(date)
  return a.toDateString()
}

export function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }

  return time + label + 's'
}

export function formatWithThousandSep (number) {
  return numeral(number).format('0,0')
}

export function formatDateTime (value, formatStr) {
  if (value) {
    return dayjs(value).format(formatStr)
  } else {
    return ''
  }
}
