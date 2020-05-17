<template>
  <el-select :value="value" :disabled="disabled" multiple placeholder="请选择" @change="onValueChange">
    <el-option
      v-for="item in options"
      :key="item"
      :label="item"
      :value="item"/>
  </el-select>
</template>

<script>
import { fetchEqpList } from '@/api/dashboard/dashboard'
export default {
  name: 'WSelectEqp',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      options: []
    }
  },
  computed: {},
  watch: {
    value: function(v, o) {}
  },
  mounted() {
    fetchEqpList()
      .then((response) => {
        this.options = response.data
      })
      .finally(() => {

      })
  },
  methods: {
    onValueChange(e) {
      this.$emit('onValueChange', e)
    }
  }
}
</script>

<style scoped>

</style>
