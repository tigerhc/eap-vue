<template>
  <w-form v-bind="formConf" :col="3" :model="model">
    <el-input v-model="model.trayModel" align="center" label="托盘编号" />
    <el-input v-model="model.trayRow" label="托盘行数" />
    <el-input v-model="model.trayCol" label="托盘列数" />
    <w-select-dic v-model="model.trayType" style="width:100%" label="类型" dict="TRAY_TYPE" />
    <el-input v-model="model.remarks" col="24" label="描述" />
    <el-input v-model="model.createByName" :disabled="true" label="创建人" />
    <el-input v-model="model.createDate" :disabled="true" label="创建日期" />
    <el-row col="24" />
    <el-input v-model="model.updateByName" :disabled="true" label="更新人" />
    <el-input v-model="model.updateDate" :disabled="true" label="更新日期" />
  </w-form>
</template>
<script>
export default {
  name: 'TraytypeEdit',
  data() {
    return {
      model: {
        trayType: '',
        trayId: '',
        trayRow: '',
        trayCol: '',
        remarks: '',
        status: '',
        startTime: '',
        sortNo: 1
      },

      formConf: {
        url: '/map/maptraytype/',
        title: {
          ADD: '新增功能',
          EDIT: '修改功能',
          VIEW: '功能详情'
        },
        rules: {
          trayId: [{ required: true, message: '托盘编号必填', trigger: 'change' }],
          trayRow: [{ required: true, message: '托盘行数必填', trigger: 'change' }],
          trayCol: [{ required: true, message: '托盘列数必填', trigger: 'change' }],
          status: [{ required: true, message: '有效标志必选', trigger: 'change' }]
        }
      }
    }
  }
}
</script>
