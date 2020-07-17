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
      <el-button type="primary" @click="permit">提交</el-button>
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
          <w-table-toolbar name="batchDelete" hidden />
          <w-table-toolbar name="search" hidden />
          <w-table-toolbar name="exports" hidden />
        </w-edt-table>
      </el-tab-pane>
      <el-tab-pane label="配方信息" name="second">
        <w-edt-table v-slot="{row}" ref="language" v-bind="table" :params="table.param" url="/rms/rmsrecipebody/">
          <w-table-col name="paraCode" required label="参数代码" query condition="like"/>
          <w-table-col name="paraName" label="参数名" query condition="like"/>
          <w-table-col name="setValue" label="设定值" align="center"/>
          <w-table-col name="minValue" label="最小值" align="center"/>
          <w-table-col name="maxValue" label="最大值" align="center"/>
          <w-table-toolbar name="add" hidden/>
          <w-table-toolbar name="batchDelete" hidden />
          <w-table-toolbar name="exports" hidden />
        </w-edt-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import request from '@/utils/request'
export default {
  name: 'RmsRecipePermitView',
  data() {
    return {
      type: 'Edit',
      activeName: 'first',
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
      table: {
        opHide: true,
        param: {
          recipeId: ''
        }
      },
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
          this.table.param = { recipeId: m.id }
          this.getRoleName()
          this.getHistory()
        }
      }
    }
  },
  created() {
    this.type = this.$route.query.type
  },
  methods: {
    getRoleName() {
      request({ url: '/rms/rmsrecipepermitconfig/getPermitConfig',
        'method': 'post',
        'data': { approveStep: this.model.approveStep }
      }).then((res) => {
        if (res.data.code === 0) {
          this.model.roleName = res.data.results.submitterRoleName
        }
      })
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
    permit() {
      if (this.model.submitResult === '') {
        this.$notify({
          showClose: true,
          message: '审批结果必须填写',
          type: 'error',
          duration: 2000
        })
      } else if (this.model.submitResult === '2' && this.model.submitDesc === '') {
        this.$notify({
          showClose: true,
          message: '审批不通过请在审批建议里说明原因',
          type: 'error',
          duration: 2000
        })
      } else {
        request({ url: '/rms/rmsrecipepermit/permit',
          'method': 'post',
          'data': this.model
        }).then((res) => {
          if (res.data.code === 0) {
            this.model.submitResult = ''
            this.model.submitDesc = ''
            this.getHistory()
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
