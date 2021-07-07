<template>
  <div class="app-container calendar-list-container">
    <w-form v-bind="formConf" :col="3" :model="model">
      <el-input v-model="model.eqpId" label="设备号" />
      <el-input v-model="model.eqpNo" label="设备序号" />
      <el-input v-model="model.eqpName" label="设备说明" />
      <el-input v-model="model.fab" label="厂别" />
      <el-input v-model="model.lineNo" label="线别" />
      <w-select-dept v-model="model.officeIds" label="部门" />
      <el-input v-model="model.bcCode" label="BC号" />
      <el-input v-model="model.ip" label="机台IP地址" />

      <w-lookup
        v-model="model.modelId"
        :display.sync="model.modelName"
        idkey="id"
        displaykey="classCode"
        label="设备型号名称"
        title="选择设备型号"
        module="views/fab/eqpmodel/eqpmodelLook"
      />
      <el-input v-model="model.eqpParam" label="参数" />
      <el-input v-model="model.location" label="位置号" />
      <w-select-dic v-model="model.clientFlag" label="客户端标志" dict="ACTIVE_FLAG" />
      <el-input v-model="model.takeTime" label="节拍" />
      <w-select-dic v-model="model.activeFlag" style="width: 100%" label="有效标志" dict="ACTIVE_FLAG" />
      <el-input v-model="model.sortNo" label="排序号" />
      <el-input v-model="model.createByName" :disabled="true" label="创建人" />
      <el-input v-model="model.createDate" :disabled="true" label="创建日期" />
      <el-input v-model="model.locationX" label="纬度坐标" />
      <el-input v-model="model.updateByName" :disabled="true" label="更新人" />
      <el-input v-model="model.updateDate" :disabled="true" label="更新日期" />
      <el-input v-model="model.locationY" label="经度坐标" />
      <w-select-dic v-model="model.isBindCreated" label="是否生成绑定传感器" dict="SFYN" />
    </w-form>
  </div>
</template>
<script>
// import request from '@/utils/request'
import dateFormat from '@/utils/dateformat'

export default {
  name: 'MachineModel',
  data() {
    return {
      model: {
        isBindCreated: '',
        updateDate: '',
        updateByName: '',
        createByName: '',
        createDate: '',
        eqpName: '',
        location_x: '',
        location_y: '',
        eqpId: '',
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
      table: {
        model: {
          sensorType: '',
          sensorName: '',
          sensorNum: ''
        },
        datas: []
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
          if (m.officeId) {
            m.officeIds = m.officeId.split(',')
          }
          return m
        },
        beforeSubmit: (params, type) => {
          if (params.isBindCreated === 'Y') {
            if (!params.modelId) {
              return this.$notify({
                title: '失败',
                message: '如果要自动生成传感器，请确保设备型号名称不能为空！！！',
                type: 'error',
                duration: 2000
              })
            }
          }
          if (params.officeIds) {
            params.officeIds = params.officeIds.join(',')
            params.officeId = params.officeIds
          }
          delete params['edcAmsRptDefineActEmailList']
          const re = { ...params }
          return re
        }
      }
    }
  },
  mounted() {
    this.model.updateByName = this.$store.getters.roles[0]
    this.model.createByName = this.$store.getters.roles[0]
    this.model.createDate = dateFormat(new Date())
    this.model.updateDate = dateFormat(new Date())
  },
  methods: {
    onDisplayChange(e) {
      this.model.modelName = e
    }
  }
}
</script>
