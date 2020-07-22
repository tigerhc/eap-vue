<script>
export default {
  name: 'WFormRender',
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
    },
    beforeSubmit: {
      type: Function,
      default: (v) => v
    },
    onLoadData: {
      type: Function,
      default: (v) => v
    }
  },
  data: function() {
    return {
      // model: {},
      inited: false,
      resized: null
    }
  },
  computed: {

    realModel: function() {
      return { ...this.initModel, ...this.model }
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      if (window.innerWidth < 1000) {
        this.resized = 2
      } else {
        this.resized = 3
      }
    })
  },
  methods: {
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
          let [path = ''] = expression.match(/(?![^\.]).*/g)
          path = path.split('.').filter(Boolean).join('.')
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
      return (
        <el-col xs={24} span={+col || s}>
          {this.formItem(v)}
        </el-col>
      )
    },
    wrapRow(columns = 3) {
      const total = 24
      const eachCol = Math.floor(total / columns)
      const slots = this.$slots.default.filter(this.filterEmpty)
      const rowVnodes = []
      const arrayCols = slots.map((s) => {
        const { col } = this.getPropAndAttrs(s)
        return +col
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
      <div class='model'>
        <el-form
          model={this.realModel}
          inline={false}
          disabled={this.disabled}
          rules={this.rules}
          label-width={this.labelWidth}
          class='modelForm'
          ref='form'
        >
          {this.wrapRow(this.resized || this.col)}
        </el-form>
      </div>
    )
  }
}
</script>

<style lang="scss">
.model {
  margin: 0 30px 0 20px;
  .header {
    height: 50px;
    border-bottom: 1px solid #eee;
    padding: 13px 10px 1px 15px;
    font-size: 16px;
    margin-bottom: 20px;
  }
}
</style>
