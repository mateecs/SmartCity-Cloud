// repository which provides methods for drive setups
import Repository from './Repository'

const resource = '/drvsetups'

export default {
  list () {
    return Repository.get(`${resource}`)
  },
  createSetup (setupInfo) {
    return Repository.post(`${resource}`, setupInfo)
  },
  deleteToken (setupId) {
    return Repository.delete(`${resource}/${setupId}`)
  },
  getConfiguration (setupId) {
    return Repository.get(`${resource}/${setupId}`)
  },
  updateConfiguration (setupId, configurationData) {
    return Repository.put(`${resource}/${setupId}`,
      configurationData)
  }
}
