<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.paraName" style="width: 200px;" class="filter-item" placeholder="请输入参数名称" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.paraShortName" style="width: 200px;" class="filter-item" placeholder="请输入参数简称" @keyup.enter.native="handleFilter"/>
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
      >
      <el-table-column type="index" label="序号" width="50px" align="center"/>
      <el-table-column align="center" label="参数代码">
        <template slot-scope="scope">
          <el-input readonly v-model="scope.row.paraCode"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参数名">
        <template slot-scope="scope">
          <el-input readonly v-model="scope.row.paraName"/>
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
    <div slot="footer" class="add-footer">
      <el-button @click="cancel">{{ $t('table.cancel') }}</el-button>
      <el-button v-if="showFlag" type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
    </div>
  </div>
</template>

<script>
import { fetchList, create, update, del, deteils, batchDelete,batchUpdate } from '@/api/public'
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
      showFlag:true,
      multipleSelection: [], // 存放选中的值
      item:{},
      tab: '/rms/rmsrecipetemplate/',
      oldPage:1,
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
        this.getNewList()
        this.total = response.data.total
        this.listLoading = false
      })
    },
    //获取新list
    getNewList(){
      this.list.forEach(item => {
        if(item.showFlag == 'N'){
          item.showFlag = false
        } else {
          item.showFlag = true
        }
        if(item.monitorFlag == 'N'){
          item.monitorFlag = false
        } else {
          item.monitorFlag = true
        }
      });
    },
    // 转换入参
    changeParams(obj) {
      const params = {
        'sort': 'updateDate',
        'page.pn': obj.page,
        'query.eqpModelId||eq':obj.eqpModelId,
        'page.size': obj.limit,
        'sort.sortNo': 'desc',
        'query.paraName||like': obj.paraName || '',
        'query.paraShortName||like': obj.paraShortName || '',
        'queryFields': 'id,paraCode,paraName,paraShortName,eqpModelId,eqpModelName,paraCodeparaUnit,setValue,limitMin,limitMax,limitType,monitorFlag,paraLevel,paraDataType,showFlag,activeFlag,updateDate,'
      }
      return params
    },
    //校验
    valite(){
      
    },
    handleFilter() {
      this.$confirm('此操作会覆盖之前的编辑数据,确定继续吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() =>{
          this.listQuery.page = 1
          this.getList()
        }).catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消操作'
          })      
        });  
    },
    handleSizeChange(val) {
      let i = this.listQuery.limit
      this.listQuery.limit = val
      this.$confirm('此操作会覆盖之前的编辑数据,确定继续吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() =>{
          this.getList()
        }).catch(() => {
          this.listQuery.limit = i
          this.$notify({
            type: 'info',
            message: '已取消操作'
          })      
        });
    },
    handleCurrentChange(val) {
      this.listQuery.page  = val
      this.$confirm('此操作会覆盖之前的编辑数据,确定继续吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() =>{
          this.oldPage = this.listQuery.page 
          this.getList()
        }).catch(() => {
          this.listQuery.page = this.oldPage
          this.$notify({
            type: 'info',
            message: '已取消操作'
          })      
        });
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
    updateData(){
      this.list.forEach(item => {
        if(item.showFlag){
          item.showFlag = 'Y'
        } else {
          item.showFlag = 'N'
        }
        if(item.monitorFlag){
          item.monitorFlag = 'Y'
        } else {
          item.monitorFlag = 'N'
        }
      });
      const params = {
        recipeTemplateList:JSON.stringify(this.list),
        id:this.item.id
      }
      batchUpdate(this.tab, params).then((res) => {
        if (res.data.code == 0) {
         // this.cancel()
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
    },
    cancel() {
      this.getView()
      this.$store.dispatch('delView', this.viewObj).then(({ visitedViews }) => {
        this.$router.push({ name: 'ovenModel' })
      })
    },
    getView() {
      const List = this.$store.state.tagsView.visitedViews
      for (const item of List) {
        if (item.name == 'ovenEditModel') {
          this.viewObj = item
        }
      }
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



