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

export function getPuctionParam(id, btn) {
  return request({
    url: '/map/maptraychipmove/getProductionParam?id=' + id + '&btn=' + btn,
    method: 'get',
    params: {}
  })
}

export function getPuctionGoods(startTime, eqpId) {
  return request({
    url: '/map/maptraychipmove/getPuctionGoods?startTime=' + startTime + '&eqpId=' + eqpId,
    method: 'get',
    params: {}
  })
}
