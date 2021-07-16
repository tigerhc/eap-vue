<template>
  <div class="app-container calendar-list-container">
    <w-form v-bind="formConf" :col="3" :model="model" :bottom-btn="true">
      <el-input v-model="model.manufacturerName" :disabled="true" label="设备厂家" />
      <el-input v-model="model.classCode" :disabled="true" label="设备类型" />
      <el-input v-model="model.updateDate" :disabled="true" label="更新时间" />
    </w-form>
    <div style="border-top: 1px solid #ddd; padding: 5px 0; margin: 10px 0" />
    <w-edt-table v-slot="{}" ref="language" v-bind="table" :params="table.param" url="/rms/rmsrecipetemplate/">
      <w-table-col name="paraCode" align="center" required label="参数代码" query condition="like" />
      <w-table-col name="paraName" align="center" label="参数名" query condition="like">
        <el-input v-model="table.model.paraName" />
      </w-table-col>
      <w-table-col name="limitMin" label="最小值" width="100px">
        <el-input v-model="table.model.limitMin" />
      </w-table-col>
      <w-table-col name="limitMax" label="最大值" width="100px">
        <el-input v-model="table.model.limitMax" />
      </w-table-col>
      <w-table-col name="setValue" label="设定值" width="100px">
        <el-input v-model="table.model.setValue" />
      </w-table-col>
      <w-table-col name="showFlag" label="是否显示" query condition="eq" dict="SHOW_FLAG">
        <w-select-dic v-model="table.model.showFlag" style="width: 100%" label="显示" dict="SHOW_FLAG" />
      </w-table-col>
      <w-table-col name="monitorFlag" label="是否监控" dict="MONITOR_FLAG">
        <w-select-dic v-model="table.model.monitorFlag" style="width: 100%" label="是否监控" dict="MONITOR_FLAG" />
      </w-table-col>
      <w-table-col name="sortNo" label="排序号" width="100px">
        <el-input v-model="table.model.sortNo" />
      </w-table-col>
      <w-table-toolbar name="add" hidden />
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-button name="delete" hidden />
      <w-table-toolbar
        name="uploadRecipeTemplateButton"
        label="上传模板"
        type="primary"
        tip="上传模板？"
        icon="el-icon-circle-plus-outline"
      />
    </w-edt-table>

    <el-dialog :visible.sync="dialogFormUploadRecipeTemplateVisible" title="上传模板">
      <!--<el-form ref="dataModifyForm" :rules="modifyPasswordRules" :model="modifyPassword" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">-->
      <el-form
        ref="dataModifyForm"
        :model="uploadRecipeTemplate"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <!--        <el-form-item label="程序名称" prop="recipeName">-->
        <!--          <el-input v-model="uploadRecipeTemplate.recipeName"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="文件名称" prop="recipeName">
          <el-input v-model="uploadRecipeTemplate.fileName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormUploadRecipeTemplateVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="doUploadRecipeTemplate">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'
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
          paraCode: [{ required: true, message: '设备类型必填', trigger: 'blur' }],
          itemCode: [{ required: true, message: '有效标志必选', trigger: 'change' }]
        },
        model: {
          paraCode: '',
          paraName: '',
          limitMin: '',
          limitMax: '',
          setValue: '',
          showFlag: '',
          monitorFlag: '',
          sortNo: ''
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
      const p = {
        paraCode: '',
        paraName: '',
        limitMin: '',
        limitMax: '',
        setValue: '',
        showFlag: '',
        monitorFlag: '',
        sortNo: ''
      }
      this.model.detail.push(p)
    },
    // 弹出一个input框,输入后发送请求
    uploadRecipeTemplateButton(row, table, ctx) {
      this.dialogFormUploadRecipeTemplateVisible = true
    },
    doUploadRecipeTemplate() {
      request({
        url: 'rms/rmsrecipetemplate/uploadRecipeTemplate',
        method: 'post',
        params: {
          eqpModelId: this.table.param.eqpModelId,
          fileName: this.uploadRecipeTemplate.fileName
        }
      }).then((res) => {
        if (res.data.code === 0) {
          this.$notify({
            title: '成功',
            message: '上传模板成功',
            type: 'success',
            duration: 2000
          })
          this.dialogFormUploadRecipeTemplateVisible = false
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>
