<template>
  <div>
    <el-dialog :visible.sync="dialogSearch" :close-on-click-modal="false" title="请选择设备类型" top="5vh" append-to-body>
      <el-form ref="searchData" :inline="true" :model="listQuery" label-width="100px" class="demo-form-inline">
        <!--prop 重置时用到  -->
        <el-form-item label="设备厂家：" prop="manufacturerName">
          <el-input v-model="listQuery.manufacturerName" clearable/>
        </el-form-item>
        <el-form-item label="设备类型：" prop="classCode">
          <el-input v-model="listQuery.classCode" clearable/>
        </el-form-item>
        <div class="search" >
          <el-button type="primary" @click="searchForm()">查询</el-button>
          <el-button @click="resetForm('searchData')">重置</el-button>
        </div>
      </el-form>
      <el-table
        v-loading="load"
        ref="mainTable"
        :data="tableData"
        :height="350"
        border
        stripe
        style="width: 100%;"
        @row-click="clickRow"
        @selection-change="handleSelectionChange"
        @select="chooseOne"
        @select-all="chooseAll"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="50px" align="center"/>
        <el-table-column align="center" label="设备厂家">
          <template slot-scope="scope">
            <span>{{ scope.row.manufacturerName }}</span>
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

      </el-table>
      <div class="pagination-container">
        <el-pagination
          :current-page.sync="listQuery.page"
          :page-sizes="[10,20,30, 50]"
          :page-size="listQuery.limit"
          :total="dataSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSearch = false">取 消</el-button>
        <el-button type="primary" @click="addSure()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchDeviceList, addDevice, updateDevice, deleteDevice, batchDelete } from '@/api/sys/device'
export default {
  name: 'SelectDevice',
  data() {
    return {
      load: false,
      dialogSearch: false,
      listQuery: {
        page: 1,
        limit: 10,
        manufacturerName: undefined,
        classCode: undefined,
        sort: 'updateDate'
      },
      tableData: [],
      dataSize: 0,
      multipleSelection: []
    }
  },
  methods: {
    openDialog(flag) {
      this.listQuery.manufacturerName = ''
      this.listQuery.classCode = ''
      this.dialogSearch = flag
      this.listQuery.page = 1// 每次查询从第一页开始
      this.listQuery.limit = 10
      this.getData()
    },
    // 查询
    searchForm() {
      if (this.listQuery.page != 1) {
        this.listQuery.page = 1// 每次查询从第一页开始
        this.getData()
      } else {
        this.getData()
      }
    },
    // 每页条数
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getData()
    },
    // 第几页
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getData()
    },
    // 重置查询域
    resetForm() {
      if (this.$refs['searchData']) {
        this.$refs['searchData'].resetFields()
      }
      this.getData()
    },

    getData() {
      this.load = true
      const params = this.changeParams(this.listQuery)
      fetchDeviceList(params).then(response => {
        this.tableData = response.data.results
        this.dataSize = response.data.total
        this.load = false
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
        'queryFields': 'id,manufacturerName,classCode,smlPath,hostJavaClass,activeFlag,iconPath,'
      }
      return params
    },
    // 行选中事件
    clickRow(row) {
      this.$refs.mainTable.toggleRowSelection(row)
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

    addSure() {
      if (this.multipleSelection.length == 1) {
        this.$emit('childByValue', this.multipleSelection[0].classCode)
        this.dialogSearch = false
      }
    }
  }
}
</script>
<style scoped>
.search {
    margin-bottom: 20px;
    margin-left: 15px;
}
</style>
