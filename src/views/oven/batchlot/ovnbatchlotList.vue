<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.eqpId" style="width: 200px;" class="filter-item" placeholder="请输入设备" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.officeName" style="width: 200px;" class="filter-item" placeholder="请输入站别" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.lotId" style="width: 200px;" class="filter-item" placeholder="请输入批次" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      element-loading-text="给我一点时间"
      border
      fit
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @select="chooseOne"
      @select-all="chooseAll">
      <el-table-column type="index" label="序号" width="50px" align="center"/>
      <el-table-column align="left" show-overflow-tooltip label="批次号">
        <template slot-scope="scope">
          <span class="textLink" @click="handleOperating(scope.row)">{{ scope.row.lotId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="站别">
        <template slot-scope="scope">
          <span>{{ scope.row.officeName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备号">
        <template slot-scope="scope">
          <span>{{ scope.row.eqpId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="程序名">
        <template slot-scope="scope">
          <span>{{ scope.row.recipeCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="作业开始时间">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="作业结束时间">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination
        :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { fetchList, fetchEcharts } from '@/api/oven/temperature'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'MachineTpye',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      multipleSelection: [], // 存放选中的值
      listQuery: {
        page: 1,
        limit: 10,
        lotId: undefined,
        officeName: undefined,
        eqpId: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const params = this.changeParams(this.listQuery)
      fetchList(this.tab, params).then(response => {
        this.list = response.data.results
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 转换入参
    changeParams(obj) {
      const params = {
        'sort.startTime': 'desc',
        'page.pn': obj.page,
        'page.size': obj.limit,
        'query.eqpId||like': obj.eqpId || '',
        'query.lotId||like': obj.lotId || '',
        'query.officeName||like': obj.officeName || '',
        'queryFields': 'id,eqpId,officeName,lotId,recipeCode,startTime,endTime,activeFlag,'
      }
      return params
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    // 选中触发事件
    handleSelectionChange(row) {
      this.multipleSelection = row
    },
    // 选中checkbox，取消选中。
    // 此处返回的是以选中的row
    chooseOne(row) {
      this.multipleSelection = row
    },
    // 全选
    chooseAll(row) {
      this.multipleSelection = row
    },
    handleOperating(item) {
      this.$router.push({
        name: 'views/oven/batchlot/ovnbatchlotView',
        query: {
          id: item.id,
          list: item
        }})
    }
  }
}
</script>
