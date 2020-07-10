<template>
  <div v-html="content"/>
</template>

<script>
import { fetchHome } from '@/api/sys/project'
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
      fetchHome(this.config_key).then(response => {
        this.content = response.data
      })
    }
  }
}
</script>
