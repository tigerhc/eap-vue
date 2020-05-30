<template>
  <div class="Rtplotyieldday">
    <el-form ref="form" :model="form" :inline="true" :rules="formRules" class="form" label-width="90px" size="small">
      <el-row>
        <el-col :span="6">
          <el-form-item label="线别" prop="lineNo">
            <el-select v-model="form.lineNo">
              <el-option
v-for="item in lineNoOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"
                         :disabled="item.disabled" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-button type="primary" @click="serch">查询</el-button>
      </el-row>
    </el-form>

  </div>
</template>
<script>
import { rtplotyieldday } from '@/api/public'

export default {
  name: 'Rtplotwip',
  components: {},
  data() {
    return {
      form: {
        lineNo: undefined
      },
      formRules: {
        lineNo: [{ required: true, message: '请选择线别！', trigger: 'change' }]
      },
      list: [],
      source: [],
      // 先写死
      lineNoOptions: [{
        value: 'SIM',
        label: 'SIM'
      }, {
        value: 'SMA',
        label: 'SMA',
        disabled: true
      }, {
        value: 'SX',
        label: 'SX',
        disabled: true
      }, {
        value: '5GI',
        label: '5GI',
        disabled: true
      }, {
        value: '6GI',
        label: '6GI',
        disabled: true
      }]
    }
  },
  mounted() {
  },
  created() {
  },
  methods: {
    serch() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          rtplotyieldday({
            lineNo: this.form.lineNo
          }).then((res) => {
            const data = res.data
            this.source = data.yield
            this.initChart()
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .Rtplotyieldday {
    width: 100%;
    height: 100%;
    margin: 0 auto;

    .form {
      margin-top: 20px;
    }
  }
</style>
<style>
</style>
