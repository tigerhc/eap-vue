<script>
import fetch from '@/components/eap-table/fetch'
import mixins from './mixins'
export default {
  name: 'WForm',
  mixins: [mixins],
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
    // 获取详情数据后回调函数
    onLoadData: {
      type: Function,
      default: (v) => v
    },
    bottomBtn: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      // model: {},
      inited: false,
      api: fetch(this.url),
      resized: null
    }
  },
  computed: {
    realModel: function() {
      return { ...this.initModel, ...this.model }
    }
  },
  mounted() {
    if (this.type === 'VIEW' || this.type === 'EDIT') {
      this.getDeteils()
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth < 1000) {
        this.resized = 2
      } else {
        this.resized = 3
      }
    })
  },
  activated() {
    console.info('actived')
    if (this.type === 'VIEW' || this.type === 'EDIT') {
      this.getDeteils()
    }
  },
  methods: {
    getDeteils() {
      const id = this.$route.query.id
      if (id === undefined) {
        console.info('找不到详情id')
        return
      }
      this.api.detail(id).then((resp) => {
        let m = resp.results
        // const { detail } = this.$vnode.context
        // m = (detail && detail.call(this, m)) || m
        m = this.onLoadData(m) || m
        Object.assign(this.model, m)
        // this.model = { ...this.model, ...m }
        // this.$set(this, 'model', this.model)
        setTimeout(() => {
          this.$refs.form.resetFields()
        })
      })
    },
    cancel() {
      const { matched } = this.$route
      const cp = [...matched]
      const preRoute = cp[Math.max(cp.length - 2)]
      console.info('取消返回上级页面', preRoute)
      this.$store.dispatch('delView', this.$route).then(({ visitedViews }) => {
        this.$router.push({ path: preRoute && preRoute.path })
      })
    },
    operating() {
      if (this.type === 'ADD') {
        this.doAdd()
      }
      if (this.type === 'EDIT') {
        this.doEdit()
      }
    },
    add(params) {
      this.api.create(params).then((res) => {
        if (res.code === 0) {
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
        if (res.code === 0) {
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
    doAdd() {
      this.$refs.form.validate().then(
        () => {
          const p = this.beforeSubmit(this.model, 'ADD')
          this.add(p || this.model)
        },
        (e) => {
          console.info('cancel add')
        }
      )
    },
    doEdit() {
      this.$refs.form.validate().then(
        () => {
          const p = this.beforeSubmit(this.model, 'EDIT')
          this.edit(p || this.model)
        },
        (e) => {
          console.info('cancel edit')
        }
      )
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
          path = path
            .split('.')
            .filter(Boolean)
            .join('.')
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
        <div class='header'>{this.title[this.type]}</div>
        <el-form
          model={this.realModel}
          inline={false}
          disabled={this.readonlyMode}
          rules={this.rules}
          label-width={this.labelWidth}
          class='modelForm'
          ref='form'
        >
          {this.wrapRow(this.resized || this.col)}
        </el-form>
        <div slot='footer' class='add-footer' hidden={this.bottomBtn}>
          <el-button on-click={this.cancel.bind(this)}>返回</el-button>
          {!this.readonlyMode && (
            <el-button type='primary' on-click={this.operating.bind(this)}>
              {this.$t('table.confirm')}
            </el-button>
          )}
        </div>
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
