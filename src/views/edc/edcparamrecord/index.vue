<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.eqpId" style="width: 200px;"  placeholder="请输入设备号" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.bizSubType" style="width: 200px;"  placeholder="请输入业务小类" @keyup.enter.native="handleFilter"/>
      <el-date-picker
      v-model="listQuery.bizDate"
      value-format="yyyy-MM-dd HH:mm:ss"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
      <el-button v-waves  type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
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
      <el-table-column align="center" label="设备号">
        <template slot-scope="scope">
          <span class="textLink" @click="openDeteils(scope.row)">{{ scope.row.eqpId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="采集日期">
        <template slot-scope="scope">
          <span>{{ scope.row.bizDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="业务大类">
        <template slot-scope="scope">
          <span>{{ scope.row.bizType | dictLabel('EDC_BIZ_TYPE')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="业务小类">
        <template slot-scope="scope">
          <span>{{ scope.row.bizSubType | dictLabel('EDC_BIZ_SUB_TYPE')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.createByName }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>-->
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
import { fetchList } from '@/api/public'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'edcparamrecord',
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
      tab: '/edc/edcparamrecord/',
      listQuery: {
        page: 1,
        limit: 10,
        bizSubType: undefined,
        eqpId: undefined,
        bizDate:undefined,
        sort: 'updateDate'
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
      fetchList(this.tab,params).then(response => {
        this.list = response.data.results
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 转换入参
    changeParams(obj) {
      const params = {
        'sort': 'updateDate',
        'page.pn': obj.page,
        'page.size': obj.limit,
        'query.eqpId||like': obj.eqpId || '',
        'query.bizSubType||like': obj.bizSubType || '',
        'queryFields': 'id,eqpId,bizType,bizSubType,bizDate,createByName,'
      }
      if(obj.bizDate){
        params['query.bizDate||ge'] = obj.bizDate?obj.bizDate[0]:'';
        params['query.bizDate||lt'] = obj.bizDate?obj.bizDate[1]:'';
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
    openDeteils(item) {
      this.$router.push({ name: 'views/edc/edcparamrecord/recordDeteils',
        query: { id: item.id }
      })
    },
    handleUpdate(item){
        this.$router.push({ name: 'views/edc/edcparamrecord/recordDeteils',
        query: { id: item.id }
      })
    }
  }
}
</script>
