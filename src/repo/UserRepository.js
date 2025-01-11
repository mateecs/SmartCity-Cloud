// repository which provides methods for user data and session management
import Repository from './Repository'

const resource = '/user'

export default {
  login (uname, pwd) {
    return Repository.post(`${resource}/login`, {
      username: uname,
      password: pwd
    })
  },
  logout () {
    return Repository.get(`${resource}/logout`)
  }
}
