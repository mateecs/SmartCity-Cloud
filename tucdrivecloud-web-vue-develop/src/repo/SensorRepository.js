// repository which provides methods for vehicles
import Repository from './Repository'

const resource = '/sensors'

export default {
  list () {
    return Repository.get(`${resource}`)
  },
  get (sensorId) {
    return Repository.get(`${resource}/${sensorId}`)
  },
  update (sensorId, data) {
    return Repository.put(`${resource}/${sensorId}`, data)
  },
  search (searchTerm) {
    return Repository.get(`${resource}?q=${searchTerm}`)
  },
  createSensor (sensorInfo) {
    return Repository.post(`${resource}`, sensorInfo)
  },
  deleteSensor (sensorId) {
    return Repository.delete(`${resource}/${sensorId}`)
  }
}
