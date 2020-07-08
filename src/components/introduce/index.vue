<template>
  <div v-html="introduce"/>
</template>

<script>
import { fetchHome } from '@/api/sys/project'
export default {
  name: 'Introduce',
  data: function() {
    return {
      introduce: undefined
    }
  },
  created() {
    this.getIntroduce()
  },
  methods: {
    getIntroduce() {
      fetchHome('sys.login.leftSystemDesc').then(response => {
        this.introduce = response.data
      })
    }
  }
}
</script>
