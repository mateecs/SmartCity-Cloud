// repository which provides methods for compute tasks
import Repository from './Repository'

const resource = '/compute-tasks'

export default {
  list () {
    return Repository.get(`${resource}`)
  },
  run (testDriveId, streamId, taskId) {
    return Repository.post(`${resource}/run`, {
      "taskId": taskId,
      "recordingId": testDriveId,
      "streamId": streamId
    })
  }
}