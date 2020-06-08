<template>
  <div>
    <w-form v-bind="formConf" :col="3" :model="model">
      <el-input v-model="model.recordId" label="流水号" />
      <el-input v-model="model.eqpId" label="设备号" />
      <el-input v-model="model.lotNo" label="批号" />
      <el-input v-model="model.waferId" label="晶圆ID" />
      <el-input v-model="model.timing" label="时机" />
<!--      <w-select-dept v-model="model.sampleCount" label="采样数" />-->
      <el-input v-model="model.status" label="状态" />
      <el-input v-model="model.approveResult" label="判定结果" />
      <el-row col="24" />
      <el-input v-model="model.createByName" :disabled="true" label="创建人" />
      <el-input v-model="model.createDate" :disabled="true" label="创建日期" />
    </w-form>
    <el-form v-if="rowData.length > 0" :model="model" disabled="true">
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
</template>
<script>
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
      rowData: [{
        'delFlag': '0',
        'id': '111',
        'itemName': 'Range',
        'itemResult': 'Y',
        'itemValue': '10.1875',
        'limitMax': '15',
        'limitMin': '6',
        'msRecordId': '41ac7f6818654f6eb48de5b96f31aafd',
        'sampleNo': 1,
        'showType': 'input',
        'sortNo': 1
      }, {
        'delFlag': '0',
        'id': '222',
        'itemName': 'Points Tested',
        'itemResult': 'Y',
        'itemValue': '37',
        'limitMax': '10',
        'limitMin': '',
        'limitType': '',
        'msRecordId': '41ac7f6818654f6eb48de5b96f31aafd',
        'sampleNo': 1,
        'showType': 'input',
        'sortNo': 2
      }],
      gridData: [],
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
          // this.rowData = []
          this.gridData = []
          if (m.detail) {
            for (let i = 0; i < m.detail.length; i++) {
              if (m.detail[i].showType === 'input') {
                // this.rowData.push(m.detail[i])
              } else if (m.detail[i].showType === 'grid') {
                this.gridData.push(m.detail[i])
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
    }
  }
}
</script>
