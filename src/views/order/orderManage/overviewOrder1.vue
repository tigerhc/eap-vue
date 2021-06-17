<template>
  <div class="app-container calendar-list-container">
    <div class="search">
      <el-input v-model="model.id" placeholder="工单号" />
      <el-select v-model="model.eqpId" placeholder="设备编号">
        <el-option v-for="item in eqpIdOptions" :key="item.id" :label="item.id" :value="item.id" />
      </el-select>
      <el-date-picker
        v-model="model.assignedTime"
        style="width: 250px; margin-right: 15px"
        type="datetimerange"
        range-separator="-"
        start-placeholder="指派时间起"
        end-placeholder="指派时间止"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
      <el-date-picker
        v-model="model.dealTime"
        style="width: 250px; margin-right: 15px"
        type="datetimerange"
        range-separator="-"
        start-placeholder="处理时间起"
        end-placeholder="处理时间止"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
      <el-select v-model="model.planStatus" placeholder="工单状态">
        <el-option v-for="item in eqpIdOptions" :key="item.id" :label="item.id" :value="item.id" />
      </el-select>
      <el-select v-model="model.planType" placeholder="工单类型">
        <el-option v-for="item in eqpIdOptions" :key="item.id" :label="item.id" :value="item.id" />
      </el-select>
      <el-select v-model="model.flag" placeholder="是否查询历史数据">
        <el-option v-for="item in eqpIdOptions" :key="item.id" :label="item.id" :value="item.id" />
      </el-select>
      <w-select-dept v-model="model.officeIds" label="组织机构" style="margin-top: 15px; margin-right: 15px" />

      <el-button type="primary" icon="el-icon-search" style="margin-top: 15px" @click="search()">搜索</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
      tooltip-effect="dark"
      style="width: 100%; margin-top: 20px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column props="id" label="工单号"/>
      <el-table-column props="planId" label="（计划、报警）编号"/>
      <el-table-column props="eqpId" label="设备编号"/>
      <el-table-column props="assignedUser" label="指派人"/>
      <el-table-column props="designee" label="被指派人"/>
      <el-table-column props="assignedTime" label="指派时间"/>
      <el-table-column props="dealTime" label="处理时间"/>
      <el-table-column props="planStatus" label="工单状态"/>
      <el-table-column props="planType" label="工单类型"/>
      <el-table-column props="flag" label="是否查询历史数据"/>
      <el-table-column props="dealAdvice" label="处理意见"/>
      <el-table-column props="dealDesc" label="处理描述"/>
      <el-table-column props="endDate" label="归档时间"/>
      <el-table-column props="officeId" label="组织机构"/>
    </el-table>
    <el-pagination
      :current-page="pageInfo.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageInfo.pagesize"
      :total="tableData.length"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
// import x from ''
export default {
  components: {},
  data() {
    return {
      pageInfo: {
        pagesize: 10,
        pagenum: 1
      },
      tableData: [],
      eqpIdOptions: [],
      model: {
        id: '',
        eqpId: '',
        assignedTime: '',
        dealTime: '',
        planStatus: '',
        planType: '',
        flag: ''
      }
    }
  },

  mounted() {},
  methods: {
    search() {
      console.log(this.model.assignedTime)
      console.log(this.model.id)
    },
    handleSelectionChange() {},
    handleSizeChange(size) {
      this.pageInfo.pagesize = size
    },
    handleCurrentChange(num) {
      this.pageInfo.pagenum = num
    }
  }
}
</script>

<style  scoped>
.el-input {
  width: 200px;
  margin-right: 15px;
}
.el-select {
  margin-right: 15px;
}
.el-pagination {
  text-align: center;
  margin-top: 15px;
}
</style>
