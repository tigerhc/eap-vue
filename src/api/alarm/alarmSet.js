import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/edc/edcamsdefine/ajaxList',
    method: 'get',
    params: query
  })
}
