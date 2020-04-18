<template>
  <w-form v-bind="formConf" :col="3" :model="model">
    <el-input v-model="model.eqpId" label="设备号" />
    <el-input v-model="model.eqpModelName" label="设备型号" />
    <el-input v-model="model.eqpNo" label="设备序号" />
    <el-row col="24" />
    <el-input v-model="model.dayYield" label="日产量" />
    <el-input v-model="model.lotYield" label="批次产量" />
    <el-row col="24" />
    <el-input v-model="model.eventId" label="事件ID" />
    <el-input v-model="model.alarmCode" label="警报CODE" />
    <el-row col="24" />
    <el-input v-model="model.eventName" label="事件的内容" />
    <el-input v-model="model.eventDetail" label="事件详细信息" col="24"/>
    <el-row col="24" />
    <el-input v-model="model.orderNo" label="作业指示书订单" />
    <el-input v-model="model.lotNo" label="作业指示书批量" />
    <el-input v-model="model.productionNo" label="作业指示书品番" />

    <!-- <w-select-device v-model="model.modelId" :display="model.modelName" label="设备型号名称" /> -->
    <!-- <w-lookup
      v-model="model.modelId"
      :display.sync="model.modelName"
      idkey="id"
      displaykey="manufacturerName"
      label="设备型号名称"
      title="选择设备型号"
      module="views/fab/eqpmodel/eqpmodelLook"
    /> -->

    <el-row col="24" />
    <el-input v-model="model.createBy" :disabled="true" label="操作人" />
    <el-input v-model="model.startTime" :disabled="true" label="发生时刻" />
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
        url: '/dsk/edcdsklogoperation/',
        title: {
          ADD: '新增作业日志记录',
          EDIT: '修改作业日志记录',
          VIEW: '作业日志记录详情'
        },
        rules: {
          eqpId: [{ required: true, message: '设备号必填', trigger: 'blur' }],
          modelName: [{ required: true, message: '设备类型必填', trigger: ['blur', 'change'] }]
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
