<template>
  <w-form v-bind="formConf" :col="3" :model="model">
    <el-input v-model="model.eqpId" label="设备号" />
    <el-input v-model="model.eqpModelName" label="设备型号" />
    <el-input v-model="model.eqpNo" label="设备序号" />
    <el-input v-model="model.orderNo" label="订单号" />
    <el-input v-model="model.productionNo" label="品番机种" />
    <el-input v-model="model.lotNo" label="批号" />
    <el-row col="24" />
    <el-input v-model="model.dayYield" label="日产量" />
    <el-input v-model="model.lotYield" label="批次产量" />
    <el-row col="24" />
    <el-input v-model="model.judgeResult" label="判定结果" />
    <el-row col="24" />
    <el-input v-model="model.duration" label="消耗时间" />
    <el-input v-model="model.startTime" :disabled="true" label="发生时间" />
    <el-input v-model="model.endTime" :disabled="true" label="结束时间" />
    <el-input v-model="model.createBy" :disabled="true" label="操作人" />
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
        url: '/dsk/edcdsklogproduction/',
        title: {
          VIEW: '作业生产记录详情'
        },
        rules: {
          // eqpId: [{ required: true, message: '设备号必填', trigger: 'blur' }],
          // modelName: [{ required: true, message: '设备类型必填', trigger: ['blur', 'change'] }]
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
