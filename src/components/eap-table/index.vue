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
      query: {
        page: 1,
        limit: 10,
        queryFields: this.columns.map((i) => i.name).join() + ','
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
      return this.columns.filter((i) => i.query && i.queryMode)
    }
  },
  created() {
    this.refresh(1) // 初始加载第一页
    // 初始化配置查询model
    this.queryFields.map((field) => {
      const key = `query.${field.name}||${field.condition}`
      this.$set(this.query, key, undefined)
    })
  },
  methods: {
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
      const handler = col['formatter.handler']
      if (handler && typeof this[handler] === 'function') {
        return (
          <el-button type='text' size='mini' on-click={this[handler].bind(this, row)}>
            {val}
          </el-button>
        )
      }
      const dict = col['formatter.dict'] // 字典转化
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
      const assets = [type, 'ADD', 'EDIT', 'VIEW']
      return assets.reduce((res, t) => {
        const p = this.handler[t.toLowerCase()] || this.handler[t.toUpperCase()]
        if (!res && p) {
          return p
        }
        return res
      }, '')
    },
    // 新建
    add() {
      const name = this.getRedirectPath('ADD')
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
        return h('el-' + field.queryMode, {
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

    const opConf = {
      scopedSlots: {
        default: (scope) => (
          <slot name='options'>
            {this.handler.edit !== false && (
              <el-button type='primary' size='mini' on-click={this.edit.bind(this, scope.row)}>
                {this.$t('table.edit')}
              </el-button>
            )}
            {this.handler.delete !== false && (
              <el-button type='danger' size='mini' on-click={this.delete.bind(this, scope.row)}>
                {this.$t('table.delete')}
              </el-button>
            )}
          </slot>
        )
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

    const create = (
      <el-button
        class='filter-item'
        style='margin-left: 10px;'
        type='primary'
        icon='el-icon-edit'
        on-click={this.add.bind(this)}
      >
        {this.$t('table.add')}
      </el-button>
    )

    const batchDelete = (
      <el-button
        class='filter-item'
        style='margin-left: 10px;'
        type='primary'
        icon='el-icon-delete'
        on-click={this.batchDelete.bind(this)}
      >
        批量删除
      </el-button>
    )

    const search = (
      <el-button v-waves class='filter-item' type='primary' icon='el-icon-search' on-click={this.search.bind(this)}>
        {this.$t('table.search')}
      </el-button>
    )

    return (
      <div>
        <div class='filter-container'>
          {this.renderQuery(h)}
          {this.handler.search !== false && search}
          {this.handler.create !== false && create}
          {this.handler.batchDelete !== false && batchDelete}
        </div>
        <el-table {...tableConf} v-loading={this.isLoading}>
          <el-table-column type='selection' width='36' />
          <el-table-column type='index' label='序号' width='50px' align='center' />
          {this.tableColumns.map((col) => {
            const conf = {
              props: { align: 'center', ...col },
              scopedSlots: {
                default: (scope) => this.renderColumn(scope.row, col)
              }
            }
            return <el-table-column {...conf} key={col.id}></el-table-column>
          })}
          <el-table-column
            {...opConf}
            label={this.$t('table.actions')}
            align='center'
            class-name='small-padding fixed-width'
          ></el-table-column>
        </el-table>
        {pagination}
      </div>
    )
  }
}
</script>

<style>
</style>
