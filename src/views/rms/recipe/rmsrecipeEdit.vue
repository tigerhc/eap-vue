<template>
  <div class="programEdit">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="程序信息" name="first">
        <el-form ref="addForm" :inline="true" :rules="rules" :model="editList" class="editForm" label-width="150px">
          <el-form-item label="程序名称" prop="recipeCode">
            <el-input v-model="editList.recipeCode" disabled/>
          </el-form-item>

          <el-form-item label="程序版本" prop="versionNo">
            <el-input v-model="editList.versionNo" disabled/>
          </el-form-item>
          <el-form-item label="设备号" prop="eqpId">
            <el-input v-model="editList.eqpId" disabled/>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="editList.status" filterable placeholder="请选择程序状态">
              <el-option
                v-for="item in dictList.statusList"
                :disabled="item.remarks"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态" prop="approveStep">
            <el-select v-model="editList.approveStep" disabled filterable placeholder="请选择审核状态">
              <el-option
                v-for="item in dictList.approveStepList"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="审核结果" prop="approveResult">
            <el-select v-model="editList.approveResult" disabled filterable placeholder="请选择审核结果">
              <el-option
                v-for="item in dictList.approveResultList"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型" prop="eqpModelId">
            <el-select v-model="editList.eqpModelId" disabled filterable placeholder="请选择设备类型">
              <el-option
                v-for="item in eqpModelNameList"
                :key="item.id"
                :label="item.manufacturerName + '-' + item.classCode"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="升级类型" prop="versionType">
            <el-radio-group v-model="versionType">
              <el-radio :label="'EQP'">设备</el-radio>
              <el-radio :label="'GOLD'">通用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="程序描述" prop="recipeDesc">
            <el-input
              :autosize="{ minRows: 4}"
              v-model="editList.remarks"
              style="width:540px"
              type="textarea"
              placeholder="请输入内容"/>
          </el-form-item>
        </el-form>
        <div v-if="showFlag">
          <el-button type="primary" @click="save">提交</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="参数信息" name="second">
        <div style="margin-bottom:20px">
          <el-button type="primary" size="small" style="display: none" icon="el-icon-plus" >新增</el-button>
          <el-button type="primary" size="small" style="display: none" icon="el-icon-delete" >删除</el-button>
          <el-button type="primary" size="small" style="display: none" @click="setCopy">设定值复制</el-button>
          <el-button type="primary" size="small" @click="maxCopy" >最大值复制</el-button>
          <el-button type="primary" size="small" @click="minCopy">最小值复制</el-button>
        </div>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rulesTab"
          :inline="true"
          :label-position="'right'"
        >
          <el-table
            v-loading="load"
            :data="ruleForm.tableData"
            :row-class-name="tableRowClassName"
            :height="tableHeight"
            :cell-class-name="color"
            border
            fit
            style="width: 100%"
            highlight-current-row
            @row-click="rowClick"
            @row-dblclick="doubleClick"
          >
            <el-table-column type="index" label="序号" width="50px" align="center"/>
            <el-table-column prop="paraCode" label="参数CODE" align="left"/>
            <el-table-column prop="paraName" label="参数名称" align="left"/>
            <el-table-column label="设定值" align="center">
              <el-table-column prop="setValue" label="New Value" align="center"/>
              <el-table-column prop="setValueOld" label="Old Value" align="center"/>
            </el-table-column>
            <el-table-column label="最小值" align="center">
               <el-table-column prop="minValue" label="New Value" align="center">
                 <template slot-scope="{row}">
                  <el-input
                    v-if="row.index === doubleClickIndex"
                    v-model="row.minValue"
                  />
                  <span v-if="row.index !== doubleClickIndex" class="cell-text">{{ row.minValue }}</span>
                </template>
               </el-table-column>
               <el-table-column prop="minValueOld" label="Old Value" align="center"/>

            </el-table-column>
            <el-table-column label="最大值" align="center">
              <el-table-column prop="maxValue" label="New Value" align="center">
                <template slot-scope="{row}">
                <el-input
                  v-if="row.index === doubleClickIndex"
                  v-model="row.maxValue"
                />
                <span v-if="row.index !== doubleClickIndex" class="cell-text">{{ row.maxValue }}</span>
                </template>
               </el-table-column>
               <el-table-column prop="maxValueOld" label="Old Value" align="center"/>

            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="附件" name="third">
        <attachment-select :uploadurl="uploadurl" :biz="biz" @onSuccess="handleSuccessFile" />
      </el-tab-pane>
      <el-tab-pane label="图片" name="fourth">
        <picutre-select :uploadurl="uploadimageurl" :biz="biz"/>
<!--        <div style="margin-bottom:20px">-->
<!--          <el-upload-->
<!--            :action="uploadimageurl"-->
<!--            :on-preview="handlePreview"-->
<!--            :on-remove="handleRemove"-->
<!--            :before-remove="beforeRemove"-->
<!--            :limit="12"-->
<!--            :on-exceed="handleExceed"-->
<!--            :file-list="imageList"-->
<!--            class="upload-demo"-->
<!--            list-type="picture-card"-->
<!--            multiple>-->
<!--            <el-button size="small" type="primary">点击上传</el-button>-->
<!--            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
<!--          </el-upload>-->
<!--          <el-dialog :visible.sync="dialogVisible" width="500px" height="500px">-->
<!--            <img :src="dialogImageUrl" width="100%" height="100%" alt="">-->
<!--          </el-dialog>-->
<!--        </div>-->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { fetchDict } from '@/api/public'
import { fetchDeviceList } from '@/api/fab/model'
import request from '@/utils/request'
import AttachmentSelect from '../../../components/AttachmentSelect/index'
import PicutreSelect from '../../../components/PicutreSelect/index'

export default {
  name: 'ProgramEdit',
  components: { PicutreSelect, AttachmentSelect },
  data() {
    return {
      load: false,
      activeName: 'first',
      editList: {
        eqpId: undefined,
        recipeCode: undefined,
        eqpModelName: undefined,
        status: undefined,
        approveStep: undefined,
        approveResult: undefined,
        versionNo: undefined,
        remarks: ''
      },
      versionType: '',
      dictList: {
        versionTypeList: [],
        statusList: [],
        approveStepList: [],
        approveResultList: []
      },
      biz: this.$route.query.id,
      uploadurl: process.env.BASE_API + '/attach/upload?access_token=' + this.$store.getters.token + '&biz=' + this.$route.query.id,
      uploadimageurl: process.env.BASE_API + '/attach/uploadimg?access_token=' + this.$store.getters.token + '&biz=' + this.$route.query.id,
      dialogImageUrl: '',
      dialogVisible: false,
      imageList: [

      ],
      eqpModelNameList: [],
      ruleForm: {
        tableData: []
      },
      fileData: [],
      // 动态设置table高度
      tableHeight: document.body.scrollHeight - 210,
      tab: 'rms/rmsrecipe/',
      doubleClickIndex: '',
      selectIndex: '', // 选中的index
      selectRow: {}, // 选中一条数据
      chooseEditInfo: {}, // 双击修改的值
      rulesTab: {},
      showFlag: true,
      id: '',
      rules: {},
      oldId: ''
    }
  },
  created() {
    this.getDictValue()
    this.id = this.$route.query.id
    if (this.$route.query.type === 'deteils') {
      this.showFlag = false
    }
    this.getDeteils()
    this.gePictureList()
  },
  methods: {
    handleSuccessFile(file) {
      this.$notify({
        title: '上传成功',
        type: 'success',
        duration: 2000
      })
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
    // 获取详情
    getDeteils() {
      request({
        url: 'rms/rmsrecipe/' + this.id + '/findCompareRecipe',
        method: 'get',
        params: this.uploadRecipe1
      }).then((res) => {
        console.log(res)
        this.editList = res.data.results
        this.versionType = res.data.results.versionType
        this.ruleForm.tableData = res.data.results.rmsRecipeBodyDtlList
        this.oldId = res.data.results.oldId
        if (res.data.results.status !== '0' && res.data.results.status !== '2') {
          this.showFlag = false
        }
        if (res.data.results.status === 'Y') {
          this.editList.status = '启用'
        }
        if (res.data.results.status === 'N') {
          this.editList.status = '禁用'
        }
      })
      // deteils(this.tab, this.id).then(res => {
      //   this.editList = res.data
      //   this.ruleForm.tableData = res.data.rmsRecipeBodyDtlList
      // })
    },
    getDictValue() {
      const typeList = ['RECIPE_VERSION_TYPE', 'RECIPE_STATUS_SELECT', 'RECIPE_APPROVE_STEP', 'RECIPE_APPROVE_RESULT']
      const list = ['versionTypeList', 'statusList', 'approveStepList', 'approveResultList']
      for (let i = 0; i < typeList.length; i++) {
        this.getDictList(typeList[i], list[i])
      }
      // 获取设备类型
      this.getDevice()
    },
    getDevice() {
      const obj = {
        sort: 'updateDate',
        'page.pn': 1,
        'page.size': 999999,
        queryFields: 'id,manufacturerName,classCode,smlPath,hostJavaClass,activeFlag,iconPath,updateDate,'
      }
      fetchDeviceList(obj).then((response) => {
        this.eqpModelNameList = response.data.results
      })
    },
    // 获取字典list
    getDictList(type, name) {
      fetchDict(type).then((response) => {
        this.dictList[name] = response.data
      })
    },
    gePictureList() {
      request({
        url: 'attach/find?biz=' + this.id,
        method: 'get'
      }).then((res) => {
        console.log(res)
      })
    },
    add() {
      if (this.ruleForm.tableData.length > 0) {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.addRow()
          } else {
            return
          }
        })
      } else {
        this.addRow()
      }
    },
    addRow() {
      const addInfo = {
        paraCode: '',
        paraName: '',
        setValue: '',
        min_value: '',
        max_value: ''
      }
      this.ruleForm.tableData.push(addInfo)
      this.doubleClickIndex = this.ruleForm.tableData.length - 1
    },
    handleClick(tab, event) {
      if (tab.index === '2') {
        // 查询附件
        this.queryFiles()
      }
    },
    // 获取index
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    doubleClick(row, column, event) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.doubleClickIndex = row.index
          this.chooseEditInfo = row // 修改的值
        }
      })
    },
    rowClick(row, column, event) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (row.index !== this.doubleClickIndex) {
            this.doubleClickIndex = ''
          }
        }
        var index = row.index
        this.selectIndex = index // 选中行下标
        this.selectRow = JSON.parse(JSON.stringify(row)) // 选中的值
      })
    },
    del() {
      if (this.selectIndex !== '') {
        this.ruleForm.tableData.splice(this.selectIndex, 1)
      } else {
        this.$notify({
          showClose: true,
          message: '请选择至少一条数据删除',
          type: 'error',
          duration: 2000
        })
      }
    },
    queryFiles() {
      request({
        url: 'rms/rmsrecipefile/' + this.id + '/findFileByRecipeId',
        method: 'get',
        params: { }
      }).then((res) => {
        this.fileData = res.data.results
      })
    },
    save() {
      let eqpModelName = ''
      this.eqpModelNameList.forEach((item) => {
        if (item.id === this.editList.eqpModelId) {
          eqpModelName = item.manufacturerName + '-' + item.classCode
        }
      })
      const params = {
        id: this.id,
        recipeCode: this.editList.recipeCode,
        versionType: this.versionType,
        versionNo: this.editList.versionNo,
        eqpId: this.editList.eqpId,
        eqpModelId: this.editList.eqpModelId,
        eqpModelName,
        status: this.editList.status,
        approveStep: this.editList.approveStep,
        approveResult: this.editList.approveResult,
        remarks: this.editList.remarks
      }
      if (this.editList.status === '1' && this.versionType === 'DRAFT') {
        this.$notify({
          title: '失败',
          message: '请选选择升级类型再提交审批',
          type: 'error',
          duration: 2000
        })
      } else {
        console.log(params)
        request({
          url: 'rms/rmsrecipe/updatePermit',
          method: 'get',
          params: params
        }).then((res) => {
          console.log(res)
          if (res.data.code === 0) {
            this.addPermitList()
            this.cancel()
            this.$notify({
              title: '成功',
              message: '提交成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: '提交失败,' + res.data.msg,
              type: 'error',
              duration: 2000
            })
          }
        })
      }
    },
    // 提交审批后先生成审批记录
    addPermitList() {
      request({
        url: 'rms/rmsrecipepermit/addPermitList',
        method: 'get',
        params: { recipeId: this.id, versionType: this.versionType }
      })
    },
    getView() {
      const List = this.$store.state.tagsView.visitedViews
      for (const item of List) {
        if (item.name === 'programAdd') {
          this.viewObj = item
        }
      }
    },
    cancel() {
      this.getView()
      const { matched } = this.$route
      const cp = [...matched]
      const preRoute = cp[Math.max(cp.length - 2)]
      console.info('取消返回上级页面', preRoute)
      this.$store.dispatch('delView', this.$route).then(({ visitedViews }) => {
        this.$router.push({ path: preRoute && preRoute.path })
      })
    },
    setCopy() {
      request({
        url: 'rms/rmsrecipe/copySetValue',
        method: 'get',
        params: { recipeIdNew: this.id, recipeIdOld: this.oldId }
      }).then((res) => {
        this.getDeteils()
        this.$notify({
          title: '成功',
          message: res.data.msg,
          type: 'success',
          duration: 2000
        })
      })
    },
    maxCopy() {
      request({
        url: 'rms/rmsrecipe/copyMaxValue',
        method: 'get',
        params: { recipeIdNew: this.id, recipeIdOld: this.oldId }
      }).then((res) => {
        if (res.data.code === 0) {
          this.getDeteils()
          this.$notify({
            title: '成功',
            message: res.data.msg,
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    minCopy() {
      request({
        url: 'rms/rmsrecipe/copyMinValue',
        method: 'get',
        params: { recipeIdNew: this.id, recipeIdOld: this.oldId }
      }).then((res) => {
        if (res.data.code === 0) {
          this.getDeteils()
          this.$notify({
            title: '成功',
            message: res.data.msg,
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    color({ row, column, rowIndex, columnIndex }) {
      if (row.minValue !== row.minValueOld && columnIndex === 5) {
        return 'warning-cell'
      }
      if (row.setValue !== row.setValueOld && columnIndex === 3) {
        return 'warning-cell'
      }
      if (row.maxValue !== row.maxValueOld && columnIndex === 7) {
        return 'warning-cell'
      }
      return ''
    }
  }
}
</script>
<style lang="scss">
.programEdit {
  .editForm {
    .el-select {
      width: 185px;
    }
  }
  .el-table thead.is-group th{
    background-color: #1e6abc;
  }
  .cell-text {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-table .warning-cell {
    background: yellow;
  }
}
</style>
