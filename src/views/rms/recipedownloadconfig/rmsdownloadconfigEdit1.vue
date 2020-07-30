<template>
  <div class="app-container calendar-list-container">
    <w-edt-table v-slot="{row}" ref="language" v-bind="table" url="/rms/rmsrecipedownloadconfig" sort="create_date.desc" >
      <w-table-col name="eqpModelName" required label="设备类型" condition="like"/>
      <w-table-col name="level1" label="优先下载" width="300" dict="RECIPE_VERSION_TYPE">
        <w-select-dic v-model="table.model.level1" style="width:100%" label="优先下载" dict="RECIPE_VERSION_TYPE" />
      </w-table-col>
      <w-table-col name="level2" label="其次下载" width="300" dict="RECIPE_VERSION_TYPE">
        <w-select-dic v-model="table.model.level2" style="width:100%" label="其次下载" dict="RECIPE_VERSION_TYPE" />
      </w-table-col>
      <w-table-col name="level3" label="最后下载" width="300" dict="RECIPE_VERSION_TYPE">
        <w-select-dic v-model="table.model.level3" style="width:100%" label="最后下载" dict="RECIPE_VERSION_TYPE" />
      </w-table-col>
      <w-table-col name="updateDate" label="更新时间" width="300" sort/>
      <w-table-toolbar name="add" hidden/>
      <w-table-toolbar name="batchDelete" hidden/>
      <w-table-button name="delete" hidden/>
    </w-edt-table>
  </div>
</template>

<script>
export default {
  name: 'DownloadConfig',
  data() {
    return {
      type: 'Edit',
      table: {
        model: {
          eqpModelName: '',
          level1: '',
          level2: '',
          level3: '',
          updateDate: ''
        }
      }
    }
  },
  methods: {
  }
}
</script>
