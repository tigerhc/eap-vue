import request from '@/utils/request'
export function weightChart(query) {
  return request({
    url: '/ms/msmeasurerecord/weightChart',
    method: 'get',
    params: query
  })
}
// mes/meslottrack/chartKongDong
export function kongdongChart(query) {
  return request({
    url: '/ms/msmeasurekongdong/kongdongChart',
    method: 'get',
    params: query
  })
}
// /mes/meslottrack/kongDongBar
export function kongdongBar(query) {
  return request({
    url: 'ms/msmeasurekongdong/kongDongBar',
    method: 'get',
    params: query
  })
}

export function proNameSelect(query) {
  return request({
    url: '/mes/meslottrack/getAllProName',
    method: 'get',
    params: query
  })
}

export function productionNoSelect(query) {
  return request({
    url: '/ms/msmeasurerecord/getAllProductionNo',
    method: 'get',
    params: query
  })
}

export function positionSelect(query) {
  return request({
    url: '/ms/msmeasurekongdong/getPositionSelect',
    method: 'get',
    params: query
  })
}

export function findSxNumber(query) {
  return request({
    url: '/ms/measuresx/findSxNumber',
    method: 'get',
    params: query
  })
}

export function findDustCount(query) {
  return request({
    url: '/edc/edcparticle/echartData',
    method: 'get',
    params: query
  })
}

export function findDustEqps() {
  return request({
    url: '/edc/edcparticle/getParticleEqps',
    method: 'get'
  })
}
