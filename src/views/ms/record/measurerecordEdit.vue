<template>
  <w-form v-bind="formConf" :col="3" :model="model">
    <el-input v-model="model.recordId" label="流水号" />
    <el-input v-model="model.eqpId" label="设备号" />
    <el-input v-model="model.lotNo" label="批号" />
    <el-input v-model="model.waferId" label="晶圆ID" />
    <el-input v-model="model.timing" label="时机" />
    <w-select-dept v-model="model.sampleCount" label="采样数" />
    <el-input v-model="model.status" label="状态" />
    <el-input v-model="model.approveResult" label="判定结果" />
    <el-row col="24" />
    <el-input v-model="model.createByName" :disabled="true" label="创建人" />
    <el-input v-model="model.createDate" :disabled="true" label="创建日期" />
  </w-form>
</template>
<script>
export default {
  name: 'MachineModel',
  data() {
    return {
      model: {
        eqpId: '',
        officeIds: [],
        bcCode: '',
        ip: '',
        modelName: '',
        modelId: '',
        location: '',
        activeFlag: '',
        delFlag: 0,
        officeId: '',
        projectId: '2'
      },

      formConf: {
        url: '/ms/msmeasurerecord/',
        title: {
          ADD: '新增设备',
          EDIT: '修改设备',
          VIEW: '设备详情'
        },
        rules: {
          eqpId: [{ required: true, message: '设备号必填', trigger: 'blur' }],
          modelName: [{ required: true, message: '设备类型必填', trigger: ['blur', 'change'] }],
          activeFlag: [{ required: true, message: '有效标志必选', trigger: 'change' }]
        },
        onLoadData: (m, type) => {
          console.info(m)
          m.officeIds = m.officeIds.split(',')
          return m
        },
        beforeSubmit: (params, type) => {
          const re = { ...params }
          re.officeId = re.officeIds[re.officeIds.length - 1]
          re.officeIds = undefined
          return re
        }
      }
    }
  },
  methods: {
    onDisplayChange(e) {
      this.model.modelName = e
    }
  }
}
</script>
