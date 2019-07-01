<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.paraName" style="width: 200px;" class="filter-item" placeholder="请输入参数名称" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.paraShortName" style="width: 200px;" class="filter-item" placeholder="请输入参数简称" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
    </div>
    <div class="message">
       <div class="title">基本信息</div> 
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
      <el-table-column type="selection" width="36" />
      <el-table-column type="index" label="序号" width="50px" align="center"/>
      <el-table-column align="center" label="设备厂家">
        <template slot-scope="scope">
          <span class="textLink" @click="openDeteils(scope.row)">{{ scope.row.manufacturerName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备类型">
        <template slot-scope="scope">
          <span>{{ scope.row.classCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="有效标志">
        <template slot-scope="scope">
          <span v-if="scope.row.activeFlag == 1">有效</span>
          <span v-else>无效</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateDate }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
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
import { fetchDeviceList, addDevice, updateDevice, deleteDevice, batchDelete } from '@/api/sys/device'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'ovenEditModel',
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
      item:{},
      listQuery: {
        page: 1,
        limit: 10,
        paraName: undefined,
        paraShortName: undefined,
        sort: 'updateDate'
      }
    }
  },
  created() {
    this.item = this.$route.query.item
   // this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const params = this.changeParams(this.listQuery)
      fetchDeviceList(params).then(response => {
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
        'query.manufacturerName||like': obj.manufacturerName || '',
        'query.classCode||like': obj.classCode || '',
        'queryFields': 'id,manufacturerName,classCode,smlPath,hostJavaClass,activeFlag,iconPath,updateDate,'
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
    
    },
    handleUpdate(){
        
    }
  }
}
</script>
<style lang="scss" scoped>
.message {
    .title {
        height: 50px;
        color: #409eff;
        font-size: 24px;
        border-bottom: 1px solid #eee;
    }
}
</style>



