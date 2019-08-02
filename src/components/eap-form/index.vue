<script>
import fetch from '@/components/eap-table/fetch'
export default {
  name: 'EapForm',
  props: {
    title: {
      type: Object,
      default: function() {
        return {}
      }
    },
    rules: {
      type: Object,
      default: null
    },
    labelWidth: {
      type: String,
      default: '150px'
    },
    col: {
      type: Number,
      default: 3
    },
    model: {
      type: Object,
      default: function() {
        return {}
      }
    },
    url: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      // model: {},
      inited: false,
      api: fetch(this.url)
    }
  },
  computed: {
    flag: function() {
      return this.$route.query.type
    },
    realModel: function() {
      return { ...this.initModel, ...this.model }
    }
  },
  mounted() {
    this.initAdd()
    this.initEdit()
  },
  methods: {
    cancel() {
      const { cancel } = this.$vnode.context
      cancel && cancel.call(this)
    },
    operating() {
      if (this.flag === 'addModel') {
        const { add } = this.$vnode.context
        add && add.call(this)
      }
      if (this.flag === 'editModel') {
        const { edit } = this.$vnode.context
        edit && edit.call(this)
      }
    },
    add(params) {
      this.api.create(params).then((res) => {
        if (res.data.code === 0) {
          this.cancel()
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '添加失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    edit(params) {
      this.api.update(params).then((res) => {
        if (res.data.code === 0) {
          this.cancel()
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '修改失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    initAdd() {
      const { add } = this.$vnode.context
      this.$vnode.context.add = (...agu) => {
        this.$refs.form.validate().then(() => {
          const p = add && add.call(this, this.model)
          console.info(p)
          this.add(p || this.model)
        })
      }
    },
    initEdit() {
      const { edit } = this.$vnode.context
      this.$vnode.context.edit = (...agu) => {
        this.$refs.form.validate().then(() => {
          const p = edit && edit.call(this, this.model)
          this.edit(p || this.model)
        })
      }
    },

    getPropAndAttrs(v) {
      if (!this.isComponent(v)) {
        return {}
      }
      const { componentOptions, data } = v
      const { propsData } = componentOptions
      const { attrs } = data
      const { name, label, prop, col } = { ...attrs, ...propsData }
      return {
        name,
        label,
        prop,
        col
      }
    },
    isComponent(vnode) {
      return !!vnode.componentOptions
    },
    formItem(v) {
      // console.info(v)
      if (this.isComponent(v)) {
        const { componentOptions, data } = v
        // const { listeners } = componentOptions
        // const { input } = listeners || {}
        const { tag, propsData } = componentOptions
        const { attrs, model } = data
        const { expression } = model || {}
        // const { label, prop } = propsData
        const { label } = { ...attrs, ...propsData }
        if (tag && label && expression) {
          const [path] = expression.match(/(?<=(^[^\.]*\.))(.*)/g)
          return (
            <el-form-item label={label} prop={path}>
              {v}
            </el-form-item>
          )
        }
        if (tag === 'el-form-item') {
          // TODO
        }
      }
      return v
    },
    filterEmpty({ tag, text }) {
      return !(!tag && !(text || '').trim())
    },
    wrapCol(v, s) {
      const { col } = this.getPropAndAttrs(v)
      return <el-col span={col || s}>{this.formItem(v)}</el-col>
    },
    wrapRow(columns = 3) {
      const total = 24
      const eachCol = Math.floor(total / columns)
      const slots = this.$slots.default.filter(this.filterEmpty)
      const rowVnodes = []
      const arrayCols = slots.map((s) => {
        const { col } = this.getPropAndAttrs(s)
        return col
      })
      arrayCols.reduce((t, v, i) => {
        const re = (v || eachCol) + t
        if (re > total) {
          rowVnodes[rowVnodes.length] = [...(rowVnodes[rowVnodes.length] || []), slots[i]]
          return v || eachCol
        }
        const index = Math.max(rowVnodes.length - 1, 0)
        rowVnodes[index] = [...(rowVnodes[index] || []), slots[i]]
        return re
      }, 0)
      return rowVnodes.map((clms) => {
        return (
          <el-row>
            {clms.map((r) => {
              return this.wrapCol(r, eachCol)
            })}
          </el-row>
        )
      })
    }
  },

  render() {
    return (
      <div>
        <div class='header'>{this.title[this.flag]}</div>
        <el-form
          model={this.realModel}
          inline={false}
          disabled={!this.flag}
          rules={this.rules}
          label-width={this.labelWidth}
          class='modelForm'
          ref='form'
        >
          {this.wrapRow(this.col)}
        </el-form>
        <div slot='footer' class='add-footer'>
          <el-button on-click={this.cancel.bind(this)}>返回</el-button>
          {
            <el-button type='primary' on-click={this.operating.bind(this)}>
              {this.$t('table.confirm')}
            </el-button>
          }
        </div>
      </div>
    )
  }
}
</script>

<style>
</style>
