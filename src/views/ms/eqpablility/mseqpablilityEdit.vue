<template>
<!--  <w-form v-bind="formConf" :col="3" :model="model">-->
<!--    <el-input v-model="model.recordId" label="流水号" />-->
<!--    <el-input v-model="model.eqpId" label="设备号" />-->
<!--    <el-input v-model="model.lotNo" label="批号" />-->
<!--    <el-input v-model="model.waferId" label="晶圆ID" />-->
<!--    <el-input v-model="model.timing" label="时机" />-->
<!--    <el-input v-model="model.status" label="状态" />-->
<!--    <el-input v-model="model.approveResult" label="判定结果" />-->
<!--    <el-row col="24" />-->
<!--    <el-input v-model="model.createByName" :disabled="true" label="创建人" />-->
<!--    <el-input v-model="model.createDate" :disabled="true" label="创建日期" />-->
<!--  </w-form>-->
  <div class="model">
    <div style="margin:20px 0px;">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="onNew">新增</el-button>
      <el-button type="primary" size="small" icon="el-icon-delete" @click="onDelete">删除</el-button>
    </div>
    <el-table ref="ablilityForm" :data="list" :row-class-name="tableRowClassName" style="width: 100%" highlight-current-row @row-click="rowClick" @row-dblclick="rowDblclick" @current-change="handleCurrentChange">
      <el-table-column fixed type="index"/>
      <el-table-column label="eqpModelName" prop="eqpModelName"/>
      <el-table-column label="locationH" prop="locationH">
        <template slot-scope="scope">
          <el-input v-model="scope.row.locationH" :disabled="scope.row.hidden" @input="onChange"/>
        </template>
      </el-table-column>
      <el-table-column label="locationW" prop="locationW">
        <template slot-scope="scope">
          <el-input v-model="scope.row.locationW" :disabled="scope.row.hidden"/>
        </template>
      </el-table-column>
      <el-table-column label="locationX" prop="locationX">
        <template slot-scope="scope">
          <el-input v-model="scope.row.locationX" :disabled="scope.row.hidden"/>
        </template>
      </el-table-column>
      <el-table-column label="locationY" prop="locationY">
        <template slot-scope="scope">
          <el-input v-model="scope.row.locationY" :disabled="scope.row.hidden"/>
        </template>
      </el-table-column>
      <el-table-column label="paraCode" prop="paraCode">
        <template slot-scope="scope">
          <el-input v-model="scope.row.paraCode" :disabled="scope.row.hidden"/>
        </template>
      </el-table-column>
      <el-table-column label="paraName" prop="paraName">
        <template slot-scope="scope">
          <el-input v-model="scope.row.paraName" :disabled="scope.row.hidden"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import request from '@/utils/request'
export default {
  name: 'MachineModel',
  data() {
    return {
      list: [{
        eqpModelName: '11',
        eqpModelId: '123'
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
      url: '/ms/mseqpablility/list/e0209f5aa93711ea8f1e08f1eab2c7e1',
      method: 'get'
    }).then((res) => {
      this.list = res.data.results
      this.eqpModelId
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
            url: '/ms/mseqpablility/' + +'/delete',
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
        'locationX': '',
        'locationY': '',
        'locationH': '',
        'locationW': ''
      }
      this.list.push(ablility)
    },
    onChange() {
      const ablility = this.list[this.selectIndex]
      request({ url: 'ms/mseqpablility/save',
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
