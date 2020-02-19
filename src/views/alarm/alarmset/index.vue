<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.alarmId"
        style="width: 200px;"
        class="filter-item"
        placeholder="ALID"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.eqpModelName"
        filterable
        style="width: 200px;"
        class="filter-item"
        placeholder="请选择设备类型"
      >
        <el-option
          v-for="item in eqpModelNameList"
          :key="item.id"
          :label="item.classCode"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.eqpModelName"
        filterable
        style="width: 200px;"
        class="filter-item"
        placeholder="请选择Alarm类型"
      >
        <el-option
          v-for="item in eqpModelNameList"
          :key="item.id"
          :label="item.classCode"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.eqpModelName"
        filterable
        style="width: 200px;"
        class="filter-item"
        placeholder="请选择状态"
      >
        <el-option
          v-for="item in eqpModelNameList"
          :key="item.id"
          :label="item.classCode"
          :value="item.id"
        />
      </el-select>
      <el-input
        v-model="listQuery.alid"
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
           <span v-if="scope.row.activeFlag == 1">有效</span>
          <span v-else>无效</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备类型">
        <template slot-scope="scope">
          <span>{{ scope.row.eqpModelName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Alarm类型">
        <template slot-scope="scope">
          <span>{{ scope.row.classCode }}</span>
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
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >{{ $t('table.edit') }}</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >{{ $t('table.delete') }}</el-button>
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
import { fetchList } from '@/api/alarm/alarmSet'
import waves from '@/directive/waves' // 水波纹指令

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
        classCode: undefined,
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
    },
    // 转换入参
    changeParams(obj) {
      const params = {
        sort: 'updateDate',
        'page.pn': obj.page,
        'page.size': obj.limit,
        'query.alarmId||like': obj.alarmId || '',
        // 'query.classCode||like': obj.classCode || '',
        queryFields: 'id,alarmId,classCode,alarmCode,alarmCategory,alarmDesc,alarmType,monitorFlag,eqpModelId,eqpModelName,edcAmsRecordList,alarmId,alarmName,'
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
      this.$router.push({ name: 'views/rms/recipetemplate/rmsrecipetemplateView', query: { item }})
    },
    handleUpdate(item) {
      this.$router.push({ name: 'views/rms/recipetemplate/rmsrecipetemplateView', query: { item }})
    }
  }
}
</script>
