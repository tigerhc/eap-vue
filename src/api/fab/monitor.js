import request from '@/utils/request'

export function fetchGetChart(query) {
  return request({
    url: '/fab/fabequipmentstatus/chart',
    method: 'get',
    params: query
  })
}
export function fetchDataList(query) {
  return request({
    url: '/fab/fabequipmentstatus/listEqpStatus',
    method: 'get',
    params: query
  })
}

export function fetchYield(data) {
  return request({
    url: '/fab/fabequipmentstatus/listPdtStatus',
    method: 'get',
    params: data
  })
}

export function getEqpList() {
  return request({
    url: '/fab/fabequipment/SelectStarteqpIdlist',
    method: 'get'
  })
}
