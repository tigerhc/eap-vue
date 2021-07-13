<template>
  <w-form v-bind="formConf" :col="3" :model="model">
    <el-input v-model="model.sorId" label="传感器号" />
    <el-input v-model="model.sorNo" label="传感器序号" />
    <el-input v-model="model.sorName" label="传感器名称" />
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
      label="传感器型号名称"
      title="选择传感器型号"
      module="views/fab/eqpmodel/eqpmodelLook"
    />
    <el-input v-model="model.eqpParam" label="参数" />
    <el-input v-model="model.location" label="位置号" />
    <w-select-dic v-model="model.clientFlag" label="客户端标志" dict="ACTIVE_FLAG" />
    <el-input v-model="model.takeTime" label="节拍" />
    <w-select-dic v-model="model.activeFlag" style="width: 100%" label="有效标志" dict="ACTIVE_FLAG" />
    <el-input v-model="model.sortNo" label="排序号" />
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
        sorId: '',
        officeIds: [],
        bcCode: '',
        ip: '',
        modelName: '',
        modelId: '',
        eqpParam: '',
        location: '',
        takeTime: 0,
        clientFlag: '',
        activeFlag: '',
        delFlag: 0,
        officeId: '',
        projectId: '2'
      },

      formConf: {
        url: 'fab/fabSensor',
        title: {
          ADD: '新增传感器',
          EDIT: '修改传感器',
          VIEW: '设备详情'
        },
        rules: {
          sorId: [{ required: true, message: '设备号必填', trigger: 'blur' }],
          sorName: [{ required: true, message: '设备类型必填', trigger: ['blur', 'change'] }],
          activeFlag: [{ required: true, message: '有效标志必选', trigger: 'change' }]
        },
        onLoadData: (m, type) => {
          if (m.officeId) {
            m.officeIds = m.officeId.split(',')
          }
          return m
        },
        beforeSubmit: (model, type) => {
          if (model.officeIds) {
            model.officeIds = model.officeIds.join(',')
            model.officeId = model.officeIds
          }
          delete model['edcAmsRptDefineActEmailList']
          const re = { ...model }
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
