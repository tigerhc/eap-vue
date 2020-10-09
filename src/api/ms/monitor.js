import request from '@/utils/request'
export function weightChart(query) {
  return request({
    url: '/ms/msmeasurerecord/weightChart',
    method: 'get',
    params: query
  })
}
