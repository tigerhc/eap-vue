<template>
  <w-form v-bind="formConf" :col="3" :model="model">
    <el-select v-model="model.classCode" placeholder="设备类型" label="设备类型">
      <el-option v-for="item in options" :key="item.id" :label="item.id" :value="item.id" />
    </el-select>
    <w-select-dic v-model="model.numType" label="示数类型" dict="NUM_TYPE" placeholder="示数类型" />
    <el-input v-model="model.dataType" label="数据类型" />
    <el-input v-model="model.collectionFormula" label="采集方式" />
    <el-input v-model="model.paramUnit" label="计算单位" />
    <el-input v-model="model.delFlag" label="记录删除标志" />
    <el-input v-model="model.createBy" :disabled="true" label="创建人" />
    <el-input v-model="model.createDate" :disabled="true" label="创建日期" />
    <el-input v-model="model.remarks" label="备注" type="textarea" />
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
      model: {
        numType: '',
        classCode: '',
        dataType: '',
        collectionFormula: '',
        paramUnit: '',
        createBy: '',
        createDate: '',
        updateBy: '',
        updateDate: '',
        remarks: '',
        officeIds: [],
        delFlag: 0
      },

      formConf: {
        url: 'fab/fabSensor',
        title: {
          ADD: '新增示数类型',
          EDIT: '修改示数类型',
          VIEW: '设备详情'
        },
        rules: {
          sorId: [{ required: true, message: '设备号必填', trigger: 'blur' }],
          sorName: [{ required: true, message: '设备类型必填', trigger: ['blur', 'change'] }],
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
    this.getEqpModel()
  },
  methods: {
    onDisplayChange(e) {
      this.model.modelName = e
    },
    getEqpModel() {
      return request({
        url: 'fab/fabequipmentmodel/noTemClassCodeList',
        method: 'get'
      }).then((res) => {
        this.options = res.data.results
      })
    }
  }
}
</script>
