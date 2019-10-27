<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.eqpCode" style="width: 200px;" class="filter-item" placeholder="请输入设备号" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.recipeCode" style="width: 200px;" class="filter-item" placeholder="请输入程序名称" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.versionType" filterable style="width: 200px;" class="filter-item" placeholder="请选择程序版本">
        <el-option
          v-for="item in dictList.versionTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.eqpModelName" filterable style="width: 200px;" class="filter-item" placeholder="请选择设备类型">
        <el-option
          v-for="item in eqpModelNameList"
          :key="item.id"
          :label="item.classCode"
          :value="item.id"/>
      </el-select>
      <el-select v-model="listQuery.status" filterable style="width: 200px;" class="filter-item" placeholder="请选择程序状态">
        <el-option
          v-for="item in dictList.statusList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.approveStep" filterable style="width: 200px;" class="filter-item" placeholder="请选择审核状态">
        <el-option
          v-for="item in dictList.approveStepList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.approveResult" filterable style="width: 200px;" class="filter-item" placeholder="请选择审核结果">
        <el-option
          v-for="item in dictList.approveResultList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-input v-model="listQuery.createByName" style="width: 200px;" class="filter-item" placeholder="请输入上传人" @keyup.enter.native="handleFilter"/>
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
      <el-table-column align="center" label="程序名称">
        <template slot-scope="scope">
          <span class="textLink" @click="edit('deteils',scope.row.id)">{{ scope.row.recipeCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备号">
        <template slot-scope="scope">
          <span>{{ scope.row.eqpCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备类型">
        <template slot-scope="scope">
          <span>{{ scope.row.eqpModelName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="程序等级">
        <template slot-scope="scope">
          <span>{{ formatter(scope.row.versionType,'versionTypeList') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="程序版本号">
        <template slot-scope="scope">
          <span>{{ scope.row.versionNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{ formatter(scope.row.status,'statusList') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="审核状态">
        <template slot-scope="scope">
          <span>{{ formatter(scope.row.approveStep,'approveStepList') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="审核结果">
        <template slot-scope="scope">
          <span>{{ formatter(scope.row.approveResult,'approveResultList') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上传人">
        <template slot-scope="scope">
          <span>{{ scope.row.createByName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" width="200px" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit('editModel',scope.row.id)">{{ $t('table.edit') }}</el-button>
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
import { fetchList, create, update, del, getDeteils, batchDelete, fetchDict } from '@/api/public'
import { fetchDeviceList } from '@/api/sys/device'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Program',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      multipleSelection: [], // 存放选中的值
      listQuery: {
        page: 1,
        limit: 10,
        eqpCode: undefined,
        recipeCode: undefined,
        versionType: undefined,
        eqpModelName: undefined,
        status: undefined,
        approveStep: undefined,
        approveResult: undefined,
        createByName: undefined
      },
      dictList: {
        versionTypeList: [],
        statusList: [],
        approveStepList: [],
        approveResultList: []
      },
      eqpModelNameList: [],
      tab: 'rms/rmsrecipe/'
    }
  },
  created() {
    this.getList()
    this.getDictValue()
  },
  methods: {
    formatter(value, type) {
      for (const item of this.dictList[type]) {
        if (item.value == value) {
          return item.label
        }
      }
    },
    getDictValue() {
      const typeList = ['RECIPE_VERSION_TYPE', 'RECIPE_STATUS', 'RECIPE_APPROVE_STEP', 'RECIPE_APPROVE_RESULT']
      const list = ['versionTypeList', 'statusList', 'approveStepList', 'approveResultList']
      for (let i = 0; i < typeList.length; i++) {
        this.getDictList(typeList[i], list[i])
      }
      // 获取设备类型
      this.getDevice()
    },
    getDevice() {
      const obj = {
        'sort': 'updateDate',
        'page.pn': 1,
        'page.size': 999999,
        'queryFields': 'id,manufacturerName,classCode,smlPath,hostJavaClass,activeFlag,iconPath,updateDate,'
      }
      fetchDeviceList(obj).then(response => {
        this.eqpModelNameList = response.data.results
      })
    },
    // 获取字典list
    getDictList(type, name) {
      fetchDict(type).then(response => {
        this.dictList[name] = response.data
      })
    },
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
        'query.eqpCode||like': obj.eqpCode || '',
        'query.recipeCode||like': obj.recipeCode || '',
        'query.createByName||like': obj.createByName || '',
        'query.eqpModelName||eq': obj.eqpModelName || '',
        'query.versionType||eq': obj.versionType || '',
        'query.status||eq': obj.status || '',
        'query.approveStep||eq': obj.approveStep || '',
        'query.approveResult||eq': obj.approveResult || '',
        'queryFields': 'id,recipeCode,recipeName,eqpCode,createByName,eqpModelId,eqpModelName,versionType,versionNo,approveStep,approveResult,status,activeFlag,createDate,'
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
    edit(type, id) {
      this.$router.push({ name: 'views/rms/recipe/rmsrecipeEdit',
        query: { type, id }
      })
    },
    handleOperating(type, id) {
      this.$router.push({ name: 'views/rms/recipe/rmsrecipeAdd' })
    }
  }
}
</script>
