<template>
  <div class="app-container calendar-list-container">
    <w-form v-bind="formConf" :col="3" :model="model">
      <el-input v-model="model.assignedUser" label="指派人" disabled />
      <el-input v-model="model.designee" label="被指派人" />
      <el-input v-model="model.assignedTime" label="指派时间" />
    </w-form>
    <w-table>
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-toolbar name="exports" hidden />
      <w-table-toolbar name="clean" hidden />
      <w-table-toolbar name="search" hidden />
      <w-table-toolbar name="add" hidden />
    </w-table>
  </div>
</template>

<script>
// import x from ''
export default {
  components: {},
  data() {
    return {
      model: { assignedUser: '', designee: '', assignedTime: '' },
      formConf: {
        url: 'fab/iotequipmentbind',
        title: {
          ADD: '工单制定',
          EDIT: '工单制定',
          VIEW: '工单制定'
        },
        rules: {},
        onLoadData: (m, type) => {
          return m
        },
        beforeSubmit: (params, type) => {
          const re = { ...params }
          return re
        }
      },
      table: {
        opHide: true
      }
    }
  },
  mounted() {
    this.model.assignedUser = this.$store.getters.roles[0]
  },
  methods: {}
}
</script>

<style  scoped>
</style>
