<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" :onloadsuccess="deal" url="fab/iotequipmentbind">
      <w-table-col
        name="parentEqpId"
        label="父级设备号"
        querymode="select"
        width="300"
        query
        condition="like"
        hidden
        dict
        url="fab/fabequipment/eqpIdlist"
      />
      <!--tip="确认查看"-->
      <w-table-col name="templateName" label="模板名称" width="300" />
      <w-table-col name="officeId" label="部门名称" width="300" />
      <w-table-col name="subClassCode" label="子设备类型" width="200" />
      <w-table-col name="eqpId" label="传感器编号" width="200" />
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-toolbar name="clean" hidden />
      <w-table-toolbar name="add" hidden />
      <w-table-toolbar name="exports" hidden />
    </w-table>
  </div>
</template>

<script>
export default {
  name: 'Eqpmodel',
  data() {
    return {
      table: {
        handler: {
          add: 'views/fab/eqp/fabeqpBindEdit',
          edit: 'views/fab/eqp/fabeqpBindEdit'
          // edit: 'views/fab/eqpmodel/fabequipmentEdit',
          // view: 'views/fab/eqpmodel/fabequipmentEdit'
        }
      },
      model: {
        manufacturerName: '',
        subClassCode: '',
        smlPath: '',
        hostJavaClass: '',
        iconPath: '',
        activeFlag: '',
        remarks: '',
        delFlag: 0
      }
    }
  },
  methods: {
    stop(row, table, ctx) {
      console.info(row, table)
      ctx.refresh()
      // console
    },
    dowhat(table) {
      console.info(table)
      this.$w_msg({
        title: '定制标题',
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
    deal(row) {
      return { ...row, addfield: row.manufacturerName + '-' + row.subClassCode }
    }
  }
}
</script>
<style>
</style>
