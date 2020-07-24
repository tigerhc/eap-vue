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
    },
    second: {
      type: Number,
      default: 0
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
      if (this.second !== 0) {
        setTimeout(() => {
          this.getIntroduce()
        }, this.second)
      }
    }
  }
}
</script>
