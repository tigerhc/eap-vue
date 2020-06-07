<template>
  <w-form v-bind="formConf" :col="3" :model="model">
    <el-input v-model="model.eqpModelName" label="设备型号" />
    <el-input v-model="model.productionNo" label="机种" />
    <el-input v-model="model.timing" label="时机" />
    <el-input v-model="model.status" label="状态" />
    <el-input v-model="model.sampleCount" label="采样数" />
    <el-input v-model="model.fileFlag" label="采样文件" />
    <el-input v-model="model.imgFlag" label="采样图片" />
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
  name: 'MachineModel',
  data() {
    return {
      model: {
        eqpModelName: '',
        productionNo: '',
        timing: '',
        status: '',
        sampleCount: '',
        fileFlag: '',
        imgFlag: '',
        createByName: '',
        createDate: '',
        updateByName: '',
        updateDate: ''
      },

      formConf: {
        url: '/ms/msmeasureconfig/',
        title: {
          ADD: '新增配置',
          EDIT: '修改配置',
          VIEW: '配置详情'
        },
        rules: {
          eqpModelName: [{ required: true, message: '设备类型必填', trigger: 'blur' }],
          productionNo: [{ required: true, message: '机种必填', trigger: ['blur', 'change'] }]
        },
        onLoadData: (m, type) => {
        },
        beforeSubmit: (params, type) => {
        }
      }
    }
  },
  methods: {
  }
}
</script>
