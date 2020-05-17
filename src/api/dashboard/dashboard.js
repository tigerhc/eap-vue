import request from '@/utils/request'

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
