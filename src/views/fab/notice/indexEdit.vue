<template>
    <w-form v-bind="formConf" :col="3" :model="model">
      <el-input v-model="model.subject" align="center" label="标题" />
      <el-input v-model="model.content" label="内容" />
      <el-input v-model="model.createBy" label="更新人" />
      <w-select-dic v-model="model.status" style="width:100%" label="有效标志" dict="ACTIVE_FLAG" />
<!--      <el-input v-model="model.updateByName" :disabled="true" label="更新人" />-->
<!--      <el-input v-model="model.updateDate" label="更新日期" />-->
    </w-form>
<!--  <div>2344444444444444444</div>-->
</template>

<script>
export default {
  name: 'SysFunctionEdit',
  data() {
    return {
      model: {
        subject: '',
        content: '',
        createBy: '',
        status: ''
      },

      formConf: {
        url: '/oa/oanotification/',
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

<style scoped>

</style>
