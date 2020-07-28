<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{row}" v-bind="table" :data="table.datas" url="" sort="create_date.desc" >
      <w-table-col name="manufacturerName" label="设备厂家" query condition="like" fixed handler="edit" />
      <w-table-col name="fileType" label="文件类型" />
      <w-table-col name="classCode" label="设备类型" query condition="like" dict url="/fab/fabequipmentmodel/classCodeList"/>
      <w-table-col name="activeFlag" label="有效标志" dict="ACTIVE_FLAG"/>
      <w-table-col name="updateDate" label="更新时间" width="300" sort/>
      <w-table-toolbar name="add" url="views/edc/edcconfigfile/edcconfigfileEdit" hidden/>
      <w-table-toolbar name="batchDelete" hidden/>
      <w-table-button name="delete" hidden/>
    </w-table>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'EdcModelConfig',
  data() {
    return {
      table: {
        datas: []
      }
    }
  },
  created() {
    this.getEqpModelMessage()
  },
  methods: {
    getEqpModelMessage() {
      request({ url: '/edc/edcconfigfilecsv/getEqpModelMessage',
        'method': 'post'
      }).then((res) => {
        if (res.data.code === 0) {
          this.table.datas = res.data.results
        }
      })
    }
  }
}
</script>
