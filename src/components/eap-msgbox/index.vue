<script>
export default {
  name: 'WMsgbox',
  props: {
    name: {
      type: String,
      default: 'msg'
    }
  },
  mounted() {
    this.$vnode.context[`$w_${this.name}`] = (conf = {}) => {
      console.info(conf)
      return this.show(conf)
    }
  },
  methods: {
    show(conf) {
      return this.$msgbox({
        title: '消息',
        customClass: 'eap-msgbox',
        message: <div>{this.$slots.default}</div>,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            ; (conf.onConfirm || function() {})(() => {
              done()
              instance.confirmButtonLoading = false
            }, instance)
          } else {
            done()
          }
        },
        ...conf })
    }
  },
  render(h, context) {
    return null
  }
}
</script>
<style>
.eap-msgbox {
  width: unset !important;
}
</style>
