<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{row}" v-bind="table" url="/edc/edcevtrecord" sort="createDate.desc" >
      <w-table-col name="eqpId" label="设备号" sort fixed align="center" query condition="like" />
      <w-table-col name="eventId" label="事件ID" align="center" />
      <w-table-col name="eventDesc" label="事件描述" align="center" />
      <w-table-col name="eventParams" label="事件参数" align="center" />
      <w-table-col name="startDate" label="开始时间" align="center" sort="1" query querymode="date" condition="between" />
      <w-table-toolbar name="add" hidden/>
      <w-table-toolbar name="batchDelete" hidden />
    </w-table>
  </div>
</template>

<script>
export default {
  name: 'EventLog',
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
