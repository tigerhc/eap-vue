<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{row}" v-bind="table" url="/fab/fabmsequipmentmodel" sort="create_date.desc" >
<!--      <w-table-col name="manufacturerName" label="设备厂家" width="300" query condition="like" fixed handler="view"/>-->
      <w-table-col name="classCode" label="设备类型" width="300" query condition="like" dict url="/fab/fabequipmentmodel/classCodeList" />
      <w-table-col name="activeFlag" label="有效标志" width="200" dict="ACTIVE_FLAG" />
      <w-table-col name="updateDate" label="更新时间" width="200" sort />
      <w-table-toolbar name="add" url="views/ms/eqpablility/mseqpablilityEdit" />
      <w-table-toolbar name="batchDelete" hidden/>
      <w-table-button name="delete" hidden/>
      <w-table-button name="edit" hidden/>

    </w-table>

  </div>
</template>

<script>
export default {
  name: 'MseqpablilityList',
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
