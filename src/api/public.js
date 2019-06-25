import request from '@/utils/request'

export function fetchList(tab, query) {
  return request({
    url: tab + 'ajaxList',
    method: 'get',
    params: query
  })
}

export function create(tab, data) {
  return request({
    url: tab + 'create',
    method: 'post',
    data
  })
}

export function update(tab, data) {
  return request({
    url: tab + data.id + '/update',
    method: 'post',
    data
  })
}

export function del(tab, id) {
  return request({
    url: tab + id + '/delete',
    method: 'post'
  })
}

export function deteils(tab, id) {
  return request({
    url: tab + id + '/get',
    method: 'get',
    id
  })
}

export function batchDelete(tab, data) {
  return request({
    url: tab + 'batch/delete',
    method: 'post',
    data
  })
}

export function fetchEcharts(id) {
  return request({
    url: '/oven/ovnbatchlot/' + id + '/get',
    method: 'get',
    id
  })
}

export function fetchDict(dictcode) {
  return request({
    url: '/sys/dict/' + dictcode + '/finddict',
    method: 'get',
    dictcode
  })
}

export function exportLoginLog(tab, query) {
  return request({
    url: tab + 'export',
    method: 'get',
    params: query
  })
}
