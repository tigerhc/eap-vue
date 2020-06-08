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
                <el-input v-model="item.itemValue"/>
              </el-form-item>
            </el-col>
            <el-col v-if="index < rowData.length" :xs="24" :span="8">
              <el-form-item :label="rowData[index+1].itemName" label-width="150px">
                <el-input v-model="rowData[index+1].itemValue"/>
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
          stripe
          style="width: 100%">
          <div v-for="col in item.head" :key="col">
            <el-table-column
              :prop="col"
              :label="col"
              width="180"/>
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
      gridData: [], // 多个形式 gridData:[{id:'',head:[],data:[]}]
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
                this.setGridData(m.detail[i].msRecordId, m.detail[i].itemName, m.detail[i].itemValue)
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
    setGridData(id, heads, grids) {
      if (this.gridData.length <= 0) {
        const gd = {}
        gd.id = id
        gd.head = heads.split(',')
        const row = {}
        const grid = grids.split(',')
        gd.data = []
        for (let j = 0; j < gd.head.length; j++) {
          const hd = gd.head[j]
          if (j < grid.length) {
            Vue.set(row, hd, grid[j])
          }
        }
        gd.data.push(row)
        this.gridData.push(gd)
      } else {
        for (let i = 0; i < this.gridData.length; i++) {
          let gd = this.gridData[i]
          if (id === gd.id) {
            const row = {}
            const grid = grids.split(',')
            for (let j = 0; j < gd.head.length; j++) {
              const hd = gd.head[j]
              if (j < grid.length) {
                Vue.set(row, hd, grid[j])
              }
            }
            gd.data.push(row)
          } else {
            gd = {}
            gd.id = id
            gd.head = heads.split(',')
            const row = {}
            const grid = grids.split(',')
            gd.data = []
            for (let j; j < gd.head.length; j++) {
              const hd = gd.head[j]
              if (j < grid.length) {
                Vue.set(row, hd, grid[j])
              }
            }
            gd.data.push(row)
            this.gridData.push(gd)
          }
        }
      }
    }
  }
}
</script>
