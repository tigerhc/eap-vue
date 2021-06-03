import request from '@/utils/request'

export function create(data) {
  return request({
    url: 'fab/fabModeltemplate/createNew',
    method: 'post',
    data
  })
}
