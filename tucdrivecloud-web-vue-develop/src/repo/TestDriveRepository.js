// repository which provides methods for vehicles
import dayjs from 'dayjs'

import Repository from './Repository'
import config from '../config'

const baseDomain = config.serverURI
const baseURL = `${baseDomain}/api/v2`

const resource = '/recordings'

export default {
  list (page, perPage, states, q, dateRange) {
    if (dateRange.length === 2) {
      return Repository.get(`${resource}?page=${page}&perPage=${perPage}&states=${states}&q=${q}&from=${dayjs(dateRange[0]).valueOf()}&to=${dayjs(dateRange[1]).valueOf()}`)
    } else {
      return Repository.get(`${resource}?page=${page}&perPage=${perPage}&states=${states}&q=${q}`)
    }
  },
  listForVehicle (vehicleId) {
    return Repository.get(`${resource}?vehicleId=${vehicleId}`)
  },
  get (testDriveId) {
    return Repository.get(`${resource}/${testDriveId}`)
  },
  getComputingTasks(recordingId) {
    return Repository.get(`${resource}/${recordingId}/compute-tasks`)
  },
  getLabels (testDriveId) {
    return Repository.get(`${resource}/${testDriveId}/labels`)
  },
  updateLabels (testDriveId, toadd, toremove) {
    return Repository.put(`${resource}/${testDriveId}/labels`, {
      to_add: toadd,
      to_remove: toremove
    })
  },
  getRecordedStreams (testDriveId) {
    return Repository.get(`${resource}/${testDriveId}/streams`)
  },
  getRoute (testDriveId) {
    return Repository.get(`${resource}/${testDriveId}/streams/route`)
  },
  getTimestamps (testDriveId, sensorId) {
    return Repository.get(`${resource}/${testDriveId}/streams/${sensorId}/timestamps`)
  },
  getStream (testDriveId, sensorId) {
    return Repository.get(`${resource}/${testDriveId}/streams/${sensorId}`)
  },
  getFrame (testDriveId, sensorId, timestamp) {
    return Repository.get(`${resource}/${testDriveId}/streams/${sensorId}/frame?timestamp=${timestamp}`)
  },
  getFrameDirect (testDriveId, sensorId, timestamp) {
    // return Repository.get(`${resource}/${testDriveId}/streams/${sensorId}/frame?timestamp=${timestamp}&direct=1`)
    return Repository.get(`${resource}/${testDriveId}/streams/${sensorId}/frame/direct?timestamp=${timestamp}`, { responseType: 'blob' })
  },
  getFramesDirect (testDriveId, sensorId, timestamps) {
    return Repository.get(`${resource}/${testDriveId}/streams/${sensorId}/frames`, { params: { timestamps: JSON.stringify(timestamps) } })
  },
  getBaseUrl () {
    return baseURL
  }
}
