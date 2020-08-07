<template>
  <div class="app-container calendar-list-container" >
    <w-form v-bind="formConf" :col="3" :model="model" :bottom-btn="true">
      <el-input v-model="model.roleName" disabled label="审批身份" />
      <w-select-dic v-model="model.approveStep" disabled style="width:100%" label="审批等级" dict="RECIPE_APPROVE_STEP" />
      <el-input v-model="model.recipeCode" disabled label="配方Code" />
      <w-select-dic v-model="model.submitResult" style="width:100%" label="审批结果" dict="RECIPE_APPROVE_RESULT" />
      <el-input v-model="model.submitDesc" label="审批建议" /><br>
    </w-form>
    <div class="add-footer">
      <el-button @click="cancel">返回</el-button>
      <el-button v-if="showFlag" type="primary" @click="permit">提交</el-button>
    </div>
    <div style="border-top:1px solid #ddd;padding:5px 0;margin:10px 0" />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="历史审批" name="first">
        <w-edt-table v-slot="{row}" ref="language" v-bind="history" :datas="history.datas" url="">
          <w-table-col name="recipeCode" label="配方Code" align="center" />
          <w-table-col name="submitterRole" label="审批人" align="center" />
          <w-table-col name="submitResult" label="审批结果" dict="RECIPE_APPROVE_RESULT" align="center" />
          <w-table-col name="submitDesc" label="审批建议" align="center" />
          <w-table-col name="submitDate" label="审批时间" align="center" />
          <w-table-toolbar name="add" hidden/>
          <w-table-toolbar name="clean" hidden/>
          <w-table-toolbar name="batchDelete" hidden />
          <w-table-toolbar name="search" hidden />
          <w-table-toolbar name="exports" hidden />
        </w-edt-table>
      </el-tab-pane>
<!--      <el-tab-pane label="参数信息" name="second">-->
<!--        <w-edt-table v-slot="{row}" ref="language" v-bind="table" :params="table.param" url="/rms/rmsrecipebody/">-->
<!--          <w-table-col name="paraCode" required label="参数代码" query condition="like"/>-->
<!--          <w-table-col name="paraName" label="参数名" query condition="like"/>-->
<!--          <w-table-col name="setValue" label="设定值" align="center"/>-->
<!--          <w-table-col name="minValue" label="最小值" align="center"/>-->
<!--          <w-table-col name="maxValue" label="最大值" align="center"/>-->
<!--          <w-table-toolbar name="add" hidden/>-->
<!--          <w-table-toolbar name="batchDelete" hidden />-->
<!--          <w-table-toolbar name="exports" hidden />-->
<!--        </w-edt-table>-->
<!--      </el-tab-pane>-->
      <el-tab-pane label="参数信息" name="second">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
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
          >
            <el-table-column type="index" label="序号" width="50px" align="center"/>
            <el-table-column prop="paraCode" label="参数CODE" align="center"/>
            <el-table-column prop="paraName" label="参数名称" align="center"/>
            <el-table-column label="设定值" align="center">
              <el-table-column prop="setValue" label="New Value" align="center"/>
              <el-table-column prop="setValueOld" label="Old Value" align="center"/>
            </el-table-column>
            <el-table-column label="最小值" align="center">
              <el-table-column prop="minValue" label="New Value" align="center"/>
              <el-table-column prop="minValueOld" label="Old Value" align="center"/>
            </el-table-column>
            <el-table-column label="最大值" align="center">
              <el-table-column prop="maxValue" label="New Value" align="center"/>
              <el-table-column prop="maxValueOld" label="Old Value" align="center"/>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="附件" name="third">
        <attachment-select :uploadurl="uploadurl" :divshow="false" :biz="biz" @onSuccess="handleSuccessFile" />
      </el-tab-pane>
      <el-tab-pane label="图片" name="fourth">
        <picutre-select :uploadurl="uploadimageurl" :divshow="false" :hide="true" :biz="biz"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import request from '@/utils/request'
import AttachmentSelect from '../../../components/AttachmentSelect/index'
import PicutreSelect from '../../../components/PicutreSelect/index'
export default {
  name: 'RmsRecipePermitView',
  components: { PicutreSelect, AttachmentSelect },
  data() {
    return {
      showFlag: true,
      load: false,
      // 动态设置table高度
      tableHeight: document.body.scrollHeight - 210,
      selectIndex: '', // 选中的index
      selectRow: {}, // 选中一条数据
      biz: this.$route.query.id,
      uploadurl: process.env.BASE_API + '/attach/upload?access_token=' + this.$store.getters.token + '&biz=' + this.$route.id,
      uploadimageurl: process.env.BASE_API + '/attach/uploadimg?access_token=' + this.$store.getters.token + '&biz=' + this.$route.id,
      type: 'Edit',
      activeName: 'first',
      recipeId: '',
      model: {
        approveStep: '',
        roleName: '',
        recipeCode: '',
        submitResult: '',
        submitDesc: '',
        id: ''
      },
      history: {
        opHide: true,
        recipeId: '',
        datas: []
      },
      // table: {
      //   opHide: true,
      //   param: {
      //     recipeId: ''
      //   }
      // },
      formConf: {
        url: '/rms/rmsrecipe/',
        title: {
          EDIT: '审批'
        },
        rules: {
          submitResult: [{ required: true, message: '审批结果必选', trigger: 'blur' }]
        },
        onLoadData: (m, type) => {
          console.log(m)
          this.history.recipeId = m.id
          this.recipeId = m.id
          // this.table.param = { recipeId: m.id }
          this.model.approveStep = m.approveStep
          this.showFlag = true
          this.getDeteils()
          this.getRoleName()
          this.getHistory()
        }
      },
      ruleForm: {
        tableData: []
      }
    }
  },
  created() {
    this.type = this.$route.query.type
  },
  methods: {
    handleSuccessFile(file) {
      this.$notify({
        title: '上传成功',
        type: 'success',
        duration: 2000
      })
    },
    getRoleName() {
      if (this.model.approveStep !== '') {
        request({ url: '/rms/rmsrecipepermitconfig/getPermitConfig',
          'method': 'post',
          'data': { approveStep: this.model.approveStep }
        }).then((res) => {
          if (res.data.code === 0) {
            this.model.roleName = res.data.results.submitterRoleName
          }
        })
      }
    },
    getHistory() {
      request({ url: '/rms/rmsrecipepermit/getHistory',
        'method': 'post',
        'data': { recipeId: this.history.recipeId }
      }).then((res) => {
        if (res.data.code === 0) {
          this.history.datas = res.data.results
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
    // 获取index
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
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
    },
    // 获取详情
    getDeteils() {
      console.log(this.recipeId)
      request({
        url: 'rms/rmsrecipe/' + this.recipeId + '/findCompareRecipe',
        method: 'get'
      }).then((res) => {
        this.ruleForm.tableData = res.data.results.rmsRecipeBodyDtlList
        this.oldId = res.data.results.oldId
      })
    },
    permit() {
      if (this.model.submitResult === '') {
        this.$notify({
          showClose: true,
          message: '审批结果必须填写',
          type: 'error',
          duration: 2000
        })
      } else if (this.model.submitResult === '0' && this.model.submitDesc === '') {
        this.$notify({
          showClose: true,
          message: '审批不通过请在审批建议里说明原因',
          type: 'error',
          duration: 2000
        })
      } else {
        request({ url: '/rms/rmsrecipepermit/recipePermit',
          'method': 'post',
          'data': this.model
        }).then((res) => {
          if (res.data.code === 0) {
            this.model.submitResult = ''
            this.model.submitDesc = ''
            this.getHistory()
            this.showFlag = false
            this.$notify({
              title: '成功',
              message: '提交成功',
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
      }
    },
    cancel() {
      const { matched } = this.$route
      const cp = [...matched]
      const preRoute = cp[Math.max(cp.length - 2)]
      console.info('取消返回上级页面', preRoute)
      this.$store.dispatch('delView', this.$route).then(({ visitedViews }) => {
        this.$router.push({ path: preRoute && preRoute.path })
      })
    }
  }
}
</script>
<style lang="scss">
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
</style>
