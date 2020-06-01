<template>
  <el-select :value="value" :disabled="disabled" multiple filterable placeholder="请选择" @change="onValueChange">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.id"
      :value="item.id"/>
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
        // debugger
        this.options = response.data.results
      })
      .finally(() => {

      })
  },
  methods: {
    onValueChange(e) {
      this.$emit('onValueChange', e)
      this.$emit('input', e)
    }
  }
}
</script>

<style scoped>

</style>
