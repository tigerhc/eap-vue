import request from '@/utils/request'

export function fetchDictList(query) {
  return request({
    url: '/sys/dict/list',
    method: 'get',
    params: query
  })
}

export function fetchDict(query) {
  return request({
    url: `/sys/dict/${query}/finddict`,
    method: 'get',
    paramas: query
  })
}

export function createDict(data) {
  return request({
    url: '/sys/dict/add',
    method: 'post',
    data
  })
}

export function updateDict(data) {
  return request({
    url: '/sys/dict/' + data.id + '/update',
    method: 'post',
    data
  })
}

export function deleteDict(id) {
  return request({
    url: '/sys/dict/' + id + '/delete',
    method: 'post'
  })
}

/**
 * 获取所有字典数据
 */
export function fetchDicts() {
  return request({
    url: '/sys/dict',
    method: 'get'
  })
}
