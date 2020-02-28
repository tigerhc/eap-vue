<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.alarmId"
        style="width: 200px;"
        class="filter-item"
        placeholder="ALID"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.eqpModelName"
        filterable
        style="width: 200px;"
        clearable
        class="filter-item"
        placeholder="请选择设备类型"
      >
        <el-option
          v-for="item in eqpModelNameList"
          :key="item.id"
          :label="item.model_name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.alarmType"
        filterable
        clearable
        style="width: 200px;"
        class="filter-item"
        placeholder="请选择Alarm类型"
      >
        <el-option
          v-for="item in dictList('AMS_ALARM_TYPE')"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.monitorFlag"
        filterable
        clearable
        style="width: 200px;"
        class="filter-item"
        placeholder="请选择状态"
      >
        <el-option
          v-for="item in dictList('MONITOR_FLAG')"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="listQuery.alarmDesc"
        clearable
        style="width: 200px;"
        class="filter-item"
        placeholder="ALID描述"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="handleOperating('addModel')"
      >{{ $t('table.add') }}</el-button>
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
      @select-all="chooseAll"
    >
      <el-table-column type="index" label="序号" width="50px" align="center" />
      <el-table-column width="120" align="center" label="ALID">
        <template slot-scope="scope">
          <span class="textLink" @click="openDeteils(scope.row)">{{ scope.row.alarmCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备类型">
        <template slot-scope="scope">
          <span>{{ scope.row.eqpModelName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Alarm描述">
        <template slot-scope="scope">
          <span>{{ scope.row.alarmDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.monitorFlag == 0">已启用</span>
          <span v-else>已禁用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备类型">
        <template slot-scope="scope">
          <span>{{ scope.row.eqpModelName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Alarm类型">
        <template slot-scope="scope">
          <span>{{ scope.row.alarmType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布时间">
        <template slot-scope="scope">
          <span>{{ scope.row.classCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布人">
        <template slot-scope="scope">
          <span>{{ scope.row.classCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="停用时间">
        <template slot-scope="scope">
          <span>{{ scope.row.classCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="停用人">
        <template slot-scope="scope">
          <span>{{ scope.row.classCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="制单时间">
        <template slot-scope="scope">
          <span>{{ scope.row.classCode }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button type="text" @click="del(scope.row)">{{ $t('table.delete') }}</el-button>
          <el-button
            v-if="scope.row.monitorFlag ==1"
            type="text"
            @click="handleEnable(scope.row,0)"
          >启用</el-button>
          <el-button
            v-if="scope.row.monitorFlag ==0"
            type="text"
            @click="handleEnable(scope.row,1)"
          >停用</el-button>
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
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { fetchList, fetchEnable, deleteList } from '@/api/alarm/alarmSet'
import waves from '@/directive/waves' // 水波纹指令
import { fetchLookup } from '@/api/sys/device'
export default {
  name: 'AlarmSet',
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
      listQuery: {
        page: 1,
        limit: 10,
        alarmId: undefined,
        alarmType: undefined,
        classCode: undefined,
        monitorFlag: undefined,
        alarmDesc: '',
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
      fetchList(params).then((response) => {
        this.list = response.data.results
        this.total = response.data.total
        this.listLoading = false
      })
      this.getDevice()
    },
    getDevice() {
      // const obj = {
      //   sort: 'updateDate',
      //   'page.pn': 1,
      //   'page.size': 999999,
      //   queryFields: 'id,manufacturerName,classCode,smlPath,hostJavaClass,activeFlag,iconPath,updateDate,'
      // }
      fetchLookup().then((response) => {
        this.eqpModelNameList = response.data
      })
    },
    // 转换入参
    changeParams(obj) {
      const params = {
        sort: 'updateDate',
        'page.pn': obj.page,
        'page.size': obj.limit,
        'query.alarmId||like': obj.alarmId || '',
        'query.alarmDesc||like': obj.alarmDesc || '',
        'query.alarmType||eq': obj.alarmType || '',
        'query.eqpModelName||eq': obj.eqpModelName || '',
        'query.monitorFlag||eq': obj.monitorFlag || '',
        // 'query.classCode||like': obj.classCode || '',
        queryFields:
          'id,alarmId,classCode,alarmCode,alarmCategory,alarmDesc,alarmType,monitorFlag,eqpModelId,eqpModelName,edcAmsRecordList,alarmId,alarmName,'
      }
      return params
    },
    selectEqp() {},
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
    handleEnable(item, id) {
      fetchEnable(item.id, id).then((res) => {
        if (res.data.code === 0) {
          this.getList()
          this.$notify({
            title: '成功',
            message: res.msg,
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '操作失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    // 新增
    handleOperating() {
      this.$router.push({ name: 'views/alarm/alarmset/add' })
    },
    // 修改
    edit(item) {
      this.$router.push({ name: 'views/alarm/alarmset/edit', query: { item, editFlag: true }})
    },
    openDeteils(item) {
      this.$router.push({ name: 'views/alarm/alarmset/edit', query: { item, editFlag: false }})
    },
    del(item) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteList(item.id).then(res => {
            if (res.data.code === 0) {
              this.getList()
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
