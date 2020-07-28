import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/edc/edcamsdefine/ajaxList',
    method: 'get',
    params: query
  })
}

export function addDevice(data) {
  return request({
    url: '/edc/edcamsdefine/create',
    method: 'post',
    data
  })
}

export function fetchEnable(alarmId, flag) {
  return request({
    url: '/edc/edcamsdefine/active_flag/' + alarmId + '/' + flag,
    method: 'put'
  })
}

export function fetchDeteils(id) {
  return request({
    url: '/edc/edcamsdefine/' + id + '/find',
    method: 'get',
    id
  })
}

export function update(data) {
  return request({
    url: '/edc/edcamsdefine/' + data.id + '/update',
    method: 'post',
    data
  })
}

export function deleteList(id) {
  return request({
    url: '/edc/edcamsdefine/' + id + '/delete',
    method: 'post'
  })
}
