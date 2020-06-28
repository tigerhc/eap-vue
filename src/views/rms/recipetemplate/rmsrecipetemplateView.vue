<template>
  <div class="app-container calendar-list-container">
    <div style="margin:20px 0px;">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="onNew">新增</el-button>
      <el-button type="primary" size="small" icon="el-icon-delete" @click="onDelete">删除</el-button>
    </div>
    <el-table ref="recipeTemplateForm" :data="list" :row-class-name="tableRowClassName" style="width: 100%" highlight-current-row @row-click="rowClick" @row-dblclick="rowDblclick" @current-change="handleCurrentChange">
      <el-table-column fixed type="index"/>
      <el-table-column label="参数代码" prop="paraCode">
        <template slot-scope="scope">
          <el-input v-model="scope.row.paraCode" :disabled="scope.row.hidden" @input="onChange"/>
        </template>
      </el-table-column>
      <el-table-column label="参数名" prop="paraName">
        <template slot-scope="scope">
          <el-input v-model="scope.row.paraName" :disabled="scope.row.hidden"/>
        </template>
      </el-table-column>
      <el-table-column label="参数简称" prop="paraShortName">
        <template slot-scope="scope">
          <el-input v-model="scope.row.paraShortName" :disabled="scope.row.hidden"/>
        </template>
      </el-table-column>
      <el-table-column label="单位" prop="paraUnit">
        <template slot-scope="scope">
          <el-input v-model="scope.row.paraUnit" :disabled="scope.row.hidden"/>
        </template>
      </el-table-column>
      <el-table-column label="设定值" prop="setValue">
        <template slot-scope="scope">
          <el-input v-model="scope.row.setValue" :disabled="scope.row.hidden"/>
        </template>
      </el-table-column>
      <el-table-column label="是否首页显示" prop="showFlag" dict="SHOW_FLAG">
        <template slot-scope="scope">
          <el-select v-model="scope.row.showFlag" :disabled="scope.row.hidden" dict="SHOW_FLAG"/>
        </template>
      </el-table-column>
      <el-table-column label="是否监控" prop="monitorFlag" dict="MONITOR_FLAG">
        <template slot-scope="scope">
          <el-select v-model="scope.row.monitorFlag" :disabled="scope.row.hidden" dict="MONITOR_FLAG"/>
        </template>
      </el-table-column>
      <el-table-column label="排序号" prop="sortNo">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sortNo" :disabled="scope.row.hidden"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import request from '@/utils/request'
export default {
  name: 'OvenEditModel',
  data() {
    return {
      list: [{
        eqpModelId: '',
        eqpModelName: ''
      }],
      selectIndex: '-1',
      selectRow: {},
      eqpModelId: '',
      eqpModelName: ''
    }
  },
  created() {
    // /ms/mseqpablility/list/e0209f5aa93711ea8f1e08f1eab2c7e1
    // url: '/ms/mseqpablility/list/' + this.$route.query.id,
    request({
      url: '/rms/rmsrecipetemplate/list/' + this.$route.query.id,
      method: 'get'
    }).then((res) => {
      this.list = res.data.results
      this.eqpModelId = res.data.eqpModelId
      this.eqpModelName = res.data.eqpModelName
      console.log(res)
    })
  },
  methods: {
    onDisplayChange(e) {
      this.model.modelName = e
    },
    rowClick(row, column, event) {
      var index = row.index
      this.selectIndex = index // 选中行下标
      this.selectRow = JSON.parse(JSON.stringify(row)) // 选中的值
    },
    rowDblclick(row, column, event) {
      if (row.hidden) {
        row.hidden = true
      } else {
        row.hidden = !row.hidden
      }
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    onDelete() {
      if (this.selectIndex !== '-1') {
        this.$confirm(`确定删除？`, { type: 'warning', center: true }).then(() => {
          request({
            url: '/rms/rmsrecipetemplate/' + +'/delete',
            method: 'get'
          }).then((res) => {
            this.list = res.data.results
            console.log(res)
          })
        })
      } else {
        this.$message({
          message: '请先选择要删除的行',
          type: 'warning'
        })
      }
    },
    onNew() {
      const ablility = {
        'eqpModelId': this.eqpModelId,
        'eqpModelName': this.eqpModelName,
        'paraCode': '',
        'paraName': '',
        'paraShortName': '',
        'paraUnit': '',
        'setValue': '',
        'showFlag': '',
        'monitorFlag': '',
        'sortNo': ''
      }
      this.list.push(ablility)
    },
    onChange() {
      const ablility = this.list[this.selectIndex]
      request({ url: '/rms/rmsrecipetemplate/save',
        'method': 'post',
        'data': ablility }).then((res) => {
        console.log(res)
      })
    },
    onSave() {
      request({ url: 'ms/mseqpablility/save',
        'method': 'post',
        'data': { id: '1' }}).then((res) => {
        console.log(res)
      })
    }
  }
}
</script>
