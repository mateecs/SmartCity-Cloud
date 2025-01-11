// load third-party javascript files
import 'bootstrap/dist/js/bootstrap.min.js'
import 'admin-lte/dist/js/adminlte.min.js'
import 'pace-js/pace.min.js'

// css files
import 'admin-lte/dist/css/AdminLTE.min.css'
import '@/assets/css/bootstrap-custom.scss'
import 'admin-lte/dist/css/skins/skin-green.min.css'
import '@/assets/css/pace-theme-custom.css'
import '@/assets/css/skin-green-tuc.css'

// Import System requirements
import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import { createPinia, PiniaVuePlugin } from 'pinia'

// Import Helpers for filters
import { domain, count, prettyDate, pluralize, formatWithThousandSep, formatDateTime } from 'src/filters'

import {
  LayoutPlugin, TablePlugin, PaginationPlugin,
  SpinnerPlugin, ModalPlugin, FormGroupPlugin, FormInputPlugin,
  InputGroupPlugin, ButtonPlugin, ButtonToolbarPlugin,
  ButtonGroupPlugin, DropdownPlugin, FormPlugin, CardPlugin,
  FormRadioPlugin, FormSelectPlugin, FormCheckboxPlugin
} from 'bootstrap-vue'

import { library } from '@fortawesome/fontawesome-svg-core'
// define the font-awesome icons we want to use
import {
  faEnvelope, faLock, faDesktop, faSearch, faCar, faSatelliteDish,
  faCogs, faChartArea, faCloudUploadAlt, faCloudDownloadAlt, faFlag,
  faQuestionCircle, faCopyright, faEdit, faTrash, faPlus, faSignOutAlt,
  faBars, faCircle, faDatabase, faUndo, faFlagCheckered, faPlay, faPause,
  faCarSide, faClock, faInfoCircle, faBalanceScale, faSignInAlt, faUser,
  faUserCog, faFilter, faMicrochip
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'

import { useSessionStore } from './stores/session'

// Import Views - Top level
const AppView = () => import('./components/App.vue')

// Import Install and register helper items
Vue.filter('count', count)
Vue.filter('domain', domain)
Vue.filter('prettyDate', prettyDate)
Vue.filter('pluralize', pluralize)
Vue.filter('formatWithThousandSep', formatWithThousandSep)
Vue.filter('formatDateTime', formatDateTime)

Vue.use(VueRouter)

Vue.use(PiniaVuePlugin)
const pinia = createPinia()
Vue.use(pinia)

// setup vue-bootstrap components
Vue.use(LayoutPlugin)
Vue.use(TablePlugin)
Vue.use(PaginationPlugin)
Vue.use(SpinnerPlugin)
Vue.use(ModalPlugin)
Vue.use(ButtonPlugin)
Vue.use(InputGroupPlugin)
Vue.use(FormPlugin)
Vue.use(FormGroupPlugin)
Vue.use(FormInputPlugin)
Vue.use(ButtonToolbarPlugin)
Vue.use(ButtonGroupPlugin)
Vue.use(DropdownPlugin)
Vue.use(CardPlugin)
Vue.use(FormRadioPlugin)
Vue.use(FormSelectPlugin)
Vue.use(FormCheckboxPlugin)

// other vue components
// Vue.use(DatePick)
// Vue.component('VueSlider', VueSlider)

// leaflet
/* Vue.component('l-map', LMap)
Vue.component('l-tile-layer', LTileLayer)
Vue.component('l-marker', LMarker)
Vue.component('l-polyline', LPolyline) */

/* delete Icon.Default.prototype._getIconUrl

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
}) */

// setup font-awesome
library.add(faEnvelope, faLock, faDesktop, faSearch, faCar, faSatelliteDish,
  faCogs, faChartArea, faCloudUploadAlt, faCloudDownloadAlt, faFlag,
  faQuestionCircle, faCopyright, faEdit, faTrash, faPlus, faSignOutAlt,
  faBars, faCircle, faDatabase, faUndo, faFlagCheckered, faPlay, faPause,
  faCarSide, faClock, faInfoCircle, faBalanceScale, faSignInAlt, faUser, faUserCog,
  faFilter, faMicrochip)
Vue.component('fa-icon', FontAwesomeIcon)
Vue.component('fa-layers', FontAwesomeLayers)

// Routing logic
var router = new VueRouter({
  base: process.env.NODE_ENV === 'production' ? '/' : '',
  routes: routes,
  mode: 'history',
  // linkExactActiveClass: 'active',
  linkActiveClass: 'active',
  scrollBehavior: function (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  }
})

// Some middleware to help us ensure that the user is authenticated.
router.beforeEach((to, from, next) => {
  const sessionStore = useSessionStore()
  if (to.path === '/' || to.path === '') {
    next({ path: '/dashboard' })
  } else {
    next()
  }
})

// restore session information from local storage, if available
if (window.localStorage) {
  var localUserString = window.sessionStorage.getItem('user') || 'null'
  var localUser = JSON.parse(localUserString)
  var displayName = JSON.parse(window.sessionStorage.getItem('displayName'))

  const sessionStore = useSessionStore()
  if (localUser && displayName && sessionStore.user !== localUser) {
    var user = localUser
    var token = window.sessionStorage.getItem('token')
    sessionStore.authenticate(user, token, displayName)
  }
}

// Start our app!
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router: router,
  render: h => h(AppView),
  pinia
})
