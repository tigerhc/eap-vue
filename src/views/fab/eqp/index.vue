<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.eqpId" style="width: 200px;" class="filter-item" placeholder="请输入设备号" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.bcCode" style="width: 200px;" class="filter-item" placeholder="请输入BC号" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.modelName" style="width: 200px;" class="filter-item" placeholder="请输入设备型号名称" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleOperating('addModel')">{{ $t('table.add') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
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
      <el-table-column align="center" label="设备号">
        <template slot-scope="scope">
          <span class="textLink" @click="handleOperating('deteils',scope.row.id)">{{ scope.row.eqpId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="部门">
        <template slot-scope="scope">
          <span>{{ scope.row.officeName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="BC号">
        <template slot-scope="scope">
          <span>{{ scope.row.bcCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="机台IP地址">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="设备型号名称">
        <template slot-scope="scope">
          <span>{{ scope.row.modelName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="位置号">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
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
      <el-table-column :label="$t('table.actions')" width="200px" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleOperating('editModel',scope.row.id)">{{ $t('table.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('table.delete') }}
          </el-button>
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
import { fetchList, create, update, del, getDeteils, batchDelete } from '@/api/public'
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
        eqpId: undefined,
        bcCode: undefined,
        modelName: undefined
      },
      tab: '/fab/fabequipment/'
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
        'sort': 'updateDate',
        'page.pn': obj.page,
        'page.size': obj.limit,
        'query.eqpId||like': obj.eqpId || '',
        'query.bcCode||like': obj.bcCode || '',
        'query.modelName||like': obj.modelName || '',
        'queryFields': 'id,eqpId,officeName,classCode,ip,bcCode,modelName,location,activeFlag,iconPath,updateDate,'
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
    handleDelete(row) {
      del(this.tab, row.id).then(() => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 批量删除
    batchDelete() {
      if (this.multipleSelection.length > 0) {
        this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const obj = {
            ids: ''
          }
          const ids = []
          for (const item of this.multipleSelection) {
            ids.push(item.id)
          }
          obj.ids = ids.join(',')
          batchDelete(this.tab, obj).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        }).catch(() => {
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
    handleOperating(type, id) {
      let flag = true
      if (type == 'deteils') {
        flag = false
      }
      this.$router.push({
        path: '/fab/machineModel',
        query: {
          type,
          id,
          flag
        }})
    }
  }
}
</script>
