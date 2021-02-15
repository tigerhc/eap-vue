<script>
import api from './fetch'

// function remove(val) {
//   var index = this.indexOf(val)
//   if (index > -1) {
//     this.splice(index, 1)
//   }
// }
export default {
  name: 'WTable',
  props: {
    // 数据来源不通过接口获取，直接外部传入
    datas: {
      type: Array,
      default: null
    },
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
      default: ''
    },
    onloadsuccess: {
      type: Function,
      default: function(i) {
        return i
      }
    },
    opHide: {
      type: Boolean,
      default: null
    },
    hiddenquery: {
      type: Boolean,
      default: false
    },
    hiddenQuery: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 10
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
      multipleSelection: [],
      sortQuery: { ascs: [], descs: [] },
      defaultSortQuery: { ascs: [], descs: [] },
      toolbarStatus: {
        exportsLoading: false
      },
      single: null,
      searchOnly: null
    }
  },
  computed: {
    conf: function() {
      return {
        border: true,
        'element-loading-text': '给我一点时间',
        fit: true,
        'class': 'jk-table-container',
        'cell-class-name': 'jk-table-column',
        'header-cell-class-name': 'jk-table-column',
        ...this.tableConf
      }
    },
    tableColumns: function() {
      return this.columns.filter((i) => !i.hidden)
    },
    queryFields: function() {
      return this.colSet.filter((i) => i.query || i.query === '')
    },
    queryName: function() {
      return this.colSet.map((i) => i.name).join() + ','
    }
  },
  watch: {
    datas: function(val) {
      if (Array.isArray(val)) {
        this.list = val
      } else {
        this.list = []
      }
    },
    colSet: function(n, o) {
      if (n && n.length) {
        this.doFetchData()
      }
    },
    limit: function() {
      this.query.limit = this.limit
    },
    '$route'() {
      this.getDatas()
    }
  },
  created() {},
  mounted() {
    this.moreQuery()
  },
  methods: {
    doFetchData() {
      // 初始化配置查询model
      this.queryFields.map((field) => {
        const key = `query.${field.name}||${field.condition}`
        this.$set(this.query, key, undefined)
      })
      this.refresh(1) // 初始加载第一页
    },
    renderColumn(row, col) {
      const foldcolor = col.foldcolor
      const val = row[col.name]
      if (col.formatter && typeof col.formatter === 'function') {
        return col.formatter(val, col, this, row)
      }
      const handler = col['formatter.handler'] || col['handler']

      if (
      // !this.opHide &&
        handler &&
          (typeof this.$vnode.context[handler] === 'function' || typeof this[handler] === 'function')
      ) {
        const h = this[handler] || this.$vnode.context[handler]
        const fn = () => {
          if (col.tip) {
            this.$confirm(col.tip).then(
              () => {
                h && h.call(this, row, col, this)
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
        if (foldcolor) {
          if (val === 'Y' || val === '1') {
            return <el-button type = 'success' plain> {(v && v.label) || val}</el-button>
          }
          if (val === 'N' || val === '0') {
            return <el-button type = 'danger' plain> {(v && v.label) || val}</el-button>
          }
        }
        return (v && v.label) || val
      }
      return val
    },
    handleSizeChange(limit) {
      this.query.limit = limit
      this.getList(this.query)
    },
    refresh(page = 1) {
      this.query.page = page
      this.query.limit = this.limit
      this.query.queryFields = this.queryName
      this.getList(this.query)
    },
    // 调用api 获取数据
    getList(query) {
      // 外部直接传入数据 无需求情api。 不开启分页，不开启搜索查询
      if (this.datas) {
        this.list = this.datas
        return
      }
      this.isLoading = true
      this.api
        .ajaxList(this.getParams(query))
        .then((resp) => {
          this.list = resp.results.map((item) => this.onloadsuccess(item))
          this.total = resp.total
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    // 请求api 参数封装
    getParams(query) {
      query = { ...query }
      Object.keys(query).map((i) => {
        Array.isArray(query[i]) && (query[i] = query[i].toString())
      })
      const { page, limit, ...rest } = this.query
      const sortA = this.sortQuery.ascs.reduce((res, prop) => {
        res[`sort${prop}`] = 'asc'
        return res
      }, {})
      const sortD = this.sortQuery.descs.reduce((res, prop) => {
        res[`sort${prop}`] = 'desc'
        return res
      }, {})
      const defaultSort = this.sort.split(',')
      let dft = defaultSort.map((item) => {
        const [fd, order] = item.split('.')
        if (!fd) {
          return {}
        }
        console.info(fd, order)
        const exist = Object.keys(sortA).find((k) => k.includes(fd)) || Object.keys(sortD).find((k) => k.includes(fd))
        if (exist) {
          return {}
        }
        return { [`sort.${fd}`]: order || 'desc' }
      })
      dft = Object.assign.apply({}, dft)
      Object.keys(rest).map((key) => {
        const v = rest[key]
        if (Array.isArray(v)) {
          rest[key] = v.join(',')
        }
      })
      if (Object.keys(sortA).length || Object.keys(sortD).length) {
        dft = {}
      }
      return {
        'page.pn': page,
        'page.size': limit,
        // sort: this.sort,
        ...dft,
        ...rest,
        ...sortA,
        ...sortD
      }
    },
    // 表格数据选中
    onSelect(row) {
      this.$emit('select', row)
      this.multipleSelection = row
    },
    fdis() {
      // eslint-disable-next-line no-unused-vars
      var a = this.multipleSelection.map((i) => i.id).join(',')
      return a
    },
    // 删除行数据
    delete(row) {
      const p = [
        '此操作将永久删除数据, 是否继续?',
        '提示',
        {
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
          type: 'ADD',
          t: ~~(Math.random() * 1e3)
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
          type: 'EDIT',
          param: item
        }
      })
    },
    view(item) {
      const name = this.getRedirectPath('VIEW')
      if (!name) {
        throw Error('未设置查看跳转路径')
      }
      this.$router.push({
        name, // 'views/fab/eqpmodel/addDevice',
        query: {
          id: item.id,
          type: 'VIEW',
          param: item
        }
      })
    },
    // 导出
    exports() {
      if (this.toolbarStatus.exportsLoading) {
        return
      }
      this.toolbarStatus.exportsLoading = true
      const q = this.getParams(this.query)
      this.api
        .export(q)
        .then((response) => {
          if (response.code === 0) {
            return import('@/vendor/Export2Excel').then((excel) => {
              excel.export_byte_to_excel(response.bytes, response.title)
              this.toolbarStatus.exportsLoading = false
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: (response && response.errmsg) || '导出失败!',
              duration: 2000
            })
            this.toolbarStatus.exportsLoading = false
          }
        })
        .catch((e) => {
          this.toolbarStatus.exportsLoading = false
        })
    },
    // 重置搜索表单
    reset() {},
    // 搜索
    search() {
      if (this.datas) {
        this.$parent.query(this.query)
        return
      }
      this.refresh()
    },
    clean() {
      this.queryFields.map((field) => {
        const key = `query.${field.name}||${field.condition}`
        this.$set(this.query, key, undefined)
      })
    },
    more() {
      this.hiddenQuery = !this.hiddenQuery
    },
    queryModeCreator(mode = 'input', conf) {
      const re = { ...conf }
      const r = mode
      if ('dict' in conf) {
        mode = 'w-select'
      }
      if ('eqp' in conf) {
        mode = 'w-select-eqp'
        // re.str = conf.value ? conf.value : []
      }
      if ('line' in conf) {
        mode = 'w-select-line'
        // re.str = conf.value ? conf.value : []
      }
      if (conf.dict && typeof conf.dict === 'string') {
        mode = 'w-select-dic'
      }
      if (mode === 'date') {
        mode = 'el-date-picker'
        if (re.condition === 'between') {
          re.type = 'daterange'
          re.valueFormat = 'yyyy-MM-dd'
          re.rangeSeparator = '-'
          re.startPlaceholder = conf.label + '起'
          re.endPlaceholder = conf.label + '止'
        }
      }
      // 默认使用element 组件
      if (r === mode) {
        mode = 'el-' + mode
      }
      return { mode, ...re }
    },
    // 判断是否要添加更多按钮
    moreQuery() {
      this.queryFields.map((field) => {
        if ('hiddenquery' in field) {
          this.hiddenquery = true
        }
      })
    },
    // 生成查询条件表单
    renderQuery(h) {
      return this.queryFields.map((field) => {
        const key = `query.${field.name}||${field.condition}`
        // 处理其他控件
        const { mode, ...newConf } = this.queryModeCreator(field.querymode, field)
        console.info(newConf)
        return h(mode, {
          attrs: { placeholder: newConf.label, ...newConf },
          props: { value: this.query[key], ...newConf },
          style: this.hiddenQuery ? { width: newConf.condition === 'between' ? '250px' : '200px', display: newConf.hiddenquery ? 'none' : '', marginRight: '5px' } : { width: newConf.condition === 'between' ? '250px' : '200px', marginRight: '5px' },
          class: { 'filter-item': true },
          on: {
            input: (e) => {
              if (mode === 'w-select-eqp') {
                console.info('ss->' + e)
                this.$set(this.query, key, e)
                this.query[key] = e
                // if (e == null || e === undefined || e.length <= 0) {
                //   this.$set(this.query, key, '')
                //   this.query[key] = ''
                // } else {
                //   this.$set(this.query, key, e.join(','))
                //   this.query[key] = e.join(',')
                // }
              } else if (mode === 'w-select-line') {
                console.info('ss->' + e)
                this.$set(this.query, key, e)
                this.query[key] = e
              } else {
                setTimeout(() => {
                  this.$set(this.query, key, e)
                  this.query[key] = e
                })
              }
            }
          }
        })
      })
    },
    getColumns() {
      return this.getSlotsByType('w-table-col', { row: {}})
    },
    getToolbar() {
      return this.getSlotsByType('w-table-toolbar', { row: {}})
    },
    getButtons(scope) {
      return this.getSlotsByType('w-table-button', scope)
    },
    isEl(item, type = null) {
      const tag = item.componentOptions && item.componentOptions.tag
      return type ? tag === type : !!tag
    },
    getSlotsByType(type, scope = { row: {}}) {
      const f = (item) => {
        return this.isEl(item, type)
      }
      let slots = this.$slots.default || []
      if (typeof this.$scopedSlots.default === 'function') {
        slots = this.$scopedSlots.default(scope)
      }

      return slots.filter(f).map((item) => {
        const re = { ...item.data.attrs }
        Object.keys(re).map((key) => {
          re[key] = re[key] === '' ? true : re[key]
        })
        // if (re.sort === 'desc') {
        //   this.defaultSortQuery.descs.push()
        // }
        return re
      })
    },
    // 操作列按钮
    renderButtons(deftConf) {
      if (this.opHide) {
        return null
      }
      const opConf = {
        props: {
          ...deftConf,
          fixed: deftConf.fixed === true ? 'right' : deftConf.fixed,
          align: 'center'
        },
        scopedSlots: {
          default: (scope) => {
            const deft = {
              edit: { type: 'primary', icon: 'el-icon-edit', name: 'edit', label: this.$t('table.edit') },
              delete: { name: 'delete', icon: 'el-icon-delete', label: this.$t('table.delete'), type: 'danger' }
            }
            const confMerge = (conf) => {
              // console.info(conf)
              if (conf.name in deft) {
                // conf = { ...deft[conf.name], ...conf }
                Object.assign(deft[conf.name], conf)
                // delete deft[conf.name]
                return false
              }
              return true // doRender(conf)
            }
            const doRender = (conf) => {
              if (isHidden(conf)) {
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
                <el-button
                  circle={!!conf.icon && !conf.fold}
                  title={conf.label}
                  on-click={confirm.bind(this)}
                  size='mini'
                  icon={conf.icon}
                  type={conf.type}
                >
                  {!conf.icon || (conf.fold && conf.label)}
                </el-button>
              )
            }
            const btns = this.getButtons(scope).filter(confMerge)
            // .map(doRender)
            const deftBtns = Object.keys(deft).map((key) => deft[key])
            // .map(doRender)

            const allBtns = [...btns, ...deftBtns]
            const foldBtns = allBtns.filter((i) => i.fold).map(doRender)
            const unfoldBtns = allBtns.filter((i) => !i.fold).map(doRender)
            const pop = !!foldBtns.length && (
              <el-popover placement='right' popper-class='unfold-pop' trigger='hover'>
                {foldBtns.map((b, i) => [i > 0 && <p />, b])}
                <el-button size='mini' slot='reference' icon='el-icon-more' circle />
              </el-popover>
            )

            return (
              <div style=''>
                {[...unfoldBtns]}&nbsp;&nbsp;
                {pop}
              </div>
            )
          }
        }
      }
      return <el-table-column {...opConf} width='200' label={this.$t('table.actions')} class-name='small-padding fixed-width' />
    },
    renderToobar() {
      const add = {
        name: 'add',
        type: 'primary',
        icon: 'el-icon-circle-plus-outline',
        label: this.$t('table.add')
      }

      const batchDelete = {
        name: 'batchDelete',
        icon: 'el-icon-delete',
        label: '批量删除',
        type: 'danger'
      }
      const search = {
        name: 'search',
        type: 'primary',
        icon: 'el-icon-search',
        label: this.$t('table.search')
      }
      const exports = {
        name: 'exports',
        icon: 'fa-download',
        type: 'success',
        label: this.$t('table.export')
      }
      const clean = {
        name: 'clean',
        icon: 'el-icon-refresh',
        type: 'primary',
        label: '清空'
      }
      const more = {
        name: 'more',
        icon: 'el-icon-rank',
        type: 'primary',
        label: '更多'
      }

      const deft = this.hiddenquery ? {
        search,
        more,
        clean,
        batchDelete,
        add,
        exports
      } : {
        search,
        clean,
        batchDelete,
        add,
        exports
      }

      const creator = (conf) => {
        // console.info(conf.name)
        if (conf.name in deft) {
          conf = { ...deft[conf.name], ...conf }
          delete deft[conf.name]
        }
        if (isHidden(conf)) {
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
          if (conf.tip) {
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
            loading={this.toolbarStatus.exportsLoading && conf.name === 'exports'}
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
        .filter((i) => {
          return this.searchOnly ? i === 'search' : true
        })
        .map((k) => deft[k])
        .map(creator)
      const re = [...deftToolbar, ...btns]
      if (this.searchOnly) {
        return [...deftToolbar]
      }
      return re
    }
  },

  render(h) {
    const confCache = {}
    const tableConf = {
      props: { data: this.list, ...this.conf },
      style: {
        width: '100%',
        height: this.hiddenQuery ? 'calc(100vh - 84px - 96px - 42px - 1px )' : 'calc(100vh - 84px - 96px - 42px - 46px - 1px )'
      },
      key: this.tableKey,
      ref: 'table',
      on: {
        'cell-dblclick': (row, column, cell, event) => {
          this.$refs.table.toggleRowSelection(row)
        },
        select: this.onSelect,
        'select-all': this.onSelect,
        'selection-change': this.onSelect,
        'sort-change': ({ column, prop, order }) => {
          if (!prop) {
            this.sortQuery.descs = []
            this.sortQuery.ascs = []
          } else {
            const sortNum = +confCache[prop].sort
            prop = `${sortNum}.${prop}`
            if (order === 'descending' && !this.sortQuery.descs.includes(prop)) {
              this.sortQuery.descs = [prop] // .push(prop)
              // remove.bind(this.sortQuery.ascs)(prop)
            }
            if (order === 'ascending' && !this.sortQuery.ascs.includes(prop)) {
              this.sortQuery.ascs = [prop] // .push(prop)
              // remove.bind(this.sortQuery.descs)(prop)
            }
          }
          this.refresh()
        }
      }
    }

    const paginationConf = {
      props: {
        'current-page': this.query.page,
        'page-sizes': [10, 20, 100, 500, 1000],
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
      return this.getColumns() // .filter((i) => !isHidden(i))
    }
    const newCols = [...getColFromSlot(), ...this.tableColumns]

    if (JSON.stringify(newCols) !== JSON.stringify(this.colSet)) {
      this.colSet = newCols
    }
    const selection = {
      type: 'selection',
      width: '40'
    }
    const index = {
      type: 'index',
      label: '序号',
      width: '50px',
      align: 'center',
      fixed: true
    }
    const op = {}
    const deft = {
      selection,
      index,
      op
    }
    const renderCol = newCols.map((col) => {
      if (col.hidden) {
        return null
      }
      confCache[col.name] = col
      if (col.name in deft) {
        Object.assign(deft[col.name], col)
        return null
      }

      const conf = {
        props: { align: 'center', ...col, prop: col.name, sortable: col.sort || col.sort === '' },
        scopedSlots: {
          default: (scope) => {
            return this.renderColumn(scope.row, col)
          }
        }
      }
      return <el-table-column {...conf} key={col.id} />
    })
    const renderDeft = Object.keys(deft).map((key) => {
      if (key === 'op') {
        return null
      }
      const conf = deft[key]
      if (!conf) {
        return null
      }
      const atr = {
        props: { ...conf }
      }
      return <el-table-column {...atr} />
    })
    const allCols = [...renderDeft, ...renderCol, deft.op && this.renderButtons(deft.op)]
    return (
      <div>
        <div class='filter-container'>
          {this.renderQuery(h)}
          {this.renderToobar()}
        </div>
        <el-table {...tableConf} v-loading={this.isLoading}>
          {allCols}
        </el-table>
        {pagination}
      </div>
    )
  }
}

function isHidden(conf) {
  return conf.hidden || conf.hidden === ''
}
</script>

<style lang="scss">
  .unfold-pop {
    min-width: unset;
    background-color: #ffe;
  }
  .el-table--medium td.jk-table-column, .el-table--medium th.jk-table-column{
    padding: 5px 0px;
  }
  .jk-table-container {
    min-height: calc(100vh - 84px) ;
  }
  /*96.4px 所以后面又减了1*/
  /*.el-table{*/
  /*  min-height: calc(100vh - 84px - 96px - 42px - 1px ) ;*/
  /*  max-height: calc(100vh - 84px - 96px - 42px - 1px ) ;*/
  /*}*/
</style>
