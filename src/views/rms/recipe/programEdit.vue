<template>
  <div class="programEdit">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="程序信息" name="first">
        <el-form ref="addForm" :inline="true" :rules="rules" :model="editList" class="editForm" label-width="150px">
          <el-form-item label="程序名称" prop="recipeCode">
            <el-input v-model="editList.recipeCode"/>
          </el-form-item>
          <el-form-item label="设备类型" prop="versionType">
            <el-select v-model="editList.versionType" filterable placeholder="请选择程序版本">
              <el-option
                v-for="item in dictList.versionTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="程序版本" prop="versionNo">
            <el-input v-model="editList.versionNo"/>
          </el-form-item>
          <el-form-item label="设备号" prop="eqpCode">
            <el-input v-model="editList.eqpCode"/>
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
          <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
          <el-button type="primary" icon="el-icon-delete" @click="del">删除</el-button>
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
            @row-click="rowClick"
            @row-dblclick="doubleClick"
          >
            <el-table-column type="index" label="序号" width="50px" align="center"/>
            <el-table-column prop="paraCode" label="参数CODE" align="center">
              <template slot-scope="{row}">
                <el-input
                  v-if="row.index === doubleClickIndex"
                  v-model="row.paraCode"
                />
                <span v-if="row.index !== doubleClickIndex" class="cell-text">{{ row.paraCode }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="paraName" label="参数名称" align="center">
              <template slot-scope="{row}">
                <el-input
                  v-if="row.index === doubleClickIndex"
                  v-model="row.paraName"
                />
                <span v-if="row.index !== doubleClickIndex" class="cell-text">{{ row.paraName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="setValue" label="设定值" align="center">
              <template slot-scope="{row}">
                <el-input
                  v-if="row.index === doubleClickIndex"
                  v-model="row.setValue"
                />
                <span v-if="row.index !== doubleClickIndex" class="cell-text">{{ row.setValue }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="min_value" label="规格最小值" align="center">
              <template slot-scope="{row}">
                <el-input
                  v-if="row.index === doubleClickIndex"
                  v-model="row.min_value"
                />
                <span v-if="row.index !== doubleClickIndex" class="cell-text">{{ row.min_value }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="max_value" label="规格最大值" align="center">
              <template slot-scope="{row}">
                <el-input
                  v-if="row.index === doubleClickIndex"
                  v-model="row.max_value"
                />
                <span v-if="row.index !== doubleClickIndex" class="cell-text">{{ row.max_value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { fetchList, create, update, del, deteils, batchDelete, fetchDict } from '@/api/public'
import { fetchDeviceList } from '@/api/sys/device'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'programEdit',
  data() {
    return {
      load: false,
      activeName: 'first',
      editList: {
        eqpCode: undefined,
        recipeCode: undefined,
        versionType: undefined,
        eqpModelName: undefined,
        status: undefined,
        approveStep: undefined,
        approveResult: undefined,
        versionNo: undefined
      },
      dictList: {
        versionTypeList: [],
        statusList: [],
        approveStepList: [],
        approveResultList: []
      },
      eqpModelNameList: [],
      ruleForm: {
        tableData: []
      },
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
      rules: {}
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
      deteils(this.tab, this.id).then(res => {
        this.editList = res.data
        this.ruleForm.tableData = res.data.rmsRecipeBodyDtlList
      })
    },
    getDictValue() {
      const typeList = ['RECIPE_VERSION_TYPE', 'RECIPE_STATUS', 'RECIPE_APPROVE_STEP', 'RECIPE_APPROVE_RESULT']
      const list = ['versionTypeList', 'statusList', 'approveStepList', 'approveResultList']
      for (let i = 0; i < typeList.length; i++) {
        this.getDictList(typeList[i], list[i])
      }
      // 获取设备类型
      this.getDevice()
    },
    getDevice() {
      const obj = {
        'sort': 'updateDate',
        'page.pn': 1,
        'page.size': 999999,
        'queryFields': 'id,manufacturerName,classCode,smlPath,hostJavaClass,activeFlag,iconPath,updateDate,'
      }
      fetchDeviceList(obj).then(response => {
        this.eqpModelNameList = response.data.results
      })
    },
    // 获取字典list
    getDictList(type, name) {
      fetchDict(type).then(response => {
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
      console.log(tab, event)
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
    save() {
      let eqpModelName = ''
      this.eqpModelNameList.forEach(item => {
        if (item.id == this.editList.eqpModelId) {
          eqpModelName = item.classCode
        }
      })
      const params = {
        id: this.id,
        recipeCode: this.editList.recipeCode,
        versionType: this.editList.versionType,
        versionNo: this.editList.versionNo,
        eqpCode: this.editList.eqpCode,
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
        this.$router.push({ name: 'program' })
      })
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
}
</style>
