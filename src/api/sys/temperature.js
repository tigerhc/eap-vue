import request from '@/utils/request'

export function fetchList(tab, query) {
  return request({
    url: '/oven/ovnbatchlot/ajaxList',
    method: 'get',
    params: query
  })
}

export function fetchEcharts(id) {
  return request({
    url: '/oven/ovnbatchlot/' + id + '/get',
    method: 'get',
    id
  })
}
