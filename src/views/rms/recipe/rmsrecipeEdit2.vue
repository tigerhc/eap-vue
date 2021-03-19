<template>
  <div class="app-container calendar-list-container">
    <w-form v-bind="formConf" :col="3" :model="model" :bottom-btn="true">
      <el-input v-model="model.eqpId" :disabled="true" label="设备号" />
      <el-input v-model="model.eqpModelName" :disabled="true" label="设备类型" />
      <el-input v-model="model.recipeCode" :disabled="true" label="程序名称" />
    </w-form>
    <div style="border-top:1px solid #ddd;padding:5px 0;margin:10px 0" />
    <w-edt-table v-slot="{row}" ref="language" v-bind="table" :params="table.param" url="/rms/rmsrecipebody/">
      <w-table-col name="paraCode" align="left" required label="参数代码" width="400px" query condition="like"/>
      <w-table-col name="paraName" align="left" label="参数名" width="300px" query condition="like">
        <el-input v-model="table.model.paraName" />
      </w-table-col>
      <w-table-col name="limitMin" label="最小值" >
        <el-input v-model="table.model.limitMin" />
      </w-table-col>
      <w-table-col name="limitMax" label="最大值" >
        <el-input v-model="table.model.limitMax" />
      </w-table-col>
      <w-table-col name="setValue" label="设定值" >
        <el-input v-model="table.model.setValue" />
      </w-table-col>
      <w-table-toolbar name="add" hidden/>
      <w-table-toolbar name="batchDelete" hidden/>
      <w-table-button name="delete" hidden/>
    </w-edt-table>
  </div>
</template>
<script>
export default {
  name: 'OvenEditRecipe',
  data() {
    return {
      type: 'View',
      model: {
        eqpId: '',
        eqpModelName: '',
        activeFlag: '',
        detail: [],
        recipeCode: ''
      },
      table: {
        rules: {
          paraName: [{ required: true, message: '设备号必填', trigger: 'blur' }],
          paraCode: [{ required: true, message: '设备类型必填', trigger: 'blur' }],
          itemCode: [{ required: true, message: '有效标志必选', trigger: 'change' }]
        },
        model: {
          paraCode: '',
          paraName: '',
          limitMin: '',
          limitMax: '',
          setValue: ''
        },
        datas: [],
        param: {
          eqpModelId: ''
        }
      },
      dialogFormUploadRecipeTemplateVisible: false,
      uploadRecipeTemplate: {
        fileName: ''
      },
      formConf: {
        url: '/fab/fabequipmentmodel/',
        title: {
          ADD: '新增配方',
          EDIT: '修改配方',
          VIEW: '配方详情'
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
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    newGrid() {
      const p = { paraCode: '', paraName: '', limitMin: '', limitMax: '', setValue: '' }
      this.model.detail.push(p)
    }
  }
}
</script>
