<template>
  <w-form v-bind="formConf" :col="3" :model="model">
    <el-input v-model="model.productionNo" label="品番" />
    <el-input v-model="model.productionName" label="品名" />
    <el-input v-model="model.planDate" label="投入日期" />
    <el-input v-model="model.lotQty" label="批次数量" />
    <el-input v-model="model.planQty" label="投入数" />
    <el-row col="24" />
    <el-input v-model="model.createByName" :disabled="true" label="创建人" />
    <el-input v-model="model.createDate" :disabled="true" label="创建日期" />
    <el-row col="24" />
    <el-input v-model="model.updateByName" :disabled="true" label="更新人" />
    <el-input v-model="model.updateDate" :disabled="true" label="更新日期" />
  </w-form>
</template>
<script>
export default {
  name: 'ApsplanpdtyieldEdit',
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
        url: '/fab/fabequipment/',
        title: {
          ADD: '新增生产计划',
          EDIT: '修改生产计划',
          VIEW: '生产计划详情'
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
