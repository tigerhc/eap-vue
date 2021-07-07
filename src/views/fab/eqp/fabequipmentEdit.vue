<template>
  <div class="app-container calendar-list-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="设备修改" name="eqpEdit">
        <w-form
          :title="title"
          :col="3"
          :before-submit="beforeSubmit"
          :rules="rules"
          :on-load-data="onFormLoadData"
          :model="model"
          url="/fab/fabequipment/"
        >
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
          <!-- <el-row col="24" /> -->
          <el-input v-model="model.createByName" :disabled="true" label="创建人" />
          <el-input v-model="model.createDate" :disabled="true" label="创建日期" />
          <el-input v-model="model.locationX" label="纬度坐标" />

          <!-- <el-row col="24" /> -->
          <el-input v-model="model.updateByName" :disabled="true" label="更新人" />
          <el-input v-model="model.updateDate" :disabled="true" label="更新日期" />
          <!-- <el-row col="24" /> -->
          <el-input v-model="model.locationY" label="经度坐标" />
          <w-select-dic v-model="model.isBindCreated" label="是否生成绑定传感器" dict="SFYN" />
        </w-form>
      </el-tab-pane>
      <el-tab-pane label="已绑定传感器" name="bindSorsen">
        <w-edt-table v-slot="{}" ref="language" v-bind="table" url="/fab/fabequipment/AoutAddSensor">
          <w-table-col name="sensorType" label="传感器类型" align="center">
            <!-- <el-input v-model="table.model.sensorType" /> -->
            <w-select-dic v-model="table.model.sensorType" label="是否生成绑定传感器" dict="SFYN" />
          </w-table-col>
          <w-table-col name="sensorNum" label="传感器编号" align="center">
            <el-input v-model="table.model.sensorNum" />
          </w-table-col>
          <w-table-col name="sensorName" label="传感器名称" align="center">
            <el-input v-model="table.model.sensorName" />
          </w-table-col>
        </w-edt-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import request from '@/utils/request'
import dateFormat from '@/utils/dateformat'

export default {
  name: 'MachineModel',
  data() {
    return {
      activeName: 'eqpEdit',
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
        model: {},
        datas: []
      },
      title: {
        ADD: '新增资产',
        EDIT: '修改资产',
        VIEW: '设备详情'
      },
      rules: {
        eqpId: [{ required: true, message: '设备号必填', trigger: 'blur' }],
        modelName: [{ required: true, message: '设备类型必填', trigger: ['blur', 'change'] }],
        activeFlag: [{ required: true, message: '有效标志必选', trigger: 'change' }]
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
    onFormLoadData(m) {
      if (m.officeId) {
        m.officeIds = m.officeId.split(',')
      }
      return m
    },
    beforeSubmit(model) {
      if (model.officeIds) {
        model.officeIds = model.officeIds.join(',')
        model.officeId = model.officeIds
      }
      delete model['edcAmsRptDefineActEmailList']
      const re = { ...model }
      return re
    },
    onDisplayChange(e) {
      this.model.modelName = e
    },
    handleClick() {
      return request({ url: 'fab/fabequipment/SensorList/TEST1', methods: 'get' }).then((res) => {
        console.log(res)
      })
    }
  }
}
</script>
