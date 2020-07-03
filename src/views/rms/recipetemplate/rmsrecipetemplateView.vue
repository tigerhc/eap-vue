<template>
  <div class="app-container calendar-list-container">
    <w-form v-bind="formConf" :col="3" :model="model">
      <el-input v-model="model.manufacturerName" label="设备厂家" />
      <el-input v-model="model.classCode" label="设备类型" />
      <el-input v-model="model.updateDate" :disabled="true" label="更新时间" />
    </w-form>
    <div style="border-top:1px solid #ddd;padding:5px 0;margin:10px 0" />
    <w-edt-table v-slot="{row}" ref="language" v-bind="table" :params="table.eqpModelId" url="/rms/rmsrecipetemplate/">
      <w-table-col name="eqpModelId" required label="设备类型ID" query condition="eq" hidden>
        <el-input v-model="table.model.eqpModelId" />
      </w-table-col>
      <w-table-col name="paraCode" required label="参数代码" query condition="like">
        <el-input v-model="table.model.paraCode" />
      </w-table-col>
      <w-table-col name="paraName" label="参数名" query condition="like">
        <el-input v-model="table.model.paraName" />
      </w-table-col>
      <w-table-col name="paraShortName" label="参数简称" >
        <el-input v-model="table.model.paraShortName" />
      </w-table-col>
      <w-table-col name="paraUnit" label="单位" >
        <el-input v-model="table.model.paraUnit" />
      </w-table-col>
      <w-table-col name="setValue" label="设定值" >
        <el-input v-model="table.model.setValue" />
      </w-table-col>
      <w-table-col name="showFlag" label="是否首页显示" dict="SHOW_FLAG" >
        <w-select-dic v-model="table.model.showFlag" style="width:100%" label="显示" dict="SHOW_FLAG" />
      </w-table-col>
      <w-table-col name="monitorFlag" label="是否监控" dict="MONITOR_FLAG" >
        <w-select-dic v-model="table.model.monitorFlag" style="width:100%" label="是否监控" dict="MONITOR_FLAG" />
      </w-table-col>
      <w-table-col name="sortNo" label="排序号" >
        <el-input v-model="table.model.sortNo" />
      </w-table-col>
    </w-edt-table>
  </div>
</template>
<script>
export default {
  name: 'OvenEditModel',
  data() {
    return {
      type: 'View',
      model: {
        manufacturerName: '',
        classCode: '',
        activeFlag: '',
        detail: [],
        updateDate: ''
      },
      table: {
        rules: {
          paraName: [{ required: true, message: '设备号必填', trigger: 'blur' }],
          paraCode: [{ required: true, message: '设备类型必填', trigger: ['blur', 'change'] }],
          itemCode: [{ required: true, message: '有效标志必选', trigger: 'change' }]
        },
        model: {
          eqpModelId: '',
          paraCode: '',
          paraName: '',
          paraShortName: '',
          paraUnit: '',
          setValue: '',
          showFlag: '',
          monitorFlag: '',
          sortNo: ''
        },
        datas: [],
        eqpModelId: ''
      },
      formConf: {
        url: '/fab/fabequipmentmodel/',
        title: {
          ADD: '新增配方模板',
          EDIT: '修改配方模板',
          VIEW: '配方模板详情'
        },
        rules: {
          eqpModelName: [{ required: true, message: '设备类型必填', trigger: 'blur' }],
          productionNo: [{ required: true, message: '机种必填', trigger: ['blur', 'change'] }]
        },
        onLoadData: (m, type) => {
          console.log(m)
          this.table.datas = m.detail
          this.table.model.eqpModelId = m.id
          this.table.eqpModelId = m.id
        },
        beforeSubmit: (params, type) => {
          console.log('submit params->' + JSON.stringify(params))
          delete params['detail'] // 删除原数据模型里的多语言数组
          const lang = this.$refs.language.tranformData('detail') // 获取被转换格式的所有细表数据
          const re = { ...params, ...lang } // 合并细表数据
          return re // 返回新的数据模型
        }
      }
    }
  },
  created() {
    this.type = this.$route.query.type
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    newGrid() {
      const p = { paraCode: '', paraName: '', paraShortName: '', paraUnit: '', setValue: '', showFlag: '', monitorFlag: '', sortNo: '' }
      this.model.detail.push(p)
    }
  }
}
</script>
