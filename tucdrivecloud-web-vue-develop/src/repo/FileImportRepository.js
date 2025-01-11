// repository which provides methods for imported files
import Repository from './Repository'

const resource = '/fileimport'

export default {

  uploadFile (filedata) {
    return Repository.post(`${resource}`, filedata)
  }
}
