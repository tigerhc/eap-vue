<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.paraName" style="width: 200px;" class="filter-item" placeholder="请输入参数名称" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.paraShortName" style="width: 200px;" class="filter-item" placeholder="请输入参数简称" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
    </div>
    <!-- <div class="message">
       <div class="title">基本信息</div>
       <el-form :model="modelList" class="modelForm" label-width="150px">
         <el-form-item label="机台型号">
          <el-input :disabled="true" v-model="modelList.bcCode"/>
        </el-form-item>
        <el-form-item label="型号描述" >
          <el-input :disabled="true" v-model="modelList.ip"/>
        </el-form-item>
       </el-form>
    </div> -->
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
      <el-table-column align="center" label="参数代码">
        <template slot-scope="scope">
          <el-input v-model="scope.row.paraCode"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参数名">
        <template slot-scope="scope">
          <el-input v-model="scope.row.paraName"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参数简称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.paraShortName"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单位">
        <template slot-scope="scope">
          <el-input v-model="scope.row.paraUnit"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设定值">
        <template slot-scope="scope">
          <el-input v-model="scope.row.setValue"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否首页显示">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.showFlag"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否监控">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.monitorFlag"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序号">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sortNo"/>
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
import { fetchList, create, update, del, deteils, batchDelete } from '@/api/public'
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
      tab: '/rms/rmsrecipetemplate/',
      listQuery: {
        page: 1,
        limit: 10,
        eqpModelId:'',
        paraName: undefined,
        paraShortName: undefined,
      }
    }
  },
  created() {
    this.item = this.$route.query.item
    this.listQuery.eqpModelId = this.item.id
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
        'eqpModelId':obj.eqpModelId,
        'page.size': obj.limit,
        'sort.sortNo': 'desc',
        'query.paraName||like': obj.paraName || '',
        'query.paraShortName||like': obj.paraShortName || '',
        'queryFields': 'id,paraCode,paraName,paraShortName,eqpModelId,eqpModelName,paraCodeparaUnit,setValue,limitMin,limitMax,limitType,monitorFlag,paraLevel,paraDataType,showFlag,activeFlag,updateDate,'
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



