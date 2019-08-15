<script>
import { modules } from '@/router'
export default {
  name: 'WLookup',
  inject: {
    elForm: { default: null }
  },
  props: {
    module: { type: String, default: '' },
    title: String,
    disabled: {
      type: Boolean,
      default: false
    },
    value: { type: undefined, default: undefined },
    placeholder: {
      type: String,
      default: '请选择'
    },
    displaykey: String,
    idkey: { type: String, default: 'id' },
    display: { type: String, default: '' },
    width: { default: '900px', type: String }
  },
  data: function() {
    return {
      show: false
    }
  },
  computed: {
    table: function() {
      const table =
        this.$refs.list &&
        this.$refs.list.$children &&
        this.$refs.list.$children.find((item) => item.$options.name === 'WTable')
      return table
    },
    inputDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    }
  },
  mounted() {
    //
  },
  methods: {
    confirm() {
      if (this.table) {
        const display = []
        const id = []
        this.table.multipleSelection.map((res) => {
          display.push(res[this.displaykey])
          id.push(res[this.idkey])
        })
        this.$emit('input', id.join(','))
        this.$emit('update:display', display.join(','))
      }
      this.show = false
    },
    opendlg() {
      if (this.inputDisabled) {
        return
      }
      this.show = true
      setTimeout(() => {
        if (this.table) {
          this.table.searchOnly = true
          this.table.opHide = true
        }
      })
    }
  },
  render() {
    console.info(this.disabled)
    console.info()
    const Com = modules[this.module]
    // console.info(Com, modules)
    const dialogConf = {
      props: {
        visible: this.show,
        'close-on-click-modal': false,
        title: this.title,
        'append-to-body': true,
        width: this.width,
        top: '15px'
      },
      on: {
        close: () => {
          this.show = false
        }
      }
    }
    const dlg = (
      <el-dialog {...dialogConf}>
        <div style='height:440px;overflow-y:auto'>
          <Com ref='list' />
        </div>
        <div slot='footer' class='dialog-footer'>
          <el-button
            on-click={(e) => {
              this.show = false
            }}
          >
            取 消
          </el-button>
          <el-button type='primary' on-click={this.confirm.bind(this)}>
            确 定
          </el-button>
        </div>
      </el-dialog>
    )
    return (
      <div>
        {dlg}
        <el-input disabled={this.disabled} value={this.display} placeholder={this.placeholder} readonly>
          <i slot='suffix' class='el-input__icon el-icon-search' on-click={this.opendlg.bind(this)} />
        </el-input>
      </div>
    )
  }
}
</script>
