<template>
  <el-select v-bind="$attrs" :value="asyncValue" :multiple="multiple" collapse-tags filterable placeholder="品名" @change="onValueChange">
    <el-option
      v-for="item in data"
      :key="item.id"
      :label="item[valuekey]"
      :value="item[valuekey]">
      <span style="float: left;">{{ item[valuekey] }}</span>&nbsp;&nbsp;
    </el-option>
  </el-select>
</template>

<script>
import api from '../eap-table/fetch'
export default {
  name: 'WSelectLine',
  props: {
    ary: {
      type: Array,
      default: () => []
    },
    str: {
      type: String,
      default: ''
    },
    param: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: '/fab/fabequipment/eqpIdlist'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    namekey: { type: String, default: 'name' },
    valuekey: { type: String, default: 'id' }
  },
  data: function() {
    return {
      data: [{
        name: 'SMA',
        id: 'SMA'
      }, {
        name: 'SX',
        id: 'SX'
      }, {
        name: 'SIM',
        id: 'SIM'
      }, {
        name: '5GI',
        id: '5GI'
      }, {
        name: '6GI',
        id: '6GI'
      }, {
        name: 'APJ',
        id: 'APJ'
      }, {
        name: 'BSG',
        id: 'BSG'
      }],
      list: this.ary,
      str1: this.str
    }
  },
  computed: {
    api: function() {
      return api(this.url + '?param=' + this.param)
    },
    asyncValue: function() {
      if (this.multiple) {
        if (this.list && this.list.length > 0) {
          return this.list
        }
        return this.str === '' ? [] : this.list.split(',')
      } else {
        return this.str1
      }
    }
  },
  methods: {
    onValueChange(e) {
      this.list = e
      this.str1 = e
      this.$emit('input', e)
    }
  }
}
</script>

<style scoped>

</style>
