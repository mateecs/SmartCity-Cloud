import { defineStore } from 'pinia'
import axios from 'axios'

export const useSessionStore = defineStore('session', {
    state: () => {
        return {
            user: null,
            displayName: null,
            token: null
        }
    },
    actions: {
          authenticate (user, token, displayName) {
            this.user = user
            this.token = token
            this.displayName = displayName

            // write current user-data to local storage, so that we
            // can read it after a page reload
            if (window.sessionStorage) {
              window.sessionStorage.setItem('user', JSON.stringify(user))
              window.sessionStorage.setItem('token', token)
              window.sessionStorage.setItem('displayName', JSON.stringify(displayName))
            }
          },
          logout () {
            // delete session information
            this.user = null
            this.token = null
            this.displayName = null
            axios.defaults.headers.common.Authorization = null

            if (window.sessionStorage) {
              window.sessionStorage.removeItem('user')
              window.sessionStorage.removeItem('displayName')
              window.sessionStorage.removeItem('token')
            }
          }
    }
})