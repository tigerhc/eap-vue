<template>
  <div class="programEdit">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="程序信息" name="first">
        <el-form ref="addForm" :inline="true" :rules="rules" :model="editList" class="editForm" label-width="150px">
          <el-form-item label="程序名称" prop="recipeCode">
            <el-input v-model="editList.recipeCode"/>
          </el-form-item>
          
          <el-form-item label="程序版本" prop="versionNo">
            <el-input v-model="editList.versionNo"/>
          </el-form-item>
          <el-form-item label="设备号" prop="eqpId">
            <el-input v-model="editList.eqpId"/>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="editList.status" filterable placeholder="请选择程序状态">
              <el-option
                v-for="item in dictList.statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态" prop="approveStep">
            <el-select v-model="editList.approveStep" filterable placeholder="请选择审核状态">
              <el-option
                v-for="item in dictList.approveStepList"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="审核结果" prop="approveResult">
            <el-select v-model="editList.approveResult" filterable placeholder="请选择审核结果">
              <el-option
                v-for="item in dictList.approveResultList"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型" prop="eqpModelId">
            <el-select v-model="editList.eqpModelId" filterable placeholder="请选择设备类型">
              <el-option
                v-for="item in eqpModelNameList"
                :key="item.id"
                :label="item.classCode"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="升级类型" prop="versionType">
            <el-radio-group v-model="versionType">
              <el-radio :label="2">设备</el-radio>
              <el-radio :label="3">通用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="程序描述" prop="recipeDesc">
            <el-input
              :autosize="{ minRows: 4}"
              v-model="editList.recipeDesc"
              style="width:540px"
              type="textarea"
              placeholder="请输入内容"/>
          </el-form-item>
        </el-form>
        <div v-if="showFlag">
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="参数信息" name="second">
        <div style="margin-bottom:20px">
          <el-button type="primary" size="small" icon="el-icon-plus" >新增</el-button>
          <el-button type="primary" size="small" icon="el-icon-delete" >删除</el-button>
          <el-button type="primary" size="small" @click="setCopy">设定值复制</el-button>
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
            border
            fit
            style="width: 100%"
            highlight-current-row
            :cell-class-name="color"
            @row-click="rowClick"
            @row-dblclick="doubleClick"
          >
            <el-table-column type="index" label="序号" width="50px" align="center"/>
            <el-table-column prop="paraCode" label="参数CODE" align="center">
              
            </el-table-column>
            <el-table-column prop="paraName" label="参数名称" align="center">
            </el-table-column>
            <el-table-column  label="设定值" align="center">
              <el-table-column prop="setValue" label="New Value" align="center">
                <template slot-scope="{row}">
                <el-input
                  v-if="row.index === doubleClickIndex"
                  v-model="row.setValue"
                />
                <span v-if="row.index !== doubleClickIndex" class="cell-text">{{ row.setValue }}</span>
              </template>
              </el-table-column>
               <el-table-column prop="setValueOld" label="Old Value" align="center"></el-table-column>
              
            </el-table-column>
            <el-table-column  label="最小值" align="center">
               <el-table-column  prop="minValue" label="New Value" align="center">
                 <template  slot-scope="{row}">
                  <el-input
                    v-if="row.index === doubleClickIndex"
                    v-model="row.minValue"
                  />
                  <span v-if="row.index !== doubleClickIndex" class="cell-text">{{ row.minValue }}</span>
              </template>
               </el-table-column>
               <el-table-column prop="minValueOld" label="Old Value" align="center"></el-table-column>
              
            </el-table-column>
            <el-table-column  label="最大值" align="center">
              <el-table-column prop="maxValue" label="New Value" align="center">
                <template slot-scope="{row}">
                <el-input
                  v-if="row.index === doubleClickIndex"
                  v-model="row.maxValue"
                />
                <span v-if="row.index !== doubleClickIndex" class="cell-text">{{ row.maxValue }}</span>
              </template>
               </el-table-column>
               <el-table-column prop="maxValueOld" label="Old Value" align="center"></el-table-column>
              
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="附件" name="third">
        <div style="margin-bottom:20px">
          <el-button type="primary" size="small" >上传</el-button>
        </div>
        <el-table
        :data="fileData"
        fit
        style="width: 100%"
        highlight-current-row
        >
        <el-table-column type="index" label="序号" width="50px" align="center"/>
        <el-table-column prop="paraCode" label="附件名称" align="center">
        </el-table-column>
        <el-table-column prop="paraCode" label="附件类型" align="center">
        </el-table-column>
        <el-table-column prop="paraCode" label="附件大小" align="center">
        </el-table-column>
        <el-table-column prop="paraCode" label="创建时间" align="center">
        </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { fetchList, create, update, del, deteils, batchDelete, fetchDict } from '@/api/public'
import { fetchDeviceList } from '@/api/sys/device'
import request from '@/utils/request'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'ProgramEdit',
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
        versionNo: undefined
      },
      versionType: 2,
      dictList: {
        statusList: [],
        approveStepList: [],
        approveResultList: []
      },
      eqpModelNameList: [],
      ruleForm: {
        tableData: []
      },
      fileData:[],
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
    if (this.$route.query.type == 'deteils') {
      this.showFlag = false
    }
    this.getDeteils()
  },
  methods: {
    // 获取详情
    getDeteils() {
      request({
        url: 'rms/rmsrecipe/' + this.id + '/findCompareRecipe',
        method: 'get',
        params: this.uploadRecipe1
      }).then((res) => {
        this.editList = res.data.results
        this.ruleForm.tableData = res.data.results.rmsRecipeBodyDtlList
        this.oldId = res.data.results.oldId
      })
      // deteils(this.tab, this.id).then(res => {
      //   this.editList = res.data
      //   this.ruleForm.tableData = res.data.rmsRecipeBodyDtlList
      // })
    },
    getDictValue() {
      const typeList = ['RECIPE_VERSION_TYPE', 'RECIPE_STATUS', 'RECIPE_APPROVE_STEP', 'RECIPE_APPROVE_RESULT']
      const list = ['statusList', 'approveStepList', 'approveResultList']
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
      if(tab.index === '2') {
        //查询附件
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
      if (this.selectIndex != '') {
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
    queryFiles(){
      request({
        url: 'rms/rmsrecipefile/'+this.id +'/findFileByRecipeId',
        method: 'get',
        params: { }
      }).then((res) => {
        this.fileData = res.data.results
      })
    },
    save() {
      let eqpModelName = ''
      this.eqpModelNameList.forEach((item) => {
        if (item.id == this.editList.eqpModelId) {
          eqpModelName = item.classCode
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
        _detail: JSON.stringify(this.ruleForm.tableData)
      }
      update(this.tab, params).then((res) => {
        if (res.data.code == 0) {
          this.cancel()
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '添加失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    getView() {
      const List = this.$store.state.tagsView.visitedViews
      for (const item of List) {
        if (item.name == 'programAdd') {
          this.viewObj = item
        }
      }
    },
    cancel() {
      this.getView()
      this.$store.dispatch('delView', this.viewObj).then(({ visitedViews }) => {
        this.$router.push({ name: 'views/rms/recipe/rmsrecipeList' })
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
        this.getDeteils()
        this.$notify({
          title: '成功',
          message: res.data.msg,
          type: 'success',
          duration: 2000
        })
      })
    },
    minCopy() {
      request({
        url: 'rms/rmsrecipe/copyMinValue',
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
    color({ row, column, rowIndex, columnIndex }) {
      
      if (row.minValue !== row.minValueOld && columnIndex == 5) {
        return 'warning-cell'
      }
      if (row.setValue !== row.setValueOld && columnIndex == 3) {
        return 'warning-cell'
      }
      if (row.maxValue !== row.maxValueOld && columnIndex == 7) {
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
  .cell-text {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-table .warning-cell {
    background: yellow;
  }
}
</style>
