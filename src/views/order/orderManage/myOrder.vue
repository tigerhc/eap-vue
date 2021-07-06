<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="rw/rwplan">
      <w-table-col name="id" label="工单号" align="left" query querymode="select" />
      <w-table-col name="planId" label="（计划、报警）编号" align="left" />
      <w-table-col name="eqpId" label="设备编号" align="left" query querymode="select" />
      <w-table-col name="assignedUser" label="指派人" align="left" />
      <w-table-col name="designee" label="被指派人" align="left" />
      <w-table-col name="assignedTime" label="指派时间" align="left" query querymode="date" condition="between" />
      <w-table-col name="dealTime" label="处理时间" align="left" query querymode="date" condition="between" />
      <w-table-col name="planStatus" label="工单状态" align="left" query querymode="select" dict="PLAN_STATUS" />
      <w-table-col name="planType" label="工单类型" align="left" query querymode="select" dict="PLAN_TYPE" />
      <w-table-col name="dealAdvice" label="处理意见" align="left" />
      <w-table-col name="dealDesc" label="处理描述" align="left" />
      <w-table-col name="endDate" label="归档时间" align="left" />
      <w-table-button :hidden="dispatchShow" name="dispatch" icon="el-icon-document" label="派单" type="primary" />
      <w-table-button
        :hidden="receiveOrdersShow"
        name="receiveOrders"
        icon="el-icon-document-checked"
        label="接单"
        type="primary"
      />
      <w-table-button
        :hidden="endReportShow"
        name="endReport"
        icon="el-icon-document-delete"
        label="结束上报"
        type="primary"
      />
      <w-table-button
        :hidden="endOrdersShow"
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
    <w-msgbox>
      <w-form-render :col="1" :model="model" label-width="5em">
        <el-input v-model="model.assignedUser" label="指派人" />
        <el-input v-model="model.designee" label="被指派人" />
        <el-input v-model="model.assignedTime" label="指派时间" type="data" />
      </w-form-render>
    </w-msgbox>
  </div>
</template>

<script>
import request from '@/utils/request'
import dateFormat from '@/utils/dateformat'

export default {
  data() {
    return {
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
    this.model.assignedTime = dateFormat(new Date())
    this.model.assignedUser = this.$store.getters.roles
    this.show('1')
    this.getData()
  },
  methods: {
    getData() {
      return request({ url: 'rw/rwplan/rwplanlistall', methods: 'get' }).then((res) => {
        console.log(res)
      })
    },
    dispatch(table) {
      console.info(table)
      this.$w_msg({
        title: '派单',
        onConfirm: (done) => {
          // 点击确定按钮以后 要做的事情
          setTimeout(() => {
            done()
          }, 2000)
        }
      }).then(
        (a) => {
          console.info(a)
        },
        (error) => {
          console.info(error)
        }
      )
    },
    receiveOrders(table) {
      console.info(table)
      this.$w_msg({
        title: '接单',
        onConfirm: (done) => {
          // 点击确定按钮以后 要做的事情
          setTimeout(() => {
            done()
          }, 2000)
        }
      }).then(
        (a) => {
          console.info(a)
        },
        (error) => {
          console.info(error)
        }
      )
    },
    endReport(table) {
      console.info(table)
      this.$w_msg({
        title: '结束上报',
        onConfirm: (done) => {
          // 点击确定按钮以后 要做的事情
          setTimeout(() => {
            done()
          }, 2000)
        }
      }).then(
        (a) => {
          console.info(a)
        },
        (error) => {
          console.info(error)
        }
      )
    },
    endOrders(table) {
      console.info(table)
      this.$w_msg({
        title: '结束工单',
        onConfirm: (done) => {
          // 点击确定按钮以后 要做的事情
          setTimeout(() => {
            done()
          }, 2000)
        }
      }).then(
        (a) => {
          console.info(a)
        },
        (error) => {
          console.info(error)
        }
      )
    },
    show(v) {
      if (v === '1') {
        this.dispatchShow = false
      } else if (v === '2') {
        this.receiveOrdersShow = false
      } else if (v === '3') {
        this.endReportShow = false
      } else {
        this.endOrdersShow = false
      }
    }
  }
}
</script>

<style  scoped>
</style>
