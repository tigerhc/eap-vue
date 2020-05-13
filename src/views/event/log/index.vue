<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.eqpId" style="width: 200px;" class="filter-item" placeholder="请输入设备号" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.eventId" style="width: 200px;" class="filter-item" placeholder="请输入事件ID" @keyup.enter.native="handleFilter"/>
      <el-date-picker
        v-model="listQuery.startDate"
        style="width: 200px;"
        class="filter-item"
        type="datetime"
        placeholder="选择开始时间"/>
      <el-date-picker
      v-model="listQuery.endDate"
style="width: 200px;"
      class="filter-item"
      type="datetime"
      placeholder="选择结束时间"/>
      <br>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button :loading="downloadLoading" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      element-loading-text="给我一点时间"
      border
      fit
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="50px" align="center"/>

      <el-table-column align="center" label="设备号" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.eqpId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="事件ID" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.eventId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="描述" >
        <template slot-scope="scope">
          <span>{{ scope.row.eventDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="事件参数" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.eventParams }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.startDate }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="结束时间">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.endDate }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="创建时间">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.createDate }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
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
import { fetchList, exportLoginLog } from '@/api/public'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'EventLog',
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
      eqpModelNameList: [],
      downloadLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        eqpId: undefined,
        eventId: undefined,
        startDate: '',
        endDate: ''
      },
      tab: '/edc/edcevtrecord/'
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
        'sort.startDate': 'desc',
        'page.pn': obj.page,
        'page.size': obj.limit,
        'query.eqpId||like': obj.eqpId || '',
        'query.eventId||like': obj.eventId || '',
        'query.startDate||ge': obj.startDate || '',
        'query.endDate||le': obj.endDate || '',
        'queryFields': 'id,eqpId,eventDesc,eventId,eventParams,startDate,endDate,createDate,'
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
    handleDownload() {
      this.downloadLoading = false
      exportLoginLog(this.tab, this.listQuery).then(response => {
        this.downloadLoading = true
        if (response.data.code === 0) {
          import('@/vendor/Export2Excel').then(excel => {
            excel.export_byte_to_excel(response.data.bytes, response.data.title)
            this.downloadLoading = false
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg,
            duration: 2000
          })
        }
      })
    }
  }
}
</script>
