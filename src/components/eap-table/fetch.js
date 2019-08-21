import r from '@/utils/request'
import Vue from 'vue'

const request = (p) => {
  return r(p).then((resp) => {
    if (resp.data) {
      if (resp.data.code === 0) {
        return resp.data
      } else {
        new Vue().$notify({
          showClose: true,
          message: resp.data.msg,
          type: 'error',
          duration: 2000
        })
      }
    } else {
      //
      console.warn('network error')
    }
  })
}

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
        url: `${url}/` + id + '/find',
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
    },
    export: (query) => {
      return request({
        url: `${url}/export`,
        method: 'get',
        params: query
      })
    }
  }
}
