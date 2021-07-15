<template>
  <div class="app-container calendar-list-container">
    <w-form v-bind="formConf" :col="3" :model="model">
      <el-input v-model="model.eqpId" label="设备编号" />

      <el-input v-model="model.planType" label="工单类型" />
      <w-select-dic v-model="model.planCycle" label="工单周期" dict="PLAN_CYCLE" />
      <!-- <el-input v-model="model.effectDate" label="生效时间" /> -->
      <el-date-picker
        v-model="model.effectDate"
        :picker-options="option"
        type="datetime"
        placeholder="选择生效时间"
        start=""
        @change="handle"
      />
      <el-input v-model="model.createBy" label="创建人" disabled />
      <el-input v-model="model.createDate" label="创建时间" disabled />
      <el-input v-model="model.remarks" label="备注" col="24" />
    </w-form>
  </div>
</template>

<script>
import dateFormat from '@/utils/dateformat'

export default {
  components: {},
  data() {
    return {
      model: { eqpId: '', planType: '', assignedTime: '', planCycle: '', effectDate: '', remarks: '', createBy: '' },
      formConf: {
        url: 'rw/wodplanday',
        title: {
          ADD: '工单计划添加',
          EDIT: '工单计划修改',
          VIEW: '工单计划详情'
        },
        rules: {
          eqpId: [{ required: true, message: '设备编号必填', trigger: 'blur' }],
          planType: [{ required: true, message: '工单类型必填', trigger: 'blur' }],
          planCycle: [{ required: true, message: '工单周期必选', trigger: 'change' }],
          effectDate: [{ required: true, message: '生效时间必填', trigger: 'blur' }]
        },
        onLoadData: (m, type) => {
          return m
        },
        beforeSubmit: (params, type) => {
          const re = { ...params }
          return re
        }
      },
      option: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000
        }
      }
    }
  },
  mounted() {
    this.model.createBy = this.$store.getters.roles[0]
    this.model.createDate = dateFormat(new Date())
  },
  methods: {
    handle() {
      var startAt = (new Date(this.date) * 1000) / 1000
      if (startAt < Date.now()) {
        this.model.effectDate = new Date()
      }
    }
  }
}
</script>

<style  scoped>
</style>
