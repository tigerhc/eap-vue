<script>
import api from './fetch'
import scrollTo from './scroll'
import mixins from '../eap-form/mixins'
const ADDID = -1
export default {
  name: 'WEdtTable',
  mixins: [mixins],
  props: {
    // -------------------
    // 数据来源不通过接口获取，直接外部传入

    datas: {
      type: Array,
      default: null
    },
    rules: {
      type: Object,
      default: null
    },
    model: {
      type: Object,
      default: function() {
        return {}
      }
    },
    beforeSubmit: {
      type: Function,
      default: (v) => v
    },
    onLoadData: {
      type: Function,
      default: (v) => v
    },
    // -------------------
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
      default: ''
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
    opHide: {
      type: Boolean,
      default: null
    },
    onloadsuccess: {
      type: Function,
      default: function(i) {
        return i
      }
    },
    limit: {
      type: Number,
      default: 10
    },
    params: {
      type: Object,
      default: function() {
        return {}
      }
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
      // opHide: null, // 隐藏操作列
      searchOnly: null,
      colChildrenSet: {}, // 存放对应name 的 列的children；
      editId: '', // 正在编辑的id -1 表示新增
      restoreModel: {}
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
      return this.colSet.filter((i) => i.query || i.query === '')
    },
    queryName: function() {
      return this.colSet.map((i) => i.name).join() + ','
    },
    isDatasMode: function() {
      return !!this.datas
    }
  },
  watch: {
    colSet: function(n, o) {
      if (n && n.length) {
        this.doFetchData()
      }
    },
    datas: function(val) {
      if (Array.isArray(val)) {
        this.list = val
      } else {
        this.list = []
      }
    },
    params: function() {
      Object.keys(this.params).forEach((k) => {
        this.$set(this.query, 'query.' + k + '||eq', this.params[k])
      })
      this.doFetchData()
    },
    limit: function() {
      this.query.limit = this.limit
    }
  },
  created() {
    // this.opHide = this.readonlyMode
  },
  mounted() {
    this.restoreModel = JSON.parse(JSON.stringify(this.model))
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
      const val = row[col.name]
      if (col.formatter && typeof col.formatter === 'function') {
        return col.formatter(val, col, this, row)
      }
      const handler = col['formatter.handler'] || col['handler']

      if (
        !this.opHide &&
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
      this.query.queryFields = this.queryName
      this.getList(this.query)
    },
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
    onSelect(row) {
      this.$emit('select', row)
      this.multipleSelection = row
    },
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
          if (this.isDatasMode) {
            const i = this.list.indexOf(row)
            this.list.splice(i, 1)
            return
          }
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
    clean() {
      this.queryFields.map((field) => {
        const key = `query.${field.name}||${field.condition}`
        this.$set(this.query, key, undefined)
      })
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

            if (this.isDatasMode) {
              this.multipleSelection.map((row) => {
                const i = this.list.indexOf(row)
                this.list.splice(i, 1)
              })
              return
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
    // 修改保存
    save(row) {
      if (this.isDatasMode) {
        Object.assign(row, this.model)
        this.cancel()
        return
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.api.update(this.model).then((res) => {
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
        } else {
          return false
        }
      })
    },
    cancel() {
      this.editId = ''
      Object.assign(this.model, this.restoreModel)
      this.getList()
    },
    // 行新建
    create() {
      if (this.isDatasMode) {
        this.list.pop()
        this.list.push({ __id: Math.random(), ...this.model })
        this.cancel()
        return
      }
      this.api.create(this.model).then((res) => {
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
    createCancel() {
      this.list.pop()
      this.cancel()
    },
    // 获取表格数据
    getTableList() {
      return this.list
    },
    // 转换数据格式
    tranformData(key) {
      return this.list.reduce((re, item, i) => {
        Object.keys(item).forEach((k) => {
          re[`${key}[${i}].${k}`] = item[k]
        })
        return re
      }, {})
    },
    // 新建按钮 表格最后一行新增编辑
    add({ url }) {
      if (this.editId) {
        return
      }
      this.editId = ADDID
      this.list.push({ __id: ADDID })
      scrollTo('#test')
    },
    // 编辑编辑按钮
    edit(item, flag) {
      this.editId = item.id || item.__id
      Object.assign(this.model, item)
    },
    view(item) {
      const name = this.getRedirectPath('VIEW')
      if (!name) {
        throw Error('未设置查看跳转路径')
      }
      this.$router.push({
        name,
        query: {
          id: item.id,
          type: 'VIEW'
        }
      })
    },
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
      this.refresh()
    },
    queryModeCreator(mode = 'input', conf) {
      const re = { ...conf }
      const r = mode
      if ('dict' in conf) {
        mode = 'w-select'
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
    renderQuery(h) {
      return this.queryFields.map((field) => {
        const key = `query.${field.name}||${field.condition}`
        // 处理其他控件
        const { mode, ...newConf } = this.queryModeCreator(field.querymode, field)
        return h(mode, {
          attrs: { placeholder: newConf.label, ...newConf },
          props: { value: this.query[key], ...newConf },
          style: { width: newConf.condition === 'between' ? '250px' : '200px', marginRight: '5px' },
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
        const children = item.componentOptions && item.componentOptions.children
        const re = { ...item.data.attrs }
        Object.keys(re).map((key) => {
          re[key] = re[key] === '' ? true : re[key]
        })
        if (children && re.name) {
          this.$set(this.colChildrenSet, re.name, children)
        }
        return re
      })
    },

    buttonrender(scope) {
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
      return doRender
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
          align: 'center',
          type: '__op'
        },
        scopedSlots: {
          default: (scope) => {
            let deft = {
              edit: { type: 'primary', icon: 'el-icon-edit', name: 'edit', label: this.$t('table.edit') },
              delete: { name: 'delete', icon: 'el-icon-delete', label: this.$t('table.delete'), type: 'danger' }
            }

            // 行编辑
            if (this.editId && (this.editId === scope.row.id || this.editId === scope.row.__id)) {
              deft = {
                save: { type: 'primary', icon: 'el-icon-check', name: 'save', label: this.$t('table.confirm') },
                cancel: { name: 'cancel', icon: 'el-icon-close', label: this.$t('table.cancel'), type: '' }
              }
            }
            // 行新增
            if (this.editId && this.editId === ADDID) {
              deft = {
                save: { type: 'primary', icon: 'el-icon-check', name: 'create', label: this.$t('table.confirm') },
                cancel: { name: 'createCancel', icon: 'el-icon-close', label: this.$t('table.cancel'), type: '' }
              }
              // return (
              //   <div>
              //     {Object.values(deft).map((conf) => {
              //       return this.buttonrender({ row: {}})(conf)
              //     })}
              //   </div>
              // )
            }
            const confMerge = (conf) => {
              if (conf.name in deft) {
                Object.assign(deft[conf.name], conf)
                return false
              }
              return true // doRender(conf)
            }
            const btns = this.getButtons(scope).filter(confMerge)
            // .map(doRender)
            const deftBtns = Object.keys(deft).map((key) => deft[key])
            // .map(doRender)

            const allBtns = [...btns, ...deftBtns]
            const foldBtns = allBtns.filter((i) => i.fold).map(this.buttonrender(scope))
            const unfoldBtns = allBtns.filter((i) => !i.fold).map(this.buttonrender(scope))
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
      return <el-table-column {...opConf} label={this.$t('table.actions')} class-name='small-padding fixed-width' />
    },
    renderToobar() {
      if (this.readonlyMode) {
        return null
      }
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

      const deft = {
        search,
        batchDelete,
        add,
        exports,
        clean
      }

      if (this.isDatasMode) {
        delete deft.search
        delete deft.exports
      }

      const creator = (conf) => {
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
            size='mini'
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
      props: {
        showSummary: false, // this.editId === null,
        data: this.list,
        ...this.conf
      },
      style: {
        width: '100%'
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
            }
            if (order === 'ascending' && !this.sortQuery.ascs.includes(prop)) {
              this.sortQuery.ascs = [prop] // .push(prop)
            }
          }
          this.refresh()
        }
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
      return this.getColumns() // .filter((i) => !isHidden(i))
    }
    const newCols = [...getColFromSlot(), ...this.tableColumns]
    if (JSON.stringify(newCols) !== JSON.stringify(this.colSet)) {
      this.colSet = newCols
    }
    // 列默认值设置
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
            // 编辑模式
            if ((this.editId === scope.row.id || this.editId === scope.row.__id) && this.colChildrenSet[col.name]) {
              return <el-form-item prop={col.name}>{this.colChildrenSet[col.name]}</el-form-item>
            }
            // 显示模式
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
          {!this.isDatasMode && this.renderQuery(h)}
          {this.renderToobar()}
        </div>
        <el-form ref='form' model={this.model} rules={this.rules}>
          <el-table {...tableConf} v-loading={this.isLoading}>
            {allCols}
          </el-table>
        </el-form>
        <span id='test' />
        {!this.isDatasMode && pagination}
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
</style>
