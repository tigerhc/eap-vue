<template>
  <w-form v-bind="formConf" :col="3" :model="model">
    <el-select v-model="model.modelId" placeholder="请选择" label="设备型号">
      <el-option v-for="item in options" :key="item.id" :label="item.id" :value="item.id" />
    </el-select>
    <el-select v-model="model.subEqpId" placeholder="请选择" label="设备号">
      <el-option v-for="item in options1" :key="item.id" :label="item.id" :value="item.id" />
    </el-select>
    <el-input v-model="model.paramsCode" label="参数CODE" />
    <el-input v-model="model.paramsName" label="参数名称" />
    <el-input v-model="model.paramsUnit" label="计量单位" />
    <el-input v-model="model.defValue" label="设定值" />
    <el-input v-model="model.maxValue" label="最大值" />
    <el-input v-model="model.minValue" label="最小值" />
    <el-input v-model="model.remarks" type="textarea" label="备注" />
    <el-input v-model="model.createBy" :disabled="true" label="创建人" />
    <el-input v-model="model.createDate" :disabled="true" label="创建日期" />
    <el-input v-model="model.updateBy" :disabled="true" label="更新人" />
    <el-input v-model="model.updateDate" :disabled="true" label="更新日期" />
  </w-form>
</template>
<script>
import dateFormat from '@/utils/dateformat'
import request from '@/utils/request'
export default {
  name: 'MachineModel',
  data() {
    return {
      options: [],
      options1: [],
      model: {
        createBy: '',
        createDate: '',
        updateBy: '',
        updateDate: '',
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
          console.info(m)
          if (m.officeIds) {
            m.officeIdsm.officeIds
          }
          return m
        },
        beforeSubmit: (params, type) => {
          const re = { ...params }
          if (re.officeId) {
            re.officeId = re.officeIds[re.officeIds.length - 1]
            re.officeIds = undefined
          }
          return re
        }
      }
    }
  },
  mounted() {
    this.model.updateBy = this.$store.getters.roles[0]
    this.model.createBy = this.$store.getters.roles[0]
    this.model.createDate = dateFormat(new Date())
    this.model.updateDate = dateFormat(new Date())
    this.getmodelId()
    this.getsubEqpId()
  },
  methods: {
    onDisplayChange(e) {
      this.model.modelName = e
    },
    getmodelId() {
      return request({
        url: 'fab/fabequipmentmodel/classCodeList',
        methods: 'get'
      }).then((res) => {
        this.options = res.data.results
      })
    },
    getsubEqpId() {
      return request({
        url: 'fab/fabequipment/eqpIdlist',
        methods: 'get'
      }).then((res) => {
        this.options1 = res.data.results
      })
    }
  }
}
</script>
