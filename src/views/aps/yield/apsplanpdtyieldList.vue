<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{row}" v-bind="table" url="/aps/apsplanpdtyield" sort="plan_date.asc" >
      <w-table-col name="productionNo" label="品番" width="100" sort fixed align="center" handler="view" query condition="like" />
      <w-table-col name="productionName" label="品名" align="left" width="250" query condition="like" />
      <w-table-col name="planDate" label="投入日期" width="100" align="center"/>
      <w-table-col name="lotQty" label="批次数量" width="100" align="right" />
      <w-table-col name="planQty" label="投入数" width="100" align="right" />
      <!--hidden属性: 隐藏默认button url: 修改默认url 没有url,则默认调用属性name值的方法-->
      <w-table-toolbar name="add" url="views/aps/yield/apsplanpdtyieldEdit" hidden/>
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-button name="delete" hidden />
      <w-table-button name="edit" hidden />
      <w-table-button name="exports" url="111" hidden />

    </w-table>

  </div>
</template>

<script>
export default {
  name: 'ApsplanpdtyieldList',
  data() {
    return {
      table: {
        opHide: true
      }
    }
  },
  methods: {
  }
}
</script>
