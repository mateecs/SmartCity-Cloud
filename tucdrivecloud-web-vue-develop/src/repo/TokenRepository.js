// repository which provides methods for tokens
import Repository from './Repository'

const resource = '/tokens'

export default {
  list () {
    return Repository.get(`${resource}`)
  },
  createToken (tokenInfo) {
    return Repository.post(`${resource}`, tokenInfo)
  },
  deleteToken (tokenId) {
    return Repository.delete(`${resource}/${tokenId}`)
  },
  getConfiguration (tokenId) {
    return Repository.get(`${resource}/${tokenId}`)
  },
  updateConfiguration (tokenId, configurationData) {
    return Repository.put(`${resource}/${tokenId}`,
      configurationData)
  }
}
