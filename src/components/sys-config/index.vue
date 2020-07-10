<template>
  <div v-html="content"/>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'SysConfig',
  props: {
    config_key: {
      type: String,
      default: null
    }
  },
  data: function() {
    return {
      content: undefined
    }
  },
  created() {
    this.getIntroduce()
  },
  methods: {
    getIntroduce() {
      request({
        url: '/sys/sysconfig/' + this.config_key + '/getByKey',
        method: 'get'
      }).then(response => {
        this.content = response.data
      })
      setTimeout(() => {
        this.getIntroduce()
      }, 5000)
    }
  }
}
</script>
