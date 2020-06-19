<template>
  <el-select v-bind="$attrs" :value="asyncValue" :multiple="multiple" filterable placeholder="请选择" @change="onValueChange">
    <el-option
      v-for="item in data"
      :key="item.id"
      :label="item[namekey]"
      :value="item[valuekey]"/>
  </el-select>
</template>

<script>
import api from '../eap-table/fetch'
export default {
  name: 'WSelectEqp',
  props: {
    ary: {
      type: Array,
      default: () => []
    },
    str: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: '/fab/fabequipment/eqpIdlist'
    },
    multiple: {
      type: Boolean,
      default: true
    },
    namekey: { type: String, default: 'name' },
    valuekey: { type: String, default: 'id' }
  },
  data: function() {
    return {
      data: [],
      list: this.ary
    }
  },
  computed: {
    api: function() {
      return api(this.url)
    },
    asyncValue: function() {
      if (this.multiple) {
        if (this.list && this.list.length > 0) {
          return this.list
        }
        return this.str === '' ? [] : this.list.split(',')
      } else {
        return this.str
      }
    }
  },
  mounted() {
    this.api.anylist({ 'page.size': 99999 }).then(
      (resp) => {
        this.data = (resp && resp.results) || []
      },
      (e) => {
      }
    )
    // fetchEqpList()
    //   .then((response) => {
    //     // debugger
    //     this.options = response.data.results
    //   })
    //   .finally(() => {
    //
    //   })
  },
  methods: {
    onValueChange(e) {
      this.list = e
      this.$emit('input', e)
    }
  }
}
</script>

<style scoped>

</style>
