<template>
  <w-form v-bind="formConf" :col="3" :model="model">
    <el-input v-model="model.eqpModelName" label="设备型号" />
    <w-select-dic v-model="model.msGetType" style="width:100%" label="取值方式" dict="MS_GET_TYPE" />
    <el-row col="24" />
    <el-input v-model="model.param1" label="参数1" />
    <el-input v-model="model.param2" label="参数2" />
    <el-input v-model="model.param3" label="参数3" />
    <el-input v-model="model.param4" label="参数4" />
    <el-input v-model="model.param5" label="参数5" />
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
  name: 'Mseqpparam',
  data() {
    return {
      model: {
        eqpModelName: '',
        msGetType: ''
      },

      formConf: {
        url: '/ms/mseqpparam/',
        title: {
          ADD: '新增量测设备',
          EDIT: '修改量测设备',
          VIEW: '量测设备详情'
        },
        rules: {
          eqpId: [{ required: true, message: '设备号必填', trigger: 'blur' }],
          modelName: [{ required: true, message: '设备类型必填', trigger: ['blur', 'change'] }],
          activeFlag: [{ required: true, message: '有效标志必选', trigger: 'change' }]
        },
        onLoadData: (m, type) => {
          // console.info(m)
          // m.officeIds = m.officeIds.split(',')
          // return m
        }
        // ,
        // beforeSubmit: (params, type) => {
        //   const re = { ...params }
        //   re.officeId = re.officeIds[re.officeIds.length - 1]
        //   re.officeIds = undefined
        //   return re
        // }
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
