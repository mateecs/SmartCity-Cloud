export default {
  serverURI: process.env.NODE_ENV === 'production' ? '' : `${window.location.protocol}//${window.location.hostname}:3333`, // 'http://localhost:3333',
  fixedLayout: false,
  hideLogoOnMobile: false
}
