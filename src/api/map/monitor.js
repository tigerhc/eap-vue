import request from '@/utils/request'

export function getModels() {
  return request({
    url: '/map/maptraytype/getModelsBySelect',
    method: 'get',
    params: {}
  })
}
