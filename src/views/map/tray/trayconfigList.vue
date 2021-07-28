<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{row}" v-bind="table" url="/map/maptrayconfig" sort="start_time.desc" >
      <!--todo fixed属性导致当前列变为第一列-->
      <w-table-col name="trayId" label="托盘ID" width="100" align="left" query condition="eq"/>
      <w-table-col name="trayRow" label="托盘行" width="100" align="left"/>
      <w-table-col name="trayCol" label="托盘列" width="100" align="left"/>
			<w-table-col name="trayType" label="治具托盘" width="100" align="left" dict="TRAY_TYPE"/>
			<w-table-col name="trayModel" label="治具种类" width="100" align="left" query condition="eq"/>
      <w-table-col name="startTime" label="开始时间" sort width="200" align="center" query querymode="date" condition="between"/>
      <w-table-col name="trayDesc" label="托盘描述" width="400" align="center"/>
      <w-table-toolbar hidden name="batchDelete" />
      <w-table-toolbar name="add" url="views/map/tray/trayconfigEdit" />
      <w-table-toolbar name="eqpConfig" label="设备关系设置" url="views/map/tray/eqpconfigList"/>
    </w-table>

  </div>
</template>
<style lang="scss">
.el-input__inner{font-size: larger !important;}
</style>
<script>
export default {
  name: 'TrayConfigList',
  data() {
    return {
      table: {

      }
    }
  },
  methods: {
    eqpConfig(btn) {
      this.$router.push({
        name: btn.url
      })
    }
  }
}
</script>
