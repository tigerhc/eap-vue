<script>
import api from './fetch'
export default {
  name: 'EapTable',
  props: {
    tableConf: {
      type: Object,
      default: function() {
        return {}
      }
    },
    columns: {
      type: Array,
      default: function() {
        return []
      }
    },
    url: {
      type: String,
      required: true
    },
    handler: {
      type: Object,
      default: function() {
        return {}
      }
    },
    sort: {
      type: String,
      default: undefined
    }
  },
  data: function() {
    return {
      isLoading: false,
      colSet: [],
      query: {
        page: 1,
        limit: 10,
        queryFields: this.queryName
      },
      total: 0,
      list: [],
      tableKey: Math.random(),
      api: api(this.url),
      multipleSelection: []
    }
  },
  computed: {
    conf: function() {
      return {
        border: true,
        'element-loading-text': '给我一点时间',
        fit: true,
        ...this.tableConf
      }
    },
    tableColumns: function() {
      return this.columns.filter((i) => !i.hidden)
    },
    queryFields: function() {
      return this.colSet.filter((i) => i.query && i.querymode)
    },
    queryName: function() {
      return this.colSet.map((i) => i.name).join() + ','
    }
  },
  watch: {
    colSet: function(n, o) {
      if (n && n.length) {
        this.doFetchData()
      }
    }
  },
  created() {},
  methods: {
    doFetchData() {
      // 初始化配置查询model
      this.queryFields.map((field) => {
        const key = `query.${field.name}||${field.condition}`
        this.$set(this.query, key, undefined)
      })
      this.refresh(1) // 初始加载第一页
    },
    excludeBindProps(col) {
      const { formatter, ...rest } = col
      console.info(formatter)
      return rest
    },
    renderColumn(row, col) {
      const val = row[col.name]
      if (col.formatter && typeof col.formatter === 'function') {
        return col.formatter(val, col, this, row)
      }
      const handler = col['formatter.handler'] || col['handler']
      if (handler && (typeof this[handler] === 'function' || typeof this.$vnode.context[handler])) {
        const h = this[handler] || this.$vnode.context[handler]
        const fn = () => {
          if (col.tip) {
            this.$confirm(col.tip).then(
              () => {
                h && h.call(this, row, this)
              },
              (e) => e
            )
          } else {
            h && h.call(this, row, col, this)
          }
        }

        return (
          <el-button type='text' size='mini' on-click={fn.bind(this)}>
            {val}
          </el-button>
        )
      }
      const dict = col['formatter.dict'] || col['dict'] // 字典转化
      if (dict) {
        const dictList = this.dictList(dict) || []
        const v = dictList.find((i) => i.value === val)
        return (v && v.label) || val
      }
      return val
    },
    handleSizeChange(limit) {
      this.query.limit = limit
      this.getList(this.query)
    },
    refresh(page = 1, limit = 10) {
      this.query.page = page
      this.query.limit = limit
      this.query.queryFields = this.queryName
      this.getList(this.query)
    },
    getList(query) {
      this.isLoading = true
      this.api.ajaxList(this.getParams(query)).then((resp) => {
        this.list = resp.data.results
        this.total = resp.data.total
        this.isLoading = false
      })
    },
    getParams(query) {
      const { page, limit, ...rest } = this.query
      return {
        'page.pn': page,
        'page.size': limit,
        sort: this.sort,
        ...rest
      }
    },
    onSelect(row) {
      debugger
      this.$emit('select', row)
      this.multipleSelection = row
    },
    delete(row) {
      const p = [
        '此操作将永久删除数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ]
      this.$confirm(...p)
        .then((_) => {
          this.api.delete(row.id).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        })
        .catch((e) => e)
    },
    // 批量删除
    batchDelete() {
      if (this.multipleSelection.length > 0) {
        const p = [
          '此操作将永久删除数据, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ]
        this.$confirm(...p)
          .then(() => {
            const obj = {
              ids: this.multipleSelection.map((i) => i.id).join(',')
            }
            this.api.batchDelete(obj).then(() => {
              this.getList()
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            })
          })
          .catch(() => {
            this.$notify({
              type: 'info',
              message: '已取消删除',
              duration: 2000
            })
          })
      } else {
        this.$notify({
          showClose: true,
          message: '请选择至少一条数据删除',
          type: 'error',
          duration: 2000
        })
      }
    },
    // 默认取设置的类型  没有取其他类型
    getRedirectPath(type = '') {
      type = type.toLowerCase()
      const assets = [type, 'ADD', 'EDIT', 'VIEW'].map((i) => (i || '').toLowerCase())
      const settedPath = this.getSlotsByType().reduce((re, i) => {
        if (assets.includes(i.handler || i.name)) {
          re[i.handler || i.name] = i.url
        }
        return re
      }, {})
      // .map((i) => i.handler || i.name)
      return assets.reduce((res, t) => {
        const p = this.handler[t.toLowerCase()] || this.handler[t.toUpperCase()] || settedPath[t.toLowerCase()]
        if (!res && p) {
          return p
        }
        return res
      }, '')
    },
    // 新建
    add({ url }) {
      const name = url || this.getRedirectPath('ADD')
      if (!name) {
        throw Error('未设置新增跳转路径')
      }
      this.$router.push({
        name, // 'views/fab/eqpmodel/addDevice'
        query: {
          type: 'ADD'
        }
      })
    },
    // 编辑
    edit(item, flag) {
      const name = this.getRedirectPath('EDIT')
      if (!name) {
        throw Error('未设置编辑跳转路径')
      }
      this.$router.push({
        name, // 'views/fab/eqpmodel/addDevice',
        query: {
          id: item.id,
          type: 'EDIT'
        }
      })
    },
    view(item) {
      const name = this.getRedirectPath('VIEW')
      console.info(name)
      if (!name) {
        throw Error('未设置查看跳转路径')
      }
      this.$router.push({
        name, // 'views/fab/eqpmodel/addDevice',
        query: {
          id: item.id,
          type: 'VIEW'
        }
      })
    },
    // 重置搜索表单
    reset() {},
    // 搜索
    search() {
      this.refresh()
    },
    renderQuery(h) {
      return this.queryFields.map((field) => {
        const key = `query.${field.name}||${field.condition}`
        // 处理其他控件
        return h('el-' + field.querymode, {
          attrs: { placeholder: field.label },
          props: { value: this.query[key] },
          style: { width: '200px', marginRight: '5px' },
          class: { 'filter-item': true },
          on: {
            input: (e) => {
              setTimeout(() => {
                this.$set(this.query, key, e)
                this.query[key] = e
              })
            }
          }
        })
      })
    },
    getColumns() {
      return this.getSlotsByType('eap-table-column')
    },
    getToolbar() {
      return this.getSlotsByType('eap-table-toolbar')
    },
    getButtons() {
      return this.getSlotsByType('eap-table-button')
    },
    isEl(item, type = null) {
      const tag = item.componentOptions && item.componentOptions.tag
      return type ? tag === type : !!tag
    },
    getSlotsByType(type) {
      const f = (item) => {
        return this.isEl(item, type)
      }
      return (this.$slots.default || []).filter(f).map((item) => ({ ...item.data.attrs }))
    },
    // 操作列按钮
    renderButtons() {
      const opConf = {
        scopedSlots: {
          default: (scope) => {
            const deft = {
              edit: { type: 'primary', name: 'edit', label: this.$t('table.edit') },
              delete: { name: 'delete', label: this.$t('table.delete'), type: 'danger' }
            }
            const creator = (conf) => {
              if (conf.name in deft) {
                conf = { ...deft[conf.name], ...conf }
                delete deft[conf.name]
              }
              if (conf.hidden || 'hidden' in conf) {
                return null
              }
              const event = this.$vnode.context[conf.name] || this[conf.name]
              const confirm = () => {
                const p = [
                  conf['tip'],
                  {
                    type: 'warning'
                  }
                ]
                if (conf['tip']) {
                  this.$confirm(...p)
                    .then((_) => {
                      event && event.apply(this, [scope.row, conf, this])
                    })
                    .catch((e) => 0)
                } else {
                  event && event.apply(this, [scope.row, conf, this])
                }
              }
              return (
                <el-button on-click={confirm.bind(this)} size='mini' icon={conf.icon} type={conf.type}>
                  {conf.label}
                </el-button>
              )
            }
            const btns = this.getButtons().map(creator)
            const deftBtns = Object.keys(deft)
              .map((key) => deft[key])
              .map(creator)
            return <div style='color: red;white-space: nowrap;'>{[...btns, ...deftBtns]}</div>
          }
        }
      }
      return (
        <el-table-column
          {...opConf}
          label={this.$t('table.actions')}
          align='center'
          class-name='small-padding fixed-width'
        ></el-table-column>
      )
    },
    renderToobar() {
      const add = {
        name: 'add',
        type: 'primary',
        icon: 'el-icon-edit',
        label: this.$t('table.add')
      }

      const batchDelete = {
        name: 'batchDelete',
        type: 'primary',
        icon: 'el-icon-delete',
        label: '批量删除'
      }
      const search = {
        name: 'search',
        type: 'primary',
        icon: 'el-icon-search',
        label: this.$t('table.search')
      }

      const deft = {
        search,
        batchDelete,
        add
      }

      const creator = (conf) => {
        if (conf.name in deft) {
          conf = { ...deft[conf.name], ...conf }
          delete deft[conf.name]
        }
        if (conf.hidden || 'hidden' in conf) {
          return null
        }
        const event = this.$vnode.context[conf.name] || this[conf.name]
        const confirm = () => {
          const p = [
            conf.tip,
            {
              type: 'warning'
            }
          ]
          if (conf['tip']) {
            this.$confirm(...p)
              .then((_) => {
                event && event.apply(this, [conf, this])
              })
              .catch((e) => 0)
          } else {
            event && event.apply(this, [conf, this])
          }
        }
        return (
          <el-button
            v-waves
            class='filter-item'
            style='margin-left: 10px;'
            on-click={confirm.bind(this)}
            icon={conf.icon}
            type={conf.type}
          >
            {conf.label}
          </el-button>
        )
      }
      const btns = this.getToolbar().map(creator)
      const deftToolbar = Object.keys(deft)
        .map((k) => deft[k])
        .map(creator)
      return [...btns, ...deftToolbar]
    }
  },

  render(h) {
    const tableConf = {
      props: { data: this.list, ...this.conf },
      style: {
        width: '100%'
      },
      key: this.tableKey,
      on: {
        select: this.onSelect,
        'select-all': this.onSelect,
        'selection-change': this.onSelect
      }
    }

    const paginationConf = {
      props: {
        'current-page': this.query.page,
        'page-sizes': [10, 20, 30, 50],
        'page-size': this.query.limit,
        total: this.total,
        background: true,
        layout: 'total, sizes, prev, pager, next, jumper'
      },
      on: {
        'update:title': (e) => (this.query.page = e),
        'size-change': this.handleSizeChange.bind(this),
        'current-change': this.refresh.bind(this)
      }
    }
    const pagination = (
      <div class='pagination-container'>
        <el-pagination {...paginationConf} />
      </div>
    )

    const getColFromSlot = () => {
      return this.getColumns().filter((i) => !i.hidden)
    }
    const newCols = [...getColFromSlot(), ...this.tableColumns]

    if (JSON.stringify(newCols) !== JSON.stringify(this.colSet)) {
      this.colSet = newCols
    }

    return (
      <div>
        <div class='filter-container'>
          {this.renderQuery(h)}
          {this.renderToobar()}
        </div>
        <el-table {...tableConf} v-loading={this.isLoading}>
          <el-table-column type='selection' width='36' />
          <el-table-column type='index' label='序号' width='50px' align='center' />
          {newCols.map((col) => {
            const conf = {
              props: { align: 'center', ...col },
              scopedSlots: {
                default: (scope) => this.renderColumn(scope.row, col)
              }
            }
            return <el-table-column {...conf} key={col.id}></el-table-column>
          })}
          {this.renderButtons()}
        </el-table>
        {pagination}
      </div>
    )
  }
}
</script>

<style>
</style>
