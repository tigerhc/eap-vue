<template>
  <div class="app-container calendar-list-container">
    <div class="eqp-btn-container">
      <el-button type="primary" @click="initEqp">初始化所有设备</el-button>
    </div>
    <w-edt-table v-slot="{row}" ref="eqpTable" v-bind="table" :limit="200" url="/map/mapeqpconfig">
      <!--todo fixed属性导致当前列变为第一列-->
      <w-table-col name="eqpId" label="上游设备号" width="200" align="left"/>
      <w-table-col
        :formatter="eqpTypeFormatter"
        name="eqpType"
        label="上游设备类型"
        width="150"
        align="left"
      >
        <el-select v-model="table.model.eqpType" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </w-table-col>
      <w-table-col name="downEqpId" label="下游设备号" width="200" align="left">
        <w-select-eqp v-model="table.model.downEqpId" :multiple="false" />
      </w-table-col>
    </w-edt-table>
  </div>
</template>
<style lang="scss" scoped>
.eqp-btn-container {
  padding-bottom: 10px;
  float: right;
}
</style>
<script>
import request from '@/utils/request'
export default {
  name: 'MapEqpConfigList',
  data() {
    return {
      table: {
        model: {
          eqpId: '',
          eqpType: 0,
          downEqpId: ''
        },
        rules: {
          eqpType: [{ required: true, message: '上游设备类型必填', trigger: 'blur' }]
        }
      },
      options: [
        {
          value: 0,
          label: '普通'
        },
        {
          value: 1,
          label: '开始'
        },
        {
          value: 2,
          label: '报告'
        },
        {
          value: 3,
          label: '打码'
        }
      ]
    }
  },
  methods: {
    eqpTypeFormatter(val) {
      const obj = this.options.find((itm) => itm.value === val)
      if (obj) {
        return obj.label
      } else {
        return val
      }
    },
    initEqp() {
      request({
        url: '/map/mapeqpconfig/initAll',
        method: 'post'
      }).then((resp) => {
        if (resp.data.code === 0) {
          this.$notify({
            title: '成功',
            message: '初始化成功',
            type: 'success',
            duration: 1500
          })
          this.$refs['eqpTable'].refresh()
        } else {
          this.$notify({
            title: '失败',
            message: '初始化失败',
            type: 'error',
            duration: 1500
          })
        }
      })
    }
  }
}
</script>
