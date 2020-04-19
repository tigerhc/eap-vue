import Vue from 'vue'
export default Vue.extend({
  computed: {
    readonlyMode: function() {
      const type = this.type
      if (!type || type === 'VIEW') {
        // 查看处理
        return true
      }
      return false
    },
    type: function() {
      return this.$route.query.type
    },
    isAdd() {
      return this.type === 'ADD'
    },
    isView() {
      return this.type === 'VIEW'
    },
    isEdit() {
      return this.type === 'EDIT'
    }
  }
})
