<template>
  <w-form v-bind="formConf" :col="3" :model="model">
    <el-input v-model="model.fctType" align="center" label="功能类型" />
    <el-input v-model="model.fctCode" label="功能代码" />
    <el-input v-model="model.fctDesc" label="功能描述" />
    <w-select-dic v-model="model.activeFlag" style="width:100%" label="有效标志" dict="ACTIVE_FLAG" />
    <el-input v-model="model.updateByName" :disabled="true" label="更新人" />
    <el-input v-model="model.updateDate" :disabled="true" label="更新日期" />
  </w-form>
</template>
<script>
export default {
  name: 'SysFunctionEdit',
  data() {
    return {
      model: {
        fctType: '',
        fctCode: '',
        fctDesc: '',
        activeFlag: ''
      },

      formConf: {
        url: '/core/sysfunction/',
        title: {
          ADD: '新增功能',
          EDIT: '修改功能',
          VIEW: '功能详情'
        },
        rules: {
          activeFlag: [{ required: true, message: '有效标志必选', trigger: 'change' }]
        },
        onLoadData: (m, type) => {
          console.info(m)
          return m
        },
        beforeSubmit: (params, type) => {
          const re = { ...params }
          return re
        }
      }
    }
  }
}
</script>
