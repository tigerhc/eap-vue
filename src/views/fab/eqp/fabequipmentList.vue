<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table">
      <w-table-col name="eqpId"       label="设备号" align="left" handler="view" query condition="like"/>
      <w-table-col name="officeName"  label="部门" align="left"/>
      <w-table-col name="bcCode"      label="BC号" align="center" query condition="like" />
      <w-table-col name="ip"          label="机台IP地址" align="center"/>
      <w-table-col name="modelName"   label="设备型号" align="left" query condition="like" />
      <!--todo 分页url添加 hidden属性导致查询失效-->
      <w-table-col name="modelId"     label="设备型号2" hidden query dict url="/fab/fabequipmentmodel" namekey="manufacturerName" condition="eq" />
      <w-table-col name="location"    label="位置号" align="center"/>
      <w-table-col name="activeFlag"  label="有效标志" align="center" formatter.dict="ACTIVE_FLAG"/>
      <w-table-col name="updateDate"  label="更新时间" align="center"/>

      <!--<w-table-toolbar name="add" url="views/fab/eqpmodel/eqpmodelAdd" />-->
      <!--todo 先默认按钮,再自定义按钮-->
      <w-table-toolbar name="exportExcel" label="导出Excel" tip="你想干啥111？" icon="fa-download" type="success" />
      <w-table-button name="stop" tip="确认终止？" label="终止" />

    </w-table>

  </div>
</template>

<script>
export default {
  name: 'Eqp',
  data() {
    return {
      table: {
        url: '/fab/fabequipment',
        handler: {
          add: 'views/fab/eqp/fabequipmentEdit',
          // edit: 'views/fab/eqpmodel/fabequipmentEdit',
          // view: 'views/fab/eqpmodel/fabequipmentEdit'
          // delete: true,
          // search: true,
          batchDelete: true
        },
        sort: 'updateDate'
        //          columns: [
        //            {name: 'eqpId',            label: '设备号',       align: 'left',  'formatter.handler': 'view', query: 'true', queryMode: 'input', condition: 'like'},
        //            {name: 'officeName',     label: '部门',         align: 'left'  },
        //            {name: 'bcCode',           label: 'BC号',         align: 'center' , query: 'true', queryMode: 'input', condition: 'like'},
        //            {name: 'ip',               label: '机台IP地址',   align: 'center'},
        //            {name: 'modelName',        label: '设备型号名称', align: 'left', query: 'true', queryMode: 'input', condition: 'like'},
        //            {name: 'location',         label: '位置号',       align: 'center'},
        //            {name: 'activeFlag',       label: '有效标志',     align: 'center', 'formatter.dict': 'ACTIVE_FLAG'},
        //            {name: 'updateDate',       label: '更新时间',     align: 'center'}
        //          ]
      }
    }
  },
  methods: {
    stop(row, table) {
      alert(1);
      console.info(row, table)
    },
    exportExcelRequest(tab, query) {
      return request({
        url: tab + 'export',
        method: 'get',
        params: query
      })
    },
    exportExcel(row, table) {
      alert(222);
//      this.downloadLoading = false;
      exportExcelRequest(this.tab, this.listQuery).then(response => {
      this.downloadLoading = true
      if (response.data.code === 0) {
        import('@/vendor/Export2Excel').then(excel => {
          excel.export_byte_to_excel(response.data.bytes, response.data.title)
          this.downloadLoading = false
        })
      } else {
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg,
          duration: 2000
        })
      }
      })
    }
  }
}
</script>
