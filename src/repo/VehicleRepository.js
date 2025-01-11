// repository which provides methods for vehicles
import Repository from './Repository'

const resource = '/devices'

export default {
  list () {
    return Repository.get(`${resource}`)
  },
  search (searchTerm) {
    return Repository.get(`${resource}?q=${searchTerm}`)
  },
  createVehicle (vehicleInfo) {
    return Repository.post(`${resource}`, vehicleInfo)
  },
  deleteVehicle (vehicleId) {
    return Repository.delete(`${resource}/${vehicleId}`)
  },
  getConfiguration (vehicleId) {
    return Repository.get(`${resource}/${vehicleId}`)
  },
  updateConfiguration (vehicleId, configurationData) {
    return Repository.put(`${resource}/${vehicleId}`,
      configurationData)
  }
}
