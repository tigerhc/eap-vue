import request from '@/utils/request'

export default function(url) {
  return {
    ajaxList: (query) => {
      return request({
        url: `${url}/ajaxList`,
        method: `get`,
        params: query
      })
    },
    create: (data) => {
      return request({
        url: `${url}/create`,
        method: `post`,
        data
      })
    },

    update: (data) => {
      return request({
        url: `${url}/` + data.id + `/update`,
        method: `post`,
        data
      })
    },
    detail: (id) => {
      return request({
        url: `${url}/` + id + '/get',
        method: 'get',
        id
      })
    },
    delete: (id) => {
      return request({
        url: `${url}/` + id + `/delete`,
        method: `post`
      })
    },

    get: (id) => {
      return request({
        url: `${url}/` + id + `/get`,
        method: `get`,
        id
      })
    },
    batchDelete: (data) => {
      return request({
        url: `${url}/batch/delete`,
        method: `post`,
        data
      })
    }
  }
}
