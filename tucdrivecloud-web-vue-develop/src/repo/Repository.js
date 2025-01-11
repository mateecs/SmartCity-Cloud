import axios from 'axios'
import config from 'src/config'
import { useSessionStore } from 'src/stores/session'

const baseDomain = config.serverURI
const baseURL = `${baseDomain}/api/v2`

// create a const instance of the Repository
// to which we can add interceptors
// and export it at the end
// see: https://stackoverflow.com/questions/49288415/axios-request-interceptor-not-working

const instance = axios.create({
  baseURL
})

const sessionStore = useSessionStore()

/* Automatically add Authorization header to all requests */
instance.interceptors.request.use(function (config) {
  const token = sessionStore.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/*
 * Automatically handle requests which return 401 - Unauthorized
 * by forwarding them to the login page
 *
 * Automatically handle requests which return 403 - Forbidden
 * by displaying a message
*/

instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401: // Unauthorized
          if (!window.location.pathname.startsWith('/login')) {
            window.location = '/login?redirect=' + window.location.pathname
          }
          break
        case 403: // Forbidden
          // todo: integrate visually into website
          window.alert('You do not have sufficient permissions to perform this action.')
          break
      }
    }
    return Promise.reject(error)
  }
)

export default instance
