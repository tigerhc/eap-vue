import request from '@/utils/request'

export function fetchUserRoleIds(userid) {
  return request({
    url: '/sys/user/role/' + userid + '/roleIds',
    method: 'get'
  })
}

export function fetchRoleIds(userid) {
  return request({
    url: '/fab/iotUserRole/ ' + userid + '/roleIds',
    method: 'get'
  })
}

export function insertUserId(userid, roleIds) {
  return request({
    url: '/fab/iotUserRole/' + userid + '/insertByUserId',
    method: 'post',
    data: { roleIds }
  })
}

export function deleteUserId(userid, roleIds) {
  return request({
    url: '/fab/iotUserRole/' + userid + '/deleteByUserId',
    method: 'post',
    data: { roleIds }
  })
}

export function insertByUserId(userid, roleIds) {
  return request({
    url: '/sys/user/role/' + userid + '/insertByUserId',
    method: 'post',
    data: { roleIds }
  })
}

export function deleteByUserId(userid, roleIds) {
  return request({
    url: '/sys/user/role/' + userid + '/deleteByUserId',
    method: 'post',
    data: { roleIds }
  })
}
