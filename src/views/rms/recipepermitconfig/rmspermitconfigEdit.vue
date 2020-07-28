<template>
  <div class="step">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step :title="title.title1" @click.native="select(0)"/>
      <el-step :title="title.title2" @click.native="select(1)"/>
      <el-step :title="title.title3" @click.native="select(2)"/>
    </el-steps>
    <div style="border-top:1px solid #ddd;padding:5px 0;margin:10px 0" />
    <w-form-render :col="1" :model="model" >
      <w-select-dic v-model="model.roleName" style="width:90%" label="审批身份" dict="PERMIT_ROLE" col="24"/>
      <el-input v-model="model.roleCode" disabled style="width:90%" label="身份编号" col="24"/>
      <w-select-dic v-model="model.submitLevel" disabled style="width:90%" label="审批等级" dict="RECIPE_APPROVE_STEP" col="24"/>
      <el-input v-model="model.updateByName" disabled style="width:90%" label="更新人" col="24"/>
      <el-input v-model="model.updateDate" disabled style="width:90%" label="更新日期" col="24"/>
    </w-form-render>
    <div class="add-footer">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" @click="commit">提交</el-button>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import WFormRender from '../../../components/eap-form-render/index'
export default {
  name: 'PermitConfig',
  components: { WFormRender },
  data() {
    return {
      Edit: 'Edit',
      active: 0,
      model: {
        roleName: '',
        roleCode: '',
        submitLevel: '1',
        updateByName: '',
        updateDate: ''
      },
      title: {
        title1: 'Ⅰ 级审批',
        title2: 'Ⅱ 级审批',
        title3: 'Ⅲ 级审批'
      },
      OP: '操作员',
      QA: '质检员',
      ME: '工程师'
    }
  },
  created() {
    this.getTitle()
  },
  mounted() {
    this.getRoleName()
  },
  methods: {
    select(i) {
      this.active = i
      this.model.submitLevel = i + 1 + ''
      this.getRoleName()
    },
    getTitle() {
      request({ url: '/rms/rmsrecipepermitconfig/getPermitConfigList',
        'method': 'get'
      }).then((res) => {
        console.log(res.data)
        if (res.data.code === 0) {
          res.data.results.forEach(i => {
            if (i.submitterRoleName === 'OP') {
              this.setTitle(i.submitLevel, this.OP)
            } else if (i.submitterRoleName === 'QA') {
              this.setTitle(i.submitLevel, this.QA)
            } else if (i.submitterRoleName === 'ME') {
              this.setTitle(i.submitLevel, this.ME)
            }
          })
        }
      })
    },
    setTitle(i, msg) {
      if (i === 1) {
        this.title.title1 = 'Ⅰ 级审批 ' + msg
      } else if (i === 2) {
        this.title.title2 = 'Ⅱ 级审批 ' + msg
      } else if (i === 3) {
        this.title.title3 = 'Ⅲ 级审批 ' + msg
      }
    },
    getRoleName() {
      request({ url: '/rms/rmsrecipepermitconfig/getPermitConfig',
        'method': 'post',
        'data': { approveStep: this.model.submitLevel }
      }).then((res) => {
        if (res.data.code === 0) {
          this.model.roleName = res.data.results.submitterRoleName
          this.model.roleCode = res.data.results.submitterRoleCode
          this.model.updateByName = res.data.results.updateBy
          this.model.updateDate = res.data.results.updateDate
        }
      })
    },
    commit() {
      if (this.model.roleName === '') {
        this.$notify({
          showClose: true,
          message: '审批身份必须选择',
          type: 'error',
          duration: 2000
        })
      } else {
        request({ url: '/rms/rmsrecipepermitconfig/updatePermitConfig',
          'method': 'post',
          'data': this.model
        }).then((res) => {
          this.getRoleName()
          this.getTitle()
          if (res.data.code === 0) {
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
<style>
  .step{
    width: 60%;
    position: absolute;
    top: 10%;
    left: 20%;
  }
</style>
