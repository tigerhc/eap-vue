<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{row}" v-bind="table" url="/fab/fablog" sort="createDate.desc" >
      <w-table-col name="eqpId" label="设备号" width="120" sort fixed align="left" handler="view" query eqp multiple namekey="id" condition="in"/>
      <w-table-col name="eventName" label="事件" align="center" />
      <w-table-col name="lotNo" label="批次" align="center" />
      <w-table-col name="recipeCode" label="配方CODE" align="center" />
      <w-table-col name="eventStatus" label="事件状态" align="center" />
      <w-table-col name="eventDesc" label="事件描述" align="center" />
      <w-table-col name="ip" label="ip" align="center" />
      <w-table-col name="createBy" label="创建人" align="center" />
      <w-table-col name="createDate" label="创建时间" width="250" align="center" sort="1" query querymode="date" condition="between"/>
      <w-table-toolbar name="add" hidden/>
      <w-table-toolbar name="batchDelete" hidden />
    </w-table>
  </div>
</template>

<script>
export default {
  name: 'FabLogList',
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
