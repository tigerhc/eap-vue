<template>
  <div>
    <el-table
      v-loading="isLoading"
      v-bind="conf"
      :key="tableKey"
      :data="list"
      style="width: 100%"
      @selection-change="onSelect"
      @select="onSelect"
      @select-all="onSelect"
    >
      <slot />
    </el-table>
    <div class="pagination-container">
      <el-pagination
        :current-page.sync="query.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="query.limit"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="refresh"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EapTable',
  props: {
    tableConf: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data: function() {
    return {
      isLoading: false,
      query: {
        page: 1,
        limit: 10
      },
      total: 0,
      list: [],
      tableKey: Math.random()
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
    }
  },
  created() {
    this.refresh(1) // 初始加载第一页
  },
  methods: {
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
      this.$parent.getList(this.getParams(query)).then((resp) => {
        this.list = resp.data.results
        this.total = resp.data.total
        this.isLoading = false
      })
    },
    getParams(query) {
      return this.$parent.getParams(query)
    },
    onSelect(row) {
      this.$emit('select', row)
    }
  }
}
</script>

<style>
</style>
