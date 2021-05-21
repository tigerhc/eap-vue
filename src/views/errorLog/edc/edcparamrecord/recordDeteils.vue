<template>
  <div class="app-container calendar-list-container">
    <el-form ref="modelForm" :inline="true" :model="modelList" disabled class="modelForm" label-width="150px">
      <el-form-item label="采集日期" prop="eqpId">
        <el-date-picker v-model="modelList.bizDate" style="width:185px" type="date"/>
      </el-form-item>
      <el-form-item label="设备号" prop="eqpId">
        <el-input v-model="modelList.eqpId"/>
      </el-form-item>
      <el-form-item label="业务大类" prop="location">
        <el-input v-model="modelList.location"/>
      </el-form-item>
      <el-form-item label="业务小类" prop="bizSubType">
        <el-input v-model="modelList.bizSubType"/>
      </el-form-item>
      <el-form-item label="备注" prop="activeFlag">
        <el-input :rows="4" v-model="modelList.location" type="textarea" style="width:400px"/>
      </el-form-item>
    </el-form>
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
      <el-table-column align="center" label="SVID">
        <template slot-scope="scope">
          <span>{{ scope.row.paramId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="SV编码">
        <template slot-scope="scope">
          <span>{{ scope.row.paramCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="SV名称">
        <template slot-scope="scope">
          <span>{{ scope.row.paramName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="SV简称">
        <template slot-scope="scope">
          <span>{{ scope.row.paramShotName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="当前值">
        <template slot-scope="scope">
          <span>{{ scope.row.paramValue }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="计量单位">
        <template slot-scope="scope">
          <span>{{ scope.row.paramUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="通讯协议">
        <template slot-scope="scope">
          <span>{{ scope.row.protocol }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="SPEC类型">
        <template slot-scope="scope">
          <span>{{ scope.row.valueType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设定值">
        <template slot-scope="scope">
          <span>{{ scope.row.setValue }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { deteils } from '@/api/public'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Edcparamrecord',
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
      id: '',
      modelList: {},
      listQuery: {
        page: 1,
        limit: 10,
        bizSubType: undefined,
        eqpId: undefined,
        bizDate: undefined,
        sort: 'updateDate'
      }
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      deteils(this.tab, this.id).then(response => {
        this.modelList = response.data
        this.list = this.modelList.edcParamRecordDtlList
        this.listLoading = false
      })
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
    }
  }
}
</script>
