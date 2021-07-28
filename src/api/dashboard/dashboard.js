import request from '@/utils/request'

export function fetchHeader(query) {
  return request({
    url: '/mes/meslotwip/indexFour',
    method: 'get',
    params: query
  })
}

export function fetchEqpHeader() {
  return request({
    url: '/sysProject/indexFour',
    method: 'get'
  })
}

export function fetchList() {
  return request({
    url: '/fab/fabequipmentstatus/listEqpStatus',
    method: 'get'
  })
}

export function fetchChart() {
  return request({
    url: '/oven/ovnbatchlot/chart',
    method: 'get'
  })
}

export function fetchEqpList() {
  return request({
    url: '/fab/fabequipment/eqpIdlist',
    method: 'get'
  })
}
