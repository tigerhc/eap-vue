import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/sys/role/list',
    method: 'get',
    params: query
  })
}

export function getList(query) {
  return request({
    url: '/fab/role/list',
    method: 'get',
    params: query
  })
}

export function getIotList(query) {
  return request({
    url: '/fab/iotroleeqp/list',
    method: 'get',
    params: query
  })
}

export function fetchUsableRoleList() {
  return request({
    url: '/sys/role/usable/list',
    method: 'get'
  })
}

export function fetchRoleList() {
  return request({
    url: '/fab/role/usable/list',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/sys/role/add',
    method: 'post',
    data
  })
}

export function addRoleEqp(data) {
  return request({
    url: '/fab/role/add',
    method: 'post',
    data
  })
}

export function updateRoleEqp(data) {
  return request({
    url: '/fab/role/' + data.id + '/update',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/sys/role/' + data.id + '/update',
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: '/sys/role/' + id + '/delete',
    method: 'post'
  })
}

export function fetchRoleMenu(roleId) {
  return request({
    url: '/sys/role/' + roleId + '/menu',
    method: 'get'
  })
}

export function setEqp(data) {
  return request({
    url: '/fab/iotroleeqp/create',
    method: 'post',
    data
  })
}

/**
 * 设置权限
 * @param roleId
 */
export function setMenu(data) {
  return request({
    url: '/sys/role/setMenu',
    method: 'post',
    data
  })
}

export function insertByUserId(userid, roleIds) {
  return request({
    url: '/upms/user/role/' + userid + '/insertByUserId',
    method: 'post',
    data: { roleIds }
  })
}

export function deleteByUserId(userid, roleIds) {
  return request({
    url: '/upms/user/role/' + userid + '/deleteByUserId',
    method: 'post',
    data: { roleIds }
  })
}
