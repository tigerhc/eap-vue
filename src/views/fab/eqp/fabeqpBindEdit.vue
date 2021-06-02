<template>
  <w-form v-bind="formConf" :col="3" :model="model">
    <!-- <el-input v-model="model.eqpId" label="传感器编号" /> -->
    <!-- <w-select-dic v-model="model.eqpId" style="width: 100%" label="传感器编号" dict /> -->
    <el-select v-model="model.eqpId" placeholder="请选择" label="传感器编号">
      <el-option v-for="item in options" :key="item.id" :label="item.id" :value="item.id" />
    </el-select>
    <el-input v-model="model.classCode" label="子设备类型" />
    <el-input v-model="model.name" label="模板名称" />
    <el-input v-model="model.officeId" label="部门名称" />
    <el-input v-model="model.createBy" :disabled="true" label="创建人" />
    <el-input v-model="model.createDate" :disabled="true" label="创建日期" />
    <el-input v-model="model.remarks" type="textarea" label="备注" />
    <el-input v-model="model.updateBy" :disabled="true" label="更新人" />
    <el-input v-model="model.updateDate" :disabled="true" label="更新日期" />
  </w-form>
</template>
<script>
import dateFormat from '@/utils/dateformat'
import request from '@/utils/request'
export default {
  name: 'MachineModel',
  data() {
    return {
      options: '',
      model: {
        eqpId: '',
        officeIds: [],
        bcCode: '',
        ip: '',
        modelName: '',
        modelId: '',
        eqpParam: '',
        location: '',
        takeTime: 0,
        clientFlag: '',
        activeFlag: '',
        delFlag: 0,
        officeId: '',
        projectId: '2',
        updateBy: '',
        createBy: '',
        createDate: '',
        updateDate: '',
        classCode: ''
      },

      formConf: {
        url: '/fab/fabequipment/',
        title: {
          ADD: '新增设备',
          EDIT: '修改设备',
          VIEW: '设备详情'
        },
        rules: {},
        onLoadData: (m, type) => {
          console.info(m)
          if (m.officeIds) {
            m.officeIdsm.officeIds
          }
          return m
        },
        beforeSubmit: (params, type) => {
          const re = { ...params }
          if (re.officeId) {
            re.officeId = re.officeIds[re.officeIds.length - 1]
            re.officeIds = undefined
          }
          return re
        }
      }
    }
  },
  mounted() {
    this.model.updateBy = this.$store.getters.roles[0]
    this.model.createBy = this.$store.getters.roles[0]
    this.model.createDate = dateFormat(new Date())
    this.model.updateDate = dateFormat(new Date())
  },
  methods: {
    onDisplayChange(e) {
      this.model.modelName = e
    },
    getSorsenNum() {
      const query = this.model.classCode
      return request({
        url: `fab/fabSensor/sorIdlist/${query}`,
        methods: 'get'
      }).then((res) => {
        this.options = res.data.results
        console.log(res)
      })
    }
  }
}
</script>
