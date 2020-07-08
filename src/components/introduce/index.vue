<template>
  <div v-html="introduce"/>
</template>

<script>
import { fetchHome } from '@/api/sys/project'
export default {
  name: 'Introduce',
  data: function() {
    return {
      key: 'sys.login.leftSystemDesc',
      introduce: undefined
    }
  },
  created() {
    this.getIntroduce()
  },
  methods: {
    getIntroduce() {
      fetchHome(this.key).then(response => {
        this.introduce = response.data
      })
    }
  }
}
</script>
