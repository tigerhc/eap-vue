<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="/fab/fabequipmentmodel" sort="create_date.desc">
      <w-table-col name="manufacturerName" label="设备厂家" query condition="like" handler="edit" />
      <w-table-col
        name="classCode"
        label="设备类型"
        query
        condition="like"
        dict
        url="/fab/fabequipmentmodel/classCodeList"
      />
      <w-table-col name="activeFlag" label="有效标志" width="300" dict="ACTIVE_FLAG" foldcolor />
      <w-table-col name="updateDate" label="更新时间" width="300" sort />
      <w-table-toolbar name="add" url="views/rms/recipetemplate/rmsrecipetemplateView" hidden />
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-button name="delete" hidden />
    </w-table>
  </div>
</template>

<script>
export default {
  name: 'OvenModel',
  data() {
    return {
      table: {}
    }
  },
  methods: {}
}
</script>
