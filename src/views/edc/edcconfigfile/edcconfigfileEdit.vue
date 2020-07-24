<template>
  <div class="app-container calendar-list-container">
    <w-form v-bind="formConf" :col="3" :model="model" :bottom-btn="true">
      <el-input v-model="model.manufacturerName" :disabled="true" label="设备厂家" />
      <el-input v-model="model.classCode" :disabled="true" label="设备类型" />
      <el-input v-model="model.fileType" :disabled="true" label="文件类型" />
    </w-form>
    <div style="border-top:1px solid #ddd;padding:5px 0;margin:10px 0" />
    <w-edt-table v-slot="{row}" ref="language" v-bind="table" :params="table.param" sort="sort_no.asc" url="/edc/edcconfigfilecsv/">
      <w-table-col name="colCode" required label="参数代码" edit="false" query condition="like">
        <el-input v-model="table.model.colCode" />
      </w-table-col>
      <w-table-col name="colName" label="参数名" query condition="like">
        <el-input v-model="table.model.colName" />
      </w-table-col>
      <w-table-col name="colShortName" label="参数简称" >
        <el-input v-model="table.model.colShortName" />
      </w-table-col>
      <w-table-col name="paraUnit" label="单位" >
        <el-input v-model="table.model.paraUnit" />
      </w-table-col>
      <w-table-col name="defaultValue" label="默认值" >
        <el-input v-model="table.model.defaultValue" />
      </w-table-col>
      <w-table-col name="monitorFlag" label="是否监控" dict="MONITOR_FLAG" >
        <w-select-dic v-model="table.model.monitorFlag" style="width:100%" label="是否监控" dict="MONITOR_FLAG" />
      </w-table-col>
      <w-table-col name="colLevel" label="参数等级" query condition="eq" dict="COL_LEVEL" >
        <w-select-dic v-model="table.model.colLevel" style="width:100%" label="显示" dict="COL_LEVEL" />
      </w-table-col>
      <w-table-col name="colDataType" label="参数数据类型" query condition="eq" dict="COL_DATA_TYPE" >
        <w-select-dic v-model="table.model.colDataType" style="width:100%" label="显示" dict="COL_DATA_TYPE" />
      </w-table-col>
      <w-table-col name="sortNo" label="排序号" >
        <el-input v-model="table.model.sortNo" />
      </w-table-col>
      <w-table-toolbar name="add" hidden/>
      <w-table-toolbar name="batchDelete" hidden/>
      <w-table-button name="delete" hidden/>
    </w-edt-table>
  </div>
</template>
<script>
export default {
  name: 'EdcConfigFileEdit',
  data() {
    return {
      type: 'View',
      model: {
        manufacturerName: '',
        classCode: '',
        fileType: '',
        detail: [],
        updateDate: ''
      },
      table: {
        rules: {
          paraName: [{ required: true, message: '设备号必填', trigger: 'blur' }],
          paraCode: [{ required: true, message: '设备类型必填', trigger: 'blur' }],
          itemCode: [{ required: true, message: '有效标志必选', trigger: 'change' }]
        },
        model: {
          calCode: '',
          calName: '',
          calShortName: '',
          paraUnit: '',
          defaultValue: '',
          monitorFlag: '',
          colLevel: '',
          colDataType: '',
          sortNo: ''
        },
        datas: [],
        param: {
          eqpModelId: '',
          fileType: ''
        }
      },
      formConf: {
        url: '/fab/fabequipmentmodel/',
        title: {
          ADD: '新增文件配置',
          EDIT: '修改文件配置',
          VIEW: '文件配置详情'
        },
        rules: {
          eqpModelName: [{ required: true, message: '设备类型必填', trigger: 'blur' }],
          productionNo: [{ required: true, message: '机种必填', trigger: ['blur', 'change'] }]
        },
        onLoadData: (m, type) => {
          console.log(m)
          this.table.datas = m.detail
          this.table.param = { eqpModelId: m.id }
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
    this.model.fileType = this.$route.query.param.fileType
    this.table.param.fileType = this.$route.query.param.fileType
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    newGrid() {
      const p = { calCode: '', calName: '', calShortName: '', paraUnit: '', defaultValue: '', monitorFlag: '', colLevel: '', colDataType: '', sortNo: '' }
      this.model.detail.push(p)
    }
  }
}
</script>
