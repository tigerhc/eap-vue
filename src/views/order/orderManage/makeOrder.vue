<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="rw/rwplan"/>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderForm: {},
      rules: {
        id: [{ required: true, message: '请输入ID', trigger: 'blur' }],
        plan_id: [{ required: true, message: '请输入（计划/报警）编号', trigger: 'blur' }],
        eqp_id: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        assigned_user: [{ required: true, message: '请输入指派人', trigger: 'blur' }],
        assigned_time: [{ required: true, message: '请输入指派时间', trigger: 'blur' }],
        designee: [{ required: true, message: '请输入被指派人', trigger: 'blur' }],
        deal_type: [{ required: true, message: '请输入处理方式', trigger: 'blur' }],
        plan_status: [{ required: true, message: '请输入工单状态', trigger: 'blur' }],
        deal_time: [{ required: true, message: '请输入处理时间', trigger: 'blur' }],
        plan_type: [{ required: true, message: '请输入工单类型', trigger: 'blur' }],
        end_date: [{ required: true, message: '请输入归档时间', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style  scoped>
.el-form {
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
}
.el-form-item {
  width: 45%;
}
.btns {
  position: absolute;
  left: 43%;
  bottom: -10%;
}
</style>
