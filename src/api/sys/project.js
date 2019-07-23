import request from '@/utils/request'

export function fetchProList(query) {
  return request({
    url: '/sysProject/projects',
    method: 'get',
    params: query
  })
}

export function fetchList(query) {
  return request({
    url: '/sysProject/ajaxList',
    method: 'get',
    params: query
  })
}

export function addProject(data) {
  return request({
    url: '/sysProject/create',
    method: 'post',
    data
  })
}

export function updateProject(data) {
  return request({
    url: '/sysProject/' + data.id + '/update',
    method: 'post',
    data
  })
}

export function deleteProject(id) {
  return request({
    url: '/sysProject/' + id + '/delete',
    method: 'post'
  })
}

export function fetchHome() {
  return request({
    url: '/sys/sysconfig/sys.protal.url/getByKey',
    method: 'get'
  })
}

export function getProject(id) {
  return request({
    url: '/sysProject/' + id + '/getProject',
    method: 'post'
  })
}
