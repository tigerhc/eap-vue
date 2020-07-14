<template>
  <div class="programEdit">
    <el-tabs v-model="activeName" type="border-card" >
      <el-tab-pane label="计划总览" name="first">
        <w-form v-bind="formConf" :col="3" :model="model" :on-load-data="onFormLoadData">
          <el-input v-model="model.productionNo" label="品番" />
          <el-input v-model="model.productionName" label="品名" />
          <el-input v-model="model.planDate" label="投入日期" />
          <el-input v-model="model.lotQty" label="批次数量" />
          <el-input v-model="model.planQty" label="投入数" />
          <el-row col="24" />
          <el-input v-model="model.createByName" :disabled="true" label="创建人" />
          <el-input v-model="model.createDate" :disabled="true" label="创建日期" />
          <el-row col="24" />
          <el-input v-model="model.updateByName" :disabled="true" label="更新人" />
          <el-input v-model="model.updateDate" :disabled="true" label="更新日期" />
        </w-form>
      </el-tab-pane>
      <el-tab-pane label="计划详细" name="second">
        <w-edt-table ref="language" v-bind="detail">
          <w-table-col name="productionName" label="品名" align="center" width="400" />
          <w-table-col name="productionNo" label="品番" align="center" width="100"/>
          <w-table-col name="lotNo" label="批次" align="center" width="100"/>
          <w-table-col name="planDate" label="投入日期" width="180" />
          <w-table-col name="planQty" label="投入数" width="120" align="right" />
          <w-table-toolbar name="batchDelete" hidden />
          <w-table-button name="delete" hidden />
          <w-table-button name="edit" hidden />
          <w-table-toolbar name="add" hidden/>
          <w-table-toolbar name="search" hidden/>
          <!--<w-table-toolbar name="exports" hidden/>-->
        </w-edt-table>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'ApsplanpdtyieldEdit',
  data() {
    return {
      activeName: 'second',
      model: {
        eqpId: '',
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

      formConf: {
        url: '/aps/apsplanpdtyield/',
        title: {
          ADD: '新增生产计划',
          EDIT: '修改生产计划',
          VIEW: '生产计划详情'
        },
        rules: {
          eqpId: [{ required: true, message: '设备号必填', trigger: 'blur' }],
          modelName: [{ required: true, message: '设备类型必填', trigger: ['blur', 'change'] }],
          activeFlag: [{ required: true, message: '有效标志必选', trigger: 'change' }]
        },
        onLoadData: (m, type) => {
          alert(1)
          console.info(m)
          m.officeIds = m.officeIds.split(',')
          return m
        }
      },
      detail: {
        opHide: true,
        model: {
          alarmCode: ''
        },
        datas: []
      }
    }
  },
  methods: {
    onFormLoadData(data) {
      this.detail.datas = data.apsPlanPdtYieldDetailList
    },
    onDisplayChange(e) {
      this.formModel.modelName = e
    }
  }
}
</script>
