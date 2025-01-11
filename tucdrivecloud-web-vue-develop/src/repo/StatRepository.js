// repository which provides statistical information

import Repository from './Repository'

const resource = '/stats'

export default {
  get () {
    return Repository.get(`${resource}`)
  },
  getDriveCountByVehicle () {
    return Repository.get(`${resource}/driveCountByVehicle`)
  },
  getRecordingActivityByYear (year) {
    return Repository.get(`${resource}/recordingActivityByYear?year=${year}`)
  }

}
