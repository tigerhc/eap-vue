<template>
  <div class="Eqpoee">
    <el-form
      ref="form"
      :model="form"
      :inline="true"
      :rules="formRules"
      class="form"
      label-width="90px"
      size="small"
    >
      <el-row>
        <el-col :span="9">
          <el-form-item label="日期" prop="dateTime">
            <el-date-picker
              v-model="form.dateTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备号" prop="eqpId">
            <el-input
              :autosize="{ minRows: 3}"
              v-model="form.eqpId"
              style="width:300px"
              type="textarea"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-col>
        <el-button type="primary" @click="serch">查询</el-button>
      </el-row>
    </el-form>

    <alarm-cake
      v-if="showFlag"
      id="eqpoee"
      ref="AlarmCake"
      :begin-time="form.dateTime[0]"
      :end-time="form.dateTime[1]"
      :list="list"
    />

  </div>
</template>
<script>
import AlarmCake from '@/components/Charts/alarmCake'
import { rpteqpstateday } from '@/api/public'
export default {
  name: 'Eqpoee',
  components: {
    AlarmCake
  },
  data() {
    return {
      form: {
        dateTime: [],
        eqpId: ''
      },
      list: [],
      list2: [],
      showFlag: false,
      formRules: {
        dateTime: [{ required: true, message: '请选择时间！', trigger: 'change' }],
        eqpId: [{ required: true, message: '请输入eqpld！', trigger: 'change' }]
      }
    }
  },
  mounted() {
    // var now = new Date();

    // var startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10);
    // alert(startDate)
    // this.form.dateTime[0] = startDate

  },
  methods: {
    serch() {
      this.showFlag = false
      this.$refs['form'].validate((valid) => {
        if (valid) {
          rpteqpstateday({
            beginTime: this.form.dateTime[0],
            endTime: this.form.dateTime[1],
            eqpId: this.form.eqpId
          }).then((res) => {
            const data = res.data
            this.showFlag = true
            this.list = data.eqpOee
            this.list2 = data.eqpsOee
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.Eqpoee {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  .form {
    margin-top: 20px;
  }
}
</style>
<style >
</style>
