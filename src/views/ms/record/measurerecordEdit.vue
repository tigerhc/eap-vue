<template>
  <div>
    <w-form v-bind="formConf" :col="3" :model="model" :bottom-btn="true">
      <el-input v-model="model.recordId" label="流水号"/>
      <el-input v-model="model.eqpId" label="设备号"/>
      <el-row col="24" />
      <el-input v-model="model.productionNo" label="产品"/>
      <el-input v-model="model.productionName" label="产品名"/>
      <el-input v-model="model.lotNo" label="批号"/>
      <el-input v-model="model.waferId" label="晶圆ID"/>
      <el-input v-model="model.timing" label="时机"/>
      <el-input v-model="model.sampleCount" label="采样数"/>
      <el-input v-model="model.status" label="状态"/>
      <w-select-dic v-model="model.approveResult" style="width:100%" label="判定结果" dict="JUDGE_RESULT" />
      <el-input v-model="model.createBy" :disabled="true" label="量测人" />
      <el-input v-model="model.updateDate" :disabled="true" label="更新日期" />
    </w-form>
    <div class="model">
<!--      <el-button class="exportBtn" @click="exportDetail">-->
<!--        <i class="fa-download"/>-->
<!--        <span>导出Excel</span>-->
<!--      </el-button>-->
      <el-form v-if="rowData.length > 0" :model="model" disabled>
        <div v-for="(item,index) in rowData" :key="item.id">
          <el-row v-if="index%3==0">
            <el-col :xs="24" :span="8">
              <el-form-item :label="item.itemName" label-width="150px">
                <el-input v-model="item.itemValue" :class="item.itemResult == 'N'?'jk-font-red':''"/>
              </el-form-item>
            </el-col>
            <el-col v-if="(index+1) < rowData.length" :xs="24" :span="8">
              <el-form-item :label="rowData[index+1].itemName" label-width="150px">
                <el-input v-model="rowData[index+1].itemValue" :class="rowData[index+1].itemResult == 'N'?'jk-font-red':''"/>
              </el-form-item>
            </el-col>
            <el-col v-if="(index+2) < rowData.length" :xs="24" :span="8">
              <el-form-item :label="rowData[index+2].itemName" label-width="150px">
                <el-input v-model="rowData[index+2].itemValue" :class="rowData[index+2].itemResult == 'N'?'jk-font-red':''"/>
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
          :cell-class-name="bodyRowStyle"
          border

          stripe>
          <el-table-column fixed type="index"/>
          <div v-for="(col, index) in item.head" :key="col">
            <el-table-column v-if="index==0" :prop="col.rowName" label="rowName">
              <template slot-scope="scope">
                <div>{{ scope.row[index].rowName }}</div>
              </template>
            </el-table-column>
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
    <div class="model">
        <div class="jk-grid-9-parent">
          <div v-for="(item,index) in circles" :key="index" class="jk-grid-9-item">
            {{ index+1 }}<w-circle-jy :ary="item"/>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import request from '@/utils/request'

export default {
  name: 'MachineModel',
  data() {
    return {
      circleIndex: 0,
      circles: [],
      sublist: [],
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
        projectId: '2',
        updateByName: '',
        createBy: '',
        updateDate: ''
      },
      param: {
        recordId: ''
      },
      exportsLoading: false,
      rowData: [],
      gridData: [], // 多个形式 gridData:[{id:'',head:['key1','key2','key3'],data:[[{'rowName':''},{'key1':'', }, 'key2':'', 'key3': ''],]}]
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
          this.param = { recordId: m.recordId }
          this.rowData = []
          this.gridData = []
          this.circles = []
          this.sublist = []
          if (m.detail) {
            for (let i = 0; i < m.detail.length; i++) {
              if (m.detail[i].showType === 'input') {
                this.rowData.push(m.detail[i])
              } else if (m.detail[i].showType === 'grid') {
                this.setGridData(m.detail[i], m.detail[i].msRecordId, m.detail[i].itemName, m.detail[i].itemValue)
              }
            }
            console.log(this.gridData)
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
    groupData(gd, id, heads, grids, itemResult, limitMin, limitMax, rowName) {
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
          cel.rowName = rowName
          row.push(cel)
        }
      }
      gd.data.push(row)
      if (!this.jumpFlag(rowName)) {
        this.sublist.push(row)
      }
      return gd
    },
    jumpFlag(rowname) {
      if (rowname.indexOf('R') >= 0 || rowname.indexOf('A') >= 0 || rowname.indexOf('U') >= 0) {
        return true
      } else {
        return false
      }
    },
    setGridData(detail) {
      const id = detail.msRecordId
      const heads = detail.itemName
      const grids = detail.itemValue
      const itemResult = detail.itemResult
      const limitMin = detail.limitMin ? detail.limitMin.split(',') : []
      const limitMax = detail.limitMax ? detail.limitMax.split(',') : []
      const rowName = detail.rowName
      if (this.gridData.length <= 0) {
        const gd = this.groupData(null, id, heads.split(','), grids.split(','), itemResult, limitMin, limitMax, rowName)
        this.circleIndex = 1
        this.gridData.push(gd)
        if (!this.jumpFlag(rowName)) {
          this.sublist.push(gd.data)
        }
      } else {
        for (let i = 0; i < this.gridData.length; i++) {
          if (id === this.gridData[i].id) {
            const gd = this.gridData[i]
            if (!this.jumpFlag(rowName)) {
              this.circleIndex++
            }
            if ((this.circleIndex === 5 || this.circleIndex === 9) && this.jumpFlag(rowName)) {
              this.groupCircles(heads.split(','), this.sublist)
              console.log(this.circleIndex)
              this.circleIndex = 0
              this.sublist = []
            }
            this.groupData(gd, id, heads.split(','), grids.split(','), itemResult, limitMin, limitMax, rowName)
          } else {
            const gd = this.groupData(null, id, heads.split(','), grids.split(','), itemResult, limitMin, limitMax, rowName)
            this.circleIndex = 1
            this.gridData.push(gd)
            if (!this.jumpFlag(rowName)) {
              this.sublist.push(gd.data)
            }
          }
        }
      }
    },
    groupCircles(heads, datas) {
      // data:[[{'rowName':''},{'key1':'', }, 'key2':'', 'key3': ''],]}]
      for (let i = 0; i < heads.length; i++) {
        // eslint-disable-next-line no-unused-vars
        const p = []
        for (const argumentsKey in datas) {
          if (datas[argumentsKey][i][heads[i]] !== undefined) {
            p.push(datas[argumentsKey][i][heads[i]])
          }
        }
        this.circles.push(p)
      }
    },
    headStyle() {
      return 'headStyle'
    },
    bodyRowStyle(row, rowIndex) {
      return 'rowStyle'
    },
    exportDetail() {
      if (this.exportsLoading) {
        return
      }
      this.exportsLoading = true
      request({
        url: 'ms/msmeasurerecord/exportDetail',
        method: 'post',
        params: this.param
      }).then((res) => {
        if (res.data.code === 0) {
          return import('@/vendor/Export2Excel').then((excel) => {
            excel.export_byte_to_excel(res.data.bytes, res.data.title)
            this.exportsLoading = false
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: (res && res.data.errmsg) || '导出失败!',
            duration: 2000
          })
          this.exportsLoading = false
        }
      })
        .catch((e) => {
          this.exportsLoading = false
        })
    }
  }
}
</script>
<style lang="scss">
  .exportBtn {
    width: 150px;
    height: 40px;
    display: block;
    position: absolute;
    top: 310px;
    right:40px;
    font-size: 14px;
    padding: 10px 20px;
    border-radius: 4px;
    border: 1px solid #67c23a;
    color: #fff;
    background-color: #67c23a;
    line-height: 1;
    font-weight: 500;
    transition: .1s;
  }
  .el-table th, .headStyle {
    background-color: #1e6abc;
    color: white;
  }
  .el-table .rowStyle {
    /*padding: 2px 0px;*/
    /*margin: 0;*/
    font-weight:bold
  }
  .el-table {
    /*min-height: calc(100vh - 84px - 96px - 42px);*/
    min-height: auto;
  }
  .el-input.is-disabled.jk-font-red .el-input__inner {
    color: red;
  }

  .el-table tr .jk-font-red {
    color: red;
  }
  .jk-grid-9-parent {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  .jk-grid-9-item {
    width: calc(100vh - 180px - 50px) / 3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    margin-left: 10px;
  }
  /*.jk-grid-9-item:not(first-child) {*/
    /*margin-left: 10px;*/
  /*}*/
</style>
