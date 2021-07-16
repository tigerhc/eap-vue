<template>
  <div class="app-container calendar-list-container">
    <w-form v-bind="formConf" :col="3" :model="model">
      <el-input v-model="model.assignedUser" label="指派人" disabled />
      <el-input v-model="model.designee" label="被指派人" />
      <el-date-picker
        v-model="model.assignedTime"
        :picker-options="option"
        type="datetime"
        placeholder="选择指派时间"
        start=""
        label="指派时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        @change="handle"
      />
      <el-input v-model="model.eqpId" label="设备编号" disabled />
      <w-select-dic v-model="model.planType" label="工单类型" dict="PLAN_TYPE" disabled />
      <el-input v-model="model.effectDate" label="生效时间" disabled />
    </w-form>
    <div style="border-top: 1px solid #ddd; padding: 5px 0; margin: 10px 0" />
    <w-table v-bind="table" :params="table.param" url="/rw/rwplanhis">
      <w-table-col name="id" label="工单编号" align="center" />
      <w-table-col name="planId" label="（计划、报警）编号" align="center" />
      <w-table-col name="eqpId" label="设备编号" align="center" />
      <w-table-col name="assignedUser" label="指派人" align="center" />
      <w-table-col name="designee" label="被指派人" align="center" />
      <w-table-col name="assignedTime" label="指派时间" align="center" />
      <w-table-col name="dealTime" label="处理时间" align="center" />
      <w-table-col name="planStatus" label="工单状态" align="center" dict="PLAN_STATUS" />
      <w-table-col name="planType" label="工单类型" align="center" dict="PLAN_TYPE" />
      <w-table-col name="dealAdvice" label="处理意见" align="center" />
      <w-table-col name="dealDesc" label="处理描述" align="center" />
      <w-table-col name="endDate" label="归档时间" align="center" />
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-toolbar name="add" hidden />
      <w-table-toolbar name="clean" hidden />
      <w-table-toolbar name="search" hidden />
      <w-table-toolbar name="exports" hidden />
      <w-table-toolbar name="search" label="刷新" type="primary" icon="el-icon-refresh" />
    </w-table>
  </div>
</template>

<script>
// import x from ''
export default {
  components: {},
  data() {
    return {
      model: { assignedUser: '', designee: '', assignedTime: '', effectDate: '', planType: '', eqpId: '' },
      formConf: {
        url: 'rw/wodplanday',
        title: {
          ADD: '工单制定',
          EDIT: '工单制定',
          VIEW: '工单制定'
        },
        rules: {
          designee: [{ required: true, message: '被指派人必填', trigger: 'blur' }],
          assignedTime: [{ required: true, message: '指派时间必填', trigger: ['blur', 'change'] }]
        },

        option: {
          disabledDate: (time) => {
            return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000
          }
        }
      },
      table: {
        opHide: true,
        params: {
          planId: ''
        },
        datas: []
      }
    }
  },
  mounted() {
    this.model.assignedUser = this.$store.getters.roles[0]
  },
  methods: {
    handle() {
      var startAt = (new Date(this.date) * 1000) / 1000
      if (startAt < Date.now()) {
        this.model.effectDate = new Date()
      }
    },
    onLoadData(m, type) {
      this.table.param = { planId: m.id }
      return m
    },
    beforeSubmit(params, type) {
      const re = { ...params }
      return re
    }
  }
}
</script>

<style  scoped>
</style>
