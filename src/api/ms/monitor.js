import request from '@/utils/request'
export function weightChart(query) {
  return request({
    url: '/ms/msmeasurerecord/weightChart',
    method: 'get',
    params: query
  })
}

export function kongdongChart(query) {
  return request({
    url: '/mes/meslottrack/chartKongDong',
    method: 'get',
    params: query
  })
}

export function kongdongBar(query) {
  return request({
    url: '/mes/meslottrack/kongDongBar',
    method: 'get',
    params: query
  })
}
