import request from '@/utils/request'

export function fetchDeviceList(query) {
  return request({
    url: '/fab/fabequipmentmodel/ajaxList',
    method: 'get',
    params: query
  })
}

export function fetchLookup(query) {
  return request({
    url: '/fab/fabequipmentmodel/lookup',
    method: 'get',
    params: query
  })
}

export function addDevice(data) {
  return request({
    url: '/fab/fabequipmentmodel/create',
    method: 'post',
    data
  })
}

export function updateDevice(data) {
  return request({
    url: '/fab/fabequipmentmodel/' + data.id + '/update',
    method: 'post',
    data
  })
}

export function deleteDevice(id) {
  return request({
    url: '/fab/fabequipmentmodel/' + id + '/delete',
    method: 'post'
  })
}

export function getDeteilsDevice(id) {
  return request({
    url: '/fab/fabequipmentmodel/' + id + '/get',
    method: 'get',
    id
  })
}

export function batchDelete(data) {
  return request({
    url: '/fab/fabequipmentmodel/batch/delete',
    method: 'post',
    data
  })
}
