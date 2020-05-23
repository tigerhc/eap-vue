<template>
  <div class="programEdit">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="报警总览" name="first">
        <w-form :col="4" :before-submit="beforeSubmit" :on-load-data="onFormLoadData" :model="editList" url="/edc/edcamsrptrecord">
          <el-input v-model="editList.eqpId" label="设备号" disabled />
          <el-input v-model="editList.alarmName" label="报警名称" disabled />
          <el-input v-model="editList.productionNo" label="品番" disabled />
          <el-input v-model="editList.lotNo" label="批次" disabled />
          <w-lookup
            v-model="editList.eqpModelId"
            :display.sync="editList.eqpModelName"
            idkey="id"
            displaykey="manufacturerName"
            label="设备型号名称"
            title="选择设备型号"
            module="views/fab/eqpmodel/eqpmodelLook"
            disabled
          />
          <w-select-dic v-model="editList.alarmCode" style="width:100%" label="Alarm类型" dict="AMS_ALARM_TYPE" disabled />
          <el-date-picker
            v-model="editList.createDate"
            label="报警时间"
            disabled
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期"
            style="width:100%"
          />
          <el-input v-model="editList.dealUserName" label="处理人" disabled />
          <el-date-picker
            v-model="editList.dealDate"
            label="处理时间"
            disabled
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期"
            style="width:100%"
          />
          <w-select-dic v-model="editList.dealFlag" label="处理结果" dict="DEAL_RESULT" />
          <el-row col="24" />
          <el-input
            :autosize="{ minRows: 4}"
            v-model="editList.dealDesc"
            style="width:540px"
            type="textarea"
            placeholder="请输入内容"
            label="处理说明"/>

        </w-form>
      </el-tab-pane>
      <el-tab-pane label="报警记录" name="second">
        <w-edt-table ref="language" v-bind="detail" url="11">
          <w-table-col name="startDate" label="报警时间" align="center" width="200" />
          <w-table-col name="alarmCode" label="报警ID" align="center" width="100"/>
          <w-table-col name="alarmName" label="报警描述" align="left" />
          <w-table-toolbar name="batchDelete" hidden />
          <w-table-button name="delete" hidden />
          <w-table-button name="edit" hidden />
          <w-table-toolbar name="add" hidden/>
          <w-table-toolbar name="search" hidden/>
          <!--<w-table-toolbar name="exports" hidden/>-->
        </w-edt-table>
      </el-tab-pane>
      <el-tab-pane label="BUY OFF" name="third">
        <attachment-select :uploadurl="uploadurl" :biz="biz" @onSuccess="handleSuccessFile" />
      </el-tab-pane>
      <el-tab-pane label="参考图片" name="fourth">
        <picutre-select :uploadurl="uploadimageurl" :biz="biz"/>
      </el-tab-pane>

      <!--<el-tab-pane label="附件" name="third">-->
        <!--<div style="margin-bottom:20px">-->
          <!--<el-button type="primary" size="small" >上传</el-button>-->
        <!--</div>-->
        <!--<el-table-->
          <!--:data="fileData"-->
          <!--fit-->
          <!--style="width: 100%"-->
          <!--highlight-current-row-->
        <!--&gt;-->
          <!--<el-table-column type="index" label="序号" width="50px" align="center"/>-->
          <!--<el-table-column prop="paraCode" label="附件名称" align="center"/>-->
          <!--<el-table-column prop="paraCode" label="附件类型" align="center"/>-->
          <!--<el-table-column prop="paraCode" label="附件大小" align="center"/>-->
          <!--<el-table-column prop="paraCode" label="创建时间" align="center"/>-->
        <!--</el-table>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="图片" name="fourth">-->
        <!--<div style="margin-bottom:20px">-->
          <!--<el-upload-->
            <!--:action="uploadurl"-->
            <!--:on-preview="handlePreview"-->
            <!--:on-remove="handleRemove"-->
            <!--:before-remove="beforeRemove"-->
            <!--:limit="3"-->
            <!--:on-exceed="handleExceed"-->
            <!--:file-list="imageList"-->
            <!--class="upload-demo"-->
            <!--list-type="picture-card"-->
            <!--multiple>-->
            <!--<el-button size="small" type="primary">点击上传</el-button>-->
            <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
          <!--</el-upload>-->
          <!--<el-dialog :visible.sync="dialogVisible" width="500px" height="500px">-->
            <!--<img :src="dialogImageUrl" width="100%" height="100%" alt="">-->
          <!--</el-dialog>-->
        <!--</div>-->
      <!--</el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
import AttachmentSelect from '../../../components/AttachmentSelect/index'
import PicutreSelect from '../../../components/PicutreSelect/index'
export default {
  name: 'AlarmsetAdd',
  components: { PicutreSelect, AttachmentSelect },
  data() {
    return {
      editFlag: true,
      activeName: 'first',
      editList: {
        monitorFlag: '',
        eqpModelId: '',
        alarmCode: '',
        eqpModelName: '',
        alarmName: ''
      },
      title: {
        ADD: '新增报警定义',
        EDIT: '修改报警定义',
        VIEW: '查看报警定义'
      },
      rules: {
        alarmName: [{ required: true, message: '报警名称必填', trigger: 'blur' }],
        eqpModelId: [{ required: true, message: '设备类型必选', trigger: 'change' }],
        alarmCode: [{ required: true, message: 'Alarm类型必选', trigger: 'change' }],
        monitorFlag: [{ required: true, message: '状态必选', trigger: 'change' }]
      },
      biz: this.$route.query.id,
      uploadurl: process.env.BASE_API + '/attach/upload?access_token=' + this.$store.getters.token + '&biz=' + this.$route.query.id,
      uploadimageurl: process.env.BASE_API + '/attach/uploadimg?access_token=' + this.$store.getters.token + '&biz=' + this.$route.query.id,

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
      // debugger
      this.detail.datas = data.edcAmsRptRecordDtlList
    },
    beforeSubmit(model) { // model 将被保存的表单模型
      delete model['edcAmsRptRecordDtlList'] // 删除原数据模型里的多语言数组
      // const lang = this.$refs.language.tranformData('edcAmsDefineI18nList') // 获取被转换格式的所有细表数据
      // const re = { ...model, ...lang } // 合并细表数据
      // return re // 返回新的数据模型
      return model
    },
    handleSuccessFile(file) {
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleClick(tab, event) {
      if (tab.index === '2') {
        // 查询附件
        // this.queryFiles()
        console.info('111')
      }
    }
  }
}
</script>
<style scoped>
.btn {
  text-align: center;
  margin-top: 20px;
}
</style>
