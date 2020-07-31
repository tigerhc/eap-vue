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
    <el-table :data="tableData" style="width: 100%" >
      <el-table-column v-for="col in cols" :key="col.prop" :fixed="col.fixed" :prop="col.prop" :label="col.label" :class-name="col.color" :width="col.width">
        <el-table-column v-for="(son, k) in col.child" :key="k" :prop="son.prop" :label="son.label" :class-name="son.color" :width="son.width"/>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import request from '@/utils/request'

export default {
  name: 'Rtplotwip',
  components: {},
  data() {
    return {
      tableData: [],
      colsDef: [
        { 'prop': 'production_name', 'label': '品名' },
        { 'prop': 'lot_no', 'label': 'NO' }
      ],
      cols: [
        { 'fixed': true, 'prop': 'production_name', 'label': '品名', 'width': '250' },
        { 'fixed': true, 'prop': 'lot_no', 'label': 'NO', 'width': '100' }
      ], // 列集合
      lineNo: '',
      form: {
        lineNo: undefined
      },
      formRules: {
        lineNo: [{ required: true, message: '请选择线别！', trigger: 'change' }]
      },
      source: [],
      // 先写死
      lineNoOptions: [{
        value: 'SIM',
        label: 'SIM'
      }, {
        value: 'SMA',
        label: 'SMA'
      }, {
        value: 'SX',
        label: 'SX'
      }]
    }
  },
  mounted() {

  },
  created() {
    this.initStation()
  },
  methods: {
    initStation() {
      request({
        url: '/sys/organization/findStep',
        method: 'get'
      }).then((response) => {
        const stations = response.data
        const c = { 'prop': '', 'label': '工程一览' }
        const child = []
        for (let i = 0; i < stations.length; i++) {
          child.push({ prop: stations[i].name, label: stations[i].name, color: '' })
        }
        c.child = child
        this.cols.push(c)
      })
    },
    serch() {
      request({
        url: '/edc/rptlotyield/findLotYield?lineNo=' + this.form.lineNo,
        method: 'get'
      }).then((response) => {
        console.log(response)
        const data = response.data.yield
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < this.cols[2].child.length; j++) {
            console.log(this.cols[2])
            this.cols[2].child[j].color = 'jk-blue'
            // if (j > 2) {
            //   this.cols[2].child[j].color = 'jk-white'
            // }
            if (this.cols[2].child[j].prop === data[i].step_id) {
              this.$set(data[i], this.cols[2].child[j].prop, data[i].lot_yield)
              break
            }
          }
          this.tableData.push(data[i])
        }
      })
      // this.$refs['form'].validate((valid) => {
      //   if (valid) {
      //     rtplotyieldday({
      //       lineNo: this.form.lineNo
      //     }).then((res) => {
      //       const data = res.data
      //       this.source = data.yield
      //       console.log(res)
      //     })
      //   }
      // })
    }
  }
}
</script>
<style lang="scss">
  .Rtplotyieldday {
    width: 100%;
    height: 100%;
    margin: 0 auto;

    .el-table thead.is-group th{
      background-color: #1e6abc;
      text-align: center;
    }
    .el-table__row td.jk-blue{
      border-right: 1px solid #6cadc8 !important;
    }
    .el-table__row td.jk-white{
      background-color: #f5f7fa;
      border-right: 1px solid #f5f7fa;
    }
    .form {
      margin-top: 20px;
    }

  }

</style>
