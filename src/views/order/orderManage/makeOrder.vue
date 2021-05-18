<template>
  <div class="app-container calendar-list-container">
    <el-form ref="orderForm" :model="orderForm" :rules="rules">
      <el-form-item label="工单号" prop="id">
        <el-input v-model="orderForm.id" placeholder="请输入ID" />
      </el-form-item>
      <el-form-item label="（计划/报警）编号" prop="plan_id">
        <el-input v-model="orderForm.plan_id" placeholder="请输入（计划/报警）编号" />
      </el-form-item>
      <el-form-item label="设备编号" prop="eqp_id">
        <el-input v-model="orderForm.eqp_id" placeholder="请输入设备编号" />
      </el-form-item>
      <el-form-item label="指派人" prop="assigned_user">
        <el-input v-model="orderForm.assigned_user" placeholder="请输入指派人" />
      </el-form-item>
      <el-form-item label="指派时间" prop="assigned_time">
        <el-input v-model="orderForm.assigned_time" type="datetime-local" placeholder="请输入指派时间" />
      </el-form-item>
      <el-form-item label="被指派人" prop="designee">
        <el-input v-model="orderForm.designee" placeholder="请输入被指派人" />
      </el-form-item>
      <el-form-item label="处理方式" prop="deal_type">
        <el-input v-model="orderForm.deal_type" placeholder="请输入处理方式" />
      </el-form-item>
      <el-form-item label="处理时间" prop="deal_time">
        <el-input v-model="orderForm.deal_time" type="datetime-local" placeholder="请输入处理时间" />
      </el-form-item>
      <el-form-item label="工单状态" prop="plan_status">
        <el-input v-model="orderForm.plan_status" type="datetime" placeholder="请输入工单状态" />
      </el-form-item>
      <el-form-item label="工单类型" prop="plan_type">
        <el-input v-model="orderForm.plan_type" type="datetime" placeholder="请输入工单类型" />
      </el-form-item>
      <el-form-item label="处理意见">
        <el-input v-model="orderForm.deal_advice" type="textarea" />
      </el-form-item>
      <el-form-item label="处理意见描述（回复）">
        <el-input v-model="orderForm.deal_des" type="textarea" />
      </el-form-item>
      <el-form-item label="归档时间" prop="end_date">
        <el-input v-model="orderForm.end_date" type="datetime-local" />
      </el-form-item>
      <el-form-item class="btns">
        <el-button type="primary" @click="submitForm('orderForm')">立即制定</el-button>
        <el-button @click="resetForm('orderForm')">重置</el-button>
      </el-form-item>
    </el-form>
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
