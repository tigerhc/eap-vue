<template>
  <el-select
    v-bind="$attrs"
    :value="asyncValue"
    :multiple="multiple"
    collapse-tags
    filterable
    placeholder="设备号"
    @change="onValueChange"
  >
    <el-option v-for="item in data" :key="item.id" :label="item.name" :value="item.id">
      <span style="float: left">{{ item.id }}</span>&nbsp;&nbsp;
      <span style="color: #8492a6; font-size: 12px">{{ item.name }}</span>
      <!--<span style="float: left; font-size: 13px">{{ item[valuekey]  }}</span>-->
      <!--<span style="float: right; color: #8492a6; font-size: 13px">{{ item[namekey] }}</span>-->
    </el-option>
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
    param: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: '/fab/fabequipment/eqpIdlist'
      // default: 'edc/edceqpstate/selectEqpList'
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
      list: this.ary,
      str1: this.str
    }
  },
  computed: {
    api: function() {
      return api(this.url + '?param=' + this.param) // this.param
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
  mounted() {
    this.api.anylist({ 'page.size': 99999 }).then(
      (resp) => {
        this.data = (resp && resp.results) || []
        // this.data = resp.id
      },
      (e) => {}
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
      this.str1 = e
      this.$emit('input', e)
    }
  }
}
</script>
