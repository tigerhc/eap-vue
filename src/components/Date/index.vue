<template><span>{{ date | formaDate }}</span>

</template>
<script>
// 创建一个函数来增加月日时小于10在前面加0
var padaDate = function(value) {
  return value < 10 ? '0' + value : value
}
export default {
  filters: {
    formaDate: function(value) {
      var date = new Date()
      var year = date.getFullYear() // 存储年
      var month = padaDate(date.getMonth() + 1) // 存储月份
      var day = padaDate(date.getDate()) // 存储日期
      var hours = padaDate(date.getHours()) // 存储时
      var minutes = padaDate(date.getMinutes()) // 存储分
      var seconds = padaDate(date.getSeconds()) // 存储秒
      return year + '年' + month + '月' + day + '日' + hours + '时' + minutes + '分' + seconds + '秒'
    }
  },
  data() {
    return {
      date: new Date() // 实时时间
    }
  },
  computed: {},
  watch: {},
  created() {

  },
  mounted() {
    // 创建定时器更新最新的时间
    var _this = this
    this.timeId = setInterval(function() {
      _this.date = new Date()
    }, 1000)
  },
  beforeDestroy: function() {
    // 实例销毁前青出于定时器
    if (this.timeId) {
      clearInterval(this.timeId)
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>

</style>
