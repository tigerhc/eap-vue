<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" :onloadsuccess="deal" url="/fab/fabequipmentmodel">
      <!--tip="确认查看"-->
      <w-table-col name="manufacturerName" label="设备厂家" query condition="like" handler="view" />
      <w-table-col name="classCode" label="设备类型" query condition="like" />
      <w-table-col name="activeFlag" label="有效标志" dict="ACTIVE_FLAG" />
      <w-table-col name="updateDate" label="更新时间" sort query querymode="date" condition="between" />
      <w-table-button name="stop" icon="el-icon-setting" tip="确认终止？" label="终止" />
      <w-table-button name="test" icon="el-icon-setting" fold label="终止(fold)" />
    </w-table>
    <w-msgbox>
      <w-form-render :col="1" :model="model" label-width="5em">
        <el-input v-model="model.manufacturerName" label="设备厂家" />
        <el-input v-model="model.classCode" label="设备类型" />
        <w-select-dic v-model="model.activeFlag" style="width: 100%" label="有效标志" dict="ACTIVE_FLAG" />
      </w-form-render>
    </w-msgbox>
  </div>
</template>

<script>
export default {
  name: 'Eqpmodel',
  data() {
    return {
      table: {
        handler: {
          add: 'views/fab/eqpmodel/eqpmodelEdit'
          // edit: 'views/fab/eqpmodel/fabequipmentEdit',
          // view: 'views/fab/eqpmodel/fabequipmentEdit'
        }
      },
      model: {
        manufacturerName: '',
        classCode: '',
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
      return { ...row, addfield: row.manufacturerName + '-' + row.classCode }
    }
  }
}
</script>
<style>
</style>
