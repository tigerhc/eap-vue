import request from '@/utils/request'

export function fetchGetChart() {
  return request({
    url: '/sys/menu/chart',
    method: 'get'
  })
}
export function fetchDataList(query) {
  return request({
    url: '/fab/fabequipmentstatus/ajaxList',
    method: 'get',
    params: query
  })
}
