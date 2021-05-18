import request from '@/utils/request'

export function getModels() {
  return request({
    url: '/map/maptraytype/getModelsBySelect',
    method: 'get',
    params: {}
  })
}

export function getTrayEqpList() {
  return request({
    url: '/map/maptraytype/getTrayEqpList',
    method: 'get',
    params: {}
  })
}

export function getPuctionParam(id) {
  return request({
    url: '/map/maptraychipmove/getProductionParam?id=' + id,
    method: 'get',
    params: {}
  })
}
