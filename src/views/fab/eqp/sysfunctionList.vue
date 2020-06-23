<template>
  <div class="app-container calendar-list-container">

    <w-table v-slot="{row}" v-bind="table" url="/core/sysfunction" sort="create_date.desc" >
      <!--todo fixed属性导致当前列变为第一列-->
      <w-table-col name="fctType" label="功能类型" align="left" handler="view" query condition="like"/>
      <w-table-col name="fctCode" label="功能代码" width="400" align="left"/>
      <w-table-col name="fctDesc" label="功能描述" width="300" align="left" query condition="like"/>
      <w-table-col name="activeFlag" label="有效标志" width="150" align="center" dict="ACTIVE_FLAG" query condition="eq"/>
      <w-table-col name="createDate" label="更新时间" sort width="200" align="center" query querymode="date" condition="between"/>

      <w-table-toolbar name="add" url="views/fab/eqp/sysfunctionEdit" />

    </w-table>

  </div>
</template>

<script>
export default {
  name: 'SysFunctionList',
  data() {
    return {
      table: {
      }
    }
  }
}
</script>
