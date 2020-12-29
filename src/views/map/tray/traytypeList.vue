<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{row}" v-bind="table" url="/map/maptraytype" sort="trayModel.desc" >
      <!--todo fixed属性导致当前列变为第一列-->
			<w-table-col name="trayModel" label="治具种类" width="100" align="left" query condition="eq"/>
      <w-table-col name="trayRow" label="托盘行" width="100" align="left"/>
      <w-table-col name="trayCol" label="托盘列" width="100" align="left"/>
			<w-table-col name="trayType" label="治具托盘" width="100" align="left" dict="sf"/>
			<w-table-col name="remarks" label="描述" width="100" align="left"/>
      <w-table-toolbar hidden name="batchDelete" />
      <w-table-toolbar name="add" url="views/map/tray/traytypeEdit" />
    </w-table>
  </div>
</template>

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
