<template>
  <w-form v-bind="formConf" :col="3" :model="model">
    <el-input v-model="model.eqpId" label="设备号" />
    <el-input v-model="model.fab" label="厂别" />
    <el-input v-model="model.lineNo" label="线别" />
    <w-select-dept v-model="model.officeIds" label="部门" />
    <el-input v-model="model.bcCode" label="BC号" />
    <el-input v-model="model.ip" label="机台IP地址" />

    <!-- <w-select-device v-model="model.modelId" :display="model.modelName" label="设备型号名称" /> -->
    <w-lookup
      v-model="model.modelId"
      :display.sync="model.modelName"
      idkey="id"
      displaykey="manufacturerName"
      label="设备型号名称"
      title="选择设备型号"
      module="views/fab/eqpmodel/eqpmodelLook"
    />
    <el-input v-model="model.location" label="位置号" />
    <w-select-dic v-model="model.activeFlag" style="width:100%" label="有效标志" dict="ACTIVE_FLAG" />
    <el-input v-model="model.sortCode" label="排序号" />
    <el-input v-model="model.createByName" :disabled="true" label="创建人" />
    <el-input v-model="model.createDate" :disabled="true" label="创建日期" />
    <el-input v-model="model.updateByName" :disabled="true" label="更新人" />
    <el-input v-model="model.updateDate" :disabled="true" label="更新日期" />
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
        url: '/fab/fabequipment/',
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
