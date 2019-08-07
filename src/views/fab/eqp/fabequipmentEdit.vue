<template>
  <eap-form v-bind="formConf" :col="3" :model="model">
    <el-input v-model="model.eqpId" label="设备号" />
    <eap-select-dept v-model="model.officeIds" label="部门" />
    <el-input v-model="model.bcCode" label="BC号" />
    <el-input v-model="model.ip" label="机台IP地址" />
    <eap-select-device v-model="model.modelName" label="设备型号名称" />
    <el-input v-model="model.location" label="位置号" />
    <eap-select-dic v-model="model.activeFlag" style="width:100%" label="有效标志" dict="ACTIVE_FLAG" />
  </eap-form>
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
  }
}
</script>
