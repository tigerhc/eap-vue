<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{ row }" v-bind="table" url="rw/rwplan">
      <w-table-col name="id" label="工单号" align="left" query condition="eq" />
      <w-table-col name="planId" label="（计划、报警）编号" align="left" />
      <w-table-col name="eqpId" label="设备编号" align="left" query querymode="select" condition="eq" />
      <w-table-col name="assignedUser" label="指派人" align="left" />
      <w-table-col name="designee" label="被指派人" align="left" />
      <w-table-col name="assignedTime" label="指派时间" align="left" query querymode="date" condition="between" />
      <w-table-col name="dealTime" label="处理时间" align="left" query querymode="date" condition="between" />
      <w-table-col
        name="planStatus"
        label="工单状态"
        align="left"
        query
        querymode="select"
        dict="PLAN_STATUS"
        condition="eq"
      />
      <w-table-col
        name="planType"
        label="工单类型"
        align="left"
        query
        querymode="select"
        dict="PLAN_TYPE"
        condition="eq"
      />
      <w-table-col name="dealAdvice" label="处理意见" align="left" />
      <w-table-col name="dealDesc" label="处理描述" align="left" />
      <w-table-col name="endDate" label="归档时间" align="left" />
      <w-table-button
        :hidden="row.planStatus != '1'"
        name="dispatch"
        icon="el-icon-document"
        label="派单"
        type="primary"
      />
      <w-table-button
        :hidden="row.planStatus != '2'"
        name="receiveOrders"
        icon="el-icon-document-checked"
        label="接单"
        type="primary"
      />
      <w-table-button
        :hidden="row.planStatus != '3'"
        name="endReport"
        icon="el-icon-document-delete"
        label="结束上报"
        type="primary"
      />
      <w-table-button
        :hidden="row.planStatus != '4'"
        name="endOrders"
        icon="el-icon-document-delete"
        label="结束工单"
        type="primary"
      />
      <w-table-button name="edit" hidden />
      <w-table-button name="delete" hidden />
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-toolbar name="add" hidden />
      <w-table-toolbar name="clean" hidden />
    </w-table>
    <div>
      <!-- 派单 -->
      <el-dialog :visible.sync="dispatchDialogVisible" title="派单" width="30%">
        <el-form ref="dispatchForm" :model="dispatchForm" label-width="80px">
          <el-form-item label="工单号">
            <el-input v-model="dispatchForm.id" />
          </el-form-item>
          <el-form-item label="指派人">
            <el-input v-model="dispatchForm.assignedUser" />
          </el-form-item>
          <el-form-item label="指派时间">
            <el-date-picker v-model="dispatchForm.assignedTime" type="datetime" placeholder="选择日期时间" />
          </el-form-item>
          <el-form-item label="被指派人">
            <el-input v-model="dispatchForm.designee" />
          </el-form-item>
          <el-form-item label="工单状态">
            <el-input v-model="dispatchForm.planStatus" />
          </el-form-item>
          <el-form-item label="处理意见">
            <el-input v-model="dispatchForm.dealAdvice" type="textarea" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dispatchDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dispatchDet()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 接单 -->
      <el-dialog :visible.sync="receiveOrdersDialogVisible" title="接单" width="30%">
        <el-form ref="receiveOrdersForm" :model="receiveOrdersForm" label-width="80px">
          <el-form-item label="工单号">
            <el-input v-model="receiveOrdersForm.id" />
          </el-form-item>
          <el-form-item label="被指派人">
            <el-input v-model="receiveOrdersForm.designee" />
          </el-form-item>
          <el-form-item label="工单状态">
            <el-input v-model="receiveOrdersForm.planStatus" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="receiveOrdersDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="receiveOrdersDet()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 结束上报 -->
      <el-dialog :visible.sync="endReportDialogVisible" title="结束上报" width="30%">
        <el-form ref="endReportForm" :model="endReportForm" label-width="80px">
          <el-form-item label="工单号">
            <el-input v-model="endReportForm.id" />
          </el-form-item>
          <el-form-item label="处理类型">
            <el-input v-model="endReportForm.dealType" />
          </el-form-item>
          <el-form-item label="工单状态">
            <el-input v-model="endReportForm.planStatus" />
          </el-form-item>
          <el-form-item label="处理时间">
            <el-date-picker v-model="endReportForm.dealTime" type="datetime" placeholder="选择日期时间" />
          </el-form-item>
          <el-form-item label="处理描述">
            <el-input v-model="endReportForm.dealDes" type="textarea" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="endReportDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="endReportDet()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  data() {
    return {
      dispatchForm: {
        id: '',
        assignedTime: '',
        assignedUser: '',
        designee: '',
        planStatus: '',
        dealAdvice: ''
      },
      receiveOrdersForm: {
        id: '',
        designee: '',
        planStatus: ''
      },
      endReportForm: {
        id: '',
        dealDes: '',
        planStatus: '',
        dealTime: '',
        dealType: ''
      },
      endReportDialogVisible: false,
      receiveOrdersDialogVisible: false,
      dispatchDialogVisible: false,
      value: '',
      dispatchShow: true,
      receiveOrdersShow: true,
      endReportShow: true,
      endOrdersShow: true,
      table: {},
      model: {
        assignedUser: '',
        designee: '',
        assignedTime: ''
      }
    }
  },
  computed: {},

  mounted() {
    // this.model.assignedTime = dateFormat(new Date())
    this.model.assignedUser = this.$store.getters.roles
  },
  methods: {
    dispatch(table) {
      this.dispatchDialogVisible = true
      this.dispatchForm = { ...table }
    },
    dispatchDet() {
      return request({ url: 'rw/rwplan/assign', methods: 'post', params: this.dispatchForm })
        .then((res) => {
          if (res.data.code === '0') {
            return this.$notify({
              title: '成功',
              message: res.data.msg,
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: '指派失败',
              type: 'error',
              duration: 2000
            })
          }
        })
        .finally(() => {
          this.dispatchDialogVisible = false
        })
    },
    receiveOrders(table) {
      this.receiveOrdersDialogVisible = true
      this.receiveOrdersForm = { ...table }
    },
    receiveOrdersDet() {
      return request({ url: 'rw/rwplan/receiveOrder', methods: 'post', params: this.receiveOrdersForm })
        .then((res) => {
          if (res.data.code === '999998') {
            return this.$notify({
              title: '成功',
              message: res.data.msg,
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: '指派失败',
              type: 'error',
              duration: 2000
            })
          }
        })
        .finally(() => {
          this.receiveOrdersDialogVisible = false
        })
    },
    endReport(table) {
      this.endReportDialogVisible = true
      this.endReportForm = { ...table }
      console.log(this.endReportForm)
    },
    endReportDet() {
      return request({ url: 'rw/rwplan/Report', methods: 'post', params: this.endReportForm })
        .then((res) => {
          console.log(res)
          if (res.data.code === '999998') {
            return this.$notify({
              title: '成功',
              message: res.data.msg,
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: '指派失败',
              type: 'error',
              duration: 2000
            })
          }
        })
        .finally(() => {
          this.endReportDialogVisible = false
        })
    }
    // endOrders(table) {}
  }
}
</script>

<style  scoped>
</style>
