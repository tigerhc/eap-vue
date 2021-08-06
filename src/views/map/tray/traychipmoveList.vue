<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-row :gutter="5">
        <el-col :span="3">
          <el-input v-model="searchObj.lotNo" placeholder="请输入批次号" clearable />
        </el-col>
        <el-col :span="4">
          <el-input v-model="searchObj.chipId" placeholder="请输入芯片编号" clearable />
        </el-col>
        <el-col :span="5" class="tray-chip-eqp-selet">
          <w-select-eqp v-model="searchObj.eqpIds" />
        </el-col>
        <el-date-picker
          v-model="searchObj.time"
          :picker-options="dateOptions"
          :editable="false"
          type="datetimerange"
          popper-class="tray-chip-date-picker"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        />
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="text" class="a-tray-job-history" @click="toHistory">任务历史</el-button>
      </el-row>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="lotNo" label="批次号" width="150" />
      <el-table-column prop="chipId" label="芯片编号" width="150">
        <template v-if="scope.row.chipId" slot-scope="scope">
          <el-button type="text" size="small" @click="handleChipClick(scope.row)">{{ scope.row.chipId }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="eqpId" label="设备号" width="150" />
      <el-table-column prop="productionNo" label="品番号" width="150" />
      <el-table-column prop="toTrayId" label="托盘ID" width="100" />
      <el-table-column prop="toX" label="X坐标" width="80" />
      <el-table-column prop="toY" label="Y坐标" width="80" />
      <el-table-column prop="judgeResult" label="质量" width="80" />
      <el-table-column :formatter="colDateFormatter" prop="startTime" label="时间" width="180" />
    </el-table>
    <el-pagination
      :current-page="searchObj.page"
      :page-sizes="[50, 100, 200, 500]"
      :page-size="searchObj.pageSize"
      :total="searchObj.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="scss">
.a-tray-job-history {
  margin-left: 3px;
  border: 0;
  font-size: 12px;
  span {
    position: absolute;
    bottom: 5px;
  }
}
.tray-chip-eqp-selet .el-select {
  display: block;
}
.tray-chip-date-picker .el-picker-panel__shortcut {
  background-color: #eeeeee;
  border: 1px solid #dcdfe6;
  display: inline-block;
  border-radius: 2px;
  color: #0033cc;
  margin: 4px;
}
</style>

<script>
import request from '@/utils/request'
import dateFormat from '@/utils/dateformat'
export default {
  name: 'TrayChipMoveList',
  data() {
    return {
      tableData: [],
      searchObj: {
        lotNo: null,
        eqpIds: [],
        chipId: '',
        time: [],
        total: 0,
        pageSize: 50,
        page: 1
      },
      dateOptions: {
        shortcuts: [
          {
            text: '最近2小时',
            onClick(picker) {
              const end = new Date()
              const start = new Date(end.getTime() - 3600 * 1000 * 2)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近6小时',
            onClick(picker) {
              const end = new Date()
              const start = new Date(end.getTime() - 3600 * 1000 * 6)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '今天',
            onClick(picker) {
              const end = new Date()
              const start = new Date(new Date().toLocaleDateString())
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const end = new Date(new Date().toLocaleDateString())
              const start = new Date(end.getTime() - 3600 * 1000 * 24)
              end.setTime(end.getTime() - 1000)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '近三天',
            onClick(picker) {
              const end = new Date()
              const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 48)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  methods: {
    search() {
      const data = {}
      data.pageSize = this.searchObj.pageSize
      data.offset = (this.searchObj.page - 1) * this.searchObj.pageSize
      data.total = this.searchObj.total

      if (this.searchObj.chipId && this.searchObj.chipId.trim() !== '') {
        this.searchObj.time = []
        data.chipIds = this.searchObj.chipId.trim().split(',')
      } else {
        if (
          typeof this.searchObj.time === 'undefined' ||
          this.searchObj.time == null ||
          this.searchObj.time.length === 0
        ) {
          this.searchObj.time = [dateFormat(new Date(new Date().toLocaleDateString())), dateFormat(new Date())]
        }
        data.lotNo = this.searchObj.lotNo
        data.eqpIds = this.searchObj.eqpIds
        data.sTime = this.searchObj.time[0]
        data.eTime = this.searchObj.time[1]
      }
      request({
        url: '/map/maptraychipmove/page',
        method: 'post',
        data
      }).then((resp) => {
        this.searchObj.total = resp.data.total
        if (resp.data.results) {
          this.tableData = resp.data.results
        }
      })
    },
    handleSizeChange(val) {
      this.searchObj.pageSize = val
      this.search()
    },
    handleCurrentChange(val) {
      this.searchObj.page = val
      this.search()
    },
    colDateFormatter(row, column, val) {
      if (val !== null) {
        return dateFormat(new Date(Date.parse(val)))
      }
      return val
    },
    handleChipClick(row) {
      this.$router.push({
        name: 'views/map/tray/traychipmoveDetail',
        query: {
          id: row.chipId,
          type: 'VIEW'
        }
      })
    },
    toHistory() {
      this.$router.push({
        name: 'views/map/tray/trayjobhistoryList'
      })
    }
  }
}
</script>
