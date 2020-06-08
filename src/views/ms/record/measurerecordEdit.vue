<template>
  <div>
    <w-form v-bind="formConf" :col="3" :model="model" :bottom-btn="true">
      <el-input v-model="model.recordId" label="流水号"/>
      <el-input v-model="model.eqpId" label="设备号"/>
      <el-input v-model="model.lotNo" label="批号"/>
      <el-input v-model="model.waferId" label="晶圆ID"/>
      <el-input v-model="model.timing" label="时机"/>
      <el-input v-model="model.sampleCount" label="采样数"/>
      <el-input v-model="model.status" label="状态"/>
      <el-input v-model="model.approveResult" label="判定结果"/>
      <!--      <el-row col="24" />-->
      <!--      <el-input v-model="model.createByName" :disabled="true" label="创建人" />-->
      <!--      <el-input v-model="model.createDate" :disabled="true" label="创建日期" />-->
    </w-form>
    <div class="model">
      <el-form v-if="rowData.length > 0" :model="model" disabled>
        <div v-for="(item,index) in rowData" :key="item.id">
          <el-row v-if="index%2==0">
            <el-col :xs="24" :span="8">
              <el-form-item :label="item.itemName" label-width="150px">
                <el-input v-model="item.itemValue" :class="item.itemResult == 'N'?'jk-font-red':''"/>
              </el-form-item>
            </el-col>
            <el-col v-if="index < rowData.length" :xs="24" :span="8">
              <el-form-item :label="rowData[index+1].itemName" label-width="150px">
                <el-input v-model="rowData[index+1].itemValue" :class="item.itemResult == 'N'?'jk-font-red':''"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="model">
      <div v-for="item in gridData" :key="item.id" style="margin-left: 150px;">
        <el-table
          :data="item.data"
          :header-row-class-name="headStyle"
          border
          fit
          stripe>
          <el-table-column fixed type="index"/>
          <div v-for="(col, index) in item.head" :key="col">
            <el-table-column
              :prop="col"
              :label="col">
              <template slot-scope="scope">
                <div :class="scope.row[index].className">{{ scope.row[index][col] }}</div>
              </template>
            </el-table-column>
          </div>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'MachineModel',
  data() {
    return {
      model: {
        eqpId: '',
        detail: [],
        officeIds: [],
        bcCode: '',
        ip: '',
        modelName: '',
        modelId: '',
        location: '',
        activeFlag: '',
        delFlag: 0,
        officeId: '',
        projectId: '2'
      },
      rowData: [],
      gridData: [], // 多个形式 gridData:[{id:'',head:['key1','key2','key3'],data:[[{'key1':'', }, 'key2':'', 'key3': ''],]}]
      formConf: {
        url: '/ms/msmeasurerecord/',
        title: {
          ADD: '新增记录',
          EDIT: '修改记录',
          VIEW: '记录详情'
        },
        rules: {
          eqpId: [{ required: true, message: '设备号必填', trigger: 'blur' }],
          modelName: [{ required: true, message: '设备类型必填', trigger: ['blur', 'change'] }],
          activeFlag: [{ required: true, message: '有效标志必选', trigger: 'change' }]
        },
        onLoadData: (m, type) => {
          console.info(m)
          // m.officeIds = m.officeIds.split(',')
          this.rowData = []
          this.gridData = []
          if (m.detail) {
            for (let i = 0; i < m.detail.length; i++) {
              if (m.detail[i].showType === 'input') {
                this.rowData.push(m.detail[i])
              } else if (m.detail[i].showType === 'grid') {
                this.setGridData(m.detail[i], m.detail[i].msRecordId, m.detail[i].itemName, m.detail[i].itemValue)
              }
            }
          }
          return m
        },
        beforeSubmit: (params, type) => {
          const re = { ...params }
          // re.officeId = re.officeIds[re.officeIds.length - 1]
          // re.officeIds = undefined
          return re
        }
      }
    }
  },
  methods: {
    onDisplayChange(e) {
      this.model.modelName = e
    },
    groupData(gd, id, heads, grids, itemResult, limitMin, limitMax) {
      if (gd === null) {
        gd = {}
        gd.id = id
        gd.head = heads
        gd.data = []
      }
      const row = []
      for (let j = 0; j < heads.length; j++) {
        const hd = heads[j]
        if (j < grids.length) {
          const cel = {}
          Vue.set(cel, hd, grids[j])
          if (itemResult === 'N' && (grids[j] < limitMin[j] || grids[j] > limitMax[j])) {
            Vue.set(cel, 'className', 'jk-font-red')
          }
          row.push(cel)
        }
      }
      gd.data.push(row)
      return gd
    },
    setGridData(detail) {
      const id = detail.msRecordId
      const heads = detail.itemName
      const grids = detail.itemValue
      const itemResult = detail.itemResult
      const limitMin = detail.limitMin ? detail.limitMin.split(',') : []
      const limitMax = detail.limitMax ? detail.limitMax.split(',') : []
      if (this.gridData.length <= 0) {
        const gd = this.groupData(null, id, heads.split(','), grids.split(','), itemResult, limitMin, limitMax)
        this.gridData.push(gd)
      } else {
        for (let i = 0; i < this.gridData.length; i++) {
          if (id === this.gridData[i].id) {
            const gd = this.gridData[i]
            this.groupData(gd, id, heads.split(','), grids.split(','), itemResult, limitMin, limitMax)
          } else {
            const gd = this.groupData(null, id, heads.split(','), grids.split(','), itemResult, limitMin, limitMax)
            this.gridData.push(gd)
          }
        }
      }
    },
    headStyle() {
      return 'headStyle'
    }
  }
}
</script>
<style lang="scss">
  .el-table th, .headStyle {
    background-color: #1e6abc;
    color: white;
  }

  .el-input.is-disabled.jk-font-red .el-input__inner {
    color: red;
  }

  .el-table tr .jk-font-red {
    color: red;
  }
</style>
