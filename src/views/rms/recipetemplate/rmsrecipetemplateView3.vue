<template>
  <div class="app-container calendar-list-container">
    <div style="margin: 20px 0px">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="onNew">新增</el-button>
      <el-button type="primary" size="small" icon="el-icon-delete" @click="onDelete">删除</el-button>
    </div>
    <el-table
      ref="recipeTemplateForm"
      :data="list"
      :row-class-name="tableRowClassName"
      style="width: 100%"
      highlight-current-row
      @row-click="rowClick"
      @row-dblclick="rowDblclick"
      @current-change="handleCurrentChange"
    >
      <el-table-column type="index" />
      <el-table-column label="参数代码" prop="paraCode">
        <template slot-scope="scope">
          <el-input v-model="scope.row.paraCode" :disabled="scope.row.hidden" @input="onChange" />
        </template>
      </el-table-column>
      <el-table-column label="参数名" prop="paraName">
        <template slot-scope="scope">
          <el-input v-model="scope.row.paraName" :disabled="scope.row.hidden" @input="onChange" />
        </template>
      </el-table-column>
      <el-table-column label="参数简称" prop="paraShortName">
        <template slot-scope="scope">
          <el-input v-model="scope.row.paraShortName" :disabled="scope.row.hidden" @input="onChange" />
        </template>
      </el-table-column>
      <el-table-column label="单位" prop="paraUnit">
        <template slot-scope="scope">
          <el-input v-model="scope.row.paraUnit" :disabled="scope.row.hidden" @input="onChange" />
        </template>
      </el-table-column>
      <el-table-column label="设定值" prop="setValue">
        <template slot-scope="scope">
          <el-input v-model="scope.row.setValue" :disabled="scope.row.hidden" @input="onChange" />
        </template>
      </el-table-column>
      <el-table-column label="是否首页显示" prop="showFlag" dict="SHOW_FLAG">
        <template slot-scope="scope">
          <w-select-dic v-model="scope.row.showFlag" :disabled="scope.row.hidden" dict="SHOW_FLAG" @input="onChange" />
        </template>
      </el-table-column>
      <el-table-column label="是否监控" prop="monitorFlag" dict="MONITOR_FLAG">
        <template slot-scope="scope">
          <w-select-dic
            v-model="scope.row.monitorFlag"
            :disabled="scope.row.hidden"
            dict="MONITOR_FLAG"
            @input="onChange"
          />
        </template>
      </el-table-column>
      <el-table-column label="排序号" prop="sortNo">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sortNo" :disabled="scope.row.hidden" @input="onChange" />
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        :current-page.sync="listQuery.page"
        :page-sizes="[10, 20, 30, 50]"
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
import request from '@/utils/request'
import { fetchList } from '@/api/public'
export default {
  name: 'OvenEditModel',
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        eqpModelId: '',
        paraName: undefined,
        paraShortName: undefined
      },
      list: null,
      tab: '/rms/rmsrecipetemplate/',
      oldPage: 1,
      total: null,
      selectIndex: '-1',
      selectRow: {},
      eqpModelId: '',
      eqpModelName: ''
    }
  },
  created() {
    this.listQuery.eqpModelId = this.$route.query.id
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const params = this.changeParams(this.listQuery)
      fetchList(this.tab, params).then((response) => {
        this.list = response.data.results
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 转换入参
    changeParams(obj) {
      const params = {
        'page.pn': obj.page,
        'query.eqpModelId||eq': obj.eqpModelId,
        'page.size': obj.limit,
        'sort.sortNo': 'asc',
        'query.paraName||like': obj.paraName || '',
        'query.paraShortName||like': obj.paraShortName || '',
        queryFields:
          'id,paraCode,paraName,paraShortName,eqpModelId,eqpModelName,paraCodeparaUnit,setValue,limitMin,limitMax,limitType,monitorFlag,paraLevel,paraDataType,showFlag,activeFlag,updateDate,sortNo,'
      }
      return params
    },
    onDisplayChange(e) {
      this.model.modelName = e
    },
    rowClick(row, column, event) {
      const index = row.index
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
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
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
      const tem = {
        eqpModelId: this.eqpModelId,
        eqpModelName: this.eqpModelName,
        paraCode: '',
        paraName: '',
        paraShortName: '',
        paraUnit: '',
        setValue: '',
        showFlag: '',
        monitorFlag: '',
        sortNo: ''
      }
      this.list.push(tem)
    },
    onChange() {
      const tem = this.list[this.selectIndex]
      request({ url: '/rms/rmsrecipetemplate/save', method: 'post', data: tem }).then((res) => {
        console.log(res)
      })
    },
    onSave() {
      request({ url: 'ms/mseqpablility/save', method: 'post', data: { id: '1' }}).then((res) => {
        console.log(res)
      })
    }
  }
}
</script>
