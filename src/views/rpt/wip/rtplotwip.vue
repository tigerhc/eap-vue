<template>
  <div class="Rtplotyieldday">
    <el-form ref="form" :model="form" :inline="true" :rules="formRules" class="form" label-width="90px" size="small">
      <el-row>
        <el-col :span="8">
          <el-form-item label="线别" prop="lineNo">
            <el-select v-model="form.lineNo">
              <el-option
                v-for="item in lineNoOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-button type="primary" @click="serch">查询</el-button>
      </el-row>
    </el-form>
    <el-table :data="tableData" :cell-class-name="color" style="width: 100%">
      <el-table-column
        v-for="col in cols"
        :key="col.prop"
        :fixed="col.fixed"
        :prop="col.prop"
        :label="col.label"
        :class-name="col.color"
        :width="col.width"
      >
        <el-table-column
          v-for="(son, k) in col.child"
          :key="k"
          :prop="son.prop"
          :label="son.label"
          :class-name="son.color"
          :width="son.width"
        />
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
        { prop: 'production_name', label: '品名' },
        { prop: 'lot_no', label: 'NO' }
      ],
      cols: [
        { fixed: true, prop: 'production_name', label: '品名', width: '250' },
        { fixed: true, prop: 'lot_no', label: 'NO', width: '100' }
      ], // 列集合
      lineNo: '',
      form: {
        lineNo: 'SIM'
      },
      formRules: {
        lineNo: [{ required: true, message: '请选择线别！', trigger: 'change' }]
      },
      source: [],
      // 先写死
      lineNoOptions: [
        {
          value: 'SIM',
          label: 'SIM'
        },
        {
          value: 'SMA',
          label: 'SMA'
        },
        {
          value: 'SX',
          label: 'SX'
        }
      ]
    }
  },
  watch: {
    cols() {
      this.serch()
    }
  },
  mounted() {
    // this.serch()
  },
  created() {
    if (window.location.hostname === '10.160.144.9') {
      this.form = {
        lineNo: 'APJ'
      }
      this.lineNoOptions = [
        {
          value: 'APJ',
          label: 'APJ'
        }
      ]
    }
    this.initStation()
  },
  methods: {
    initStation() {
      request({
        url: '/sys/organization/findYieldStep',
        method: 'get'
      }).then((response) => {
        const stations = response.data
        const c = { prop: '', label: '工程一览' }
        const child = []
        for (let i = 0; i < stations.length; i++) {
          child.push({ prop: stations[i].name, label: stations[i].name, color: '' })
        }
        c.child = child
        this.cols.push(c)
      })
    },
    serch() {
      this.tableData = []
      request({
        url: '/mes/meslotwip/findLotYield?lineNo=' + this.form.lineNo,
        method: 'get'
      }).then((response) => {
        const data = response.data.yield
        let start = 0
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < this.cols[2].child.length; j++) {
            if (this.cols[2].child[j].prop === data[i].step_code) {
              this.$set(data[i], this.cols[2].child[j].prop, data[i].lot_yield)
            }
          }
          if (i > 0) {
            if (data[i].production_name !== data[i - 1].production_name) {
              const subtotal = { production_name: '小计' }
              const lot = new Array(this.cols[2].child.length).fill(0)
              for (let k = start; k < i; k++) {
                if (k > start) {
                  data[k].production_name = ''
                }
                for (let j = 0; j < this.cols[2].child.length; j++) {
                  if (this.cols[2].child[j].prop === data[k].step_code) {
                    lot[j] = lot[j] + data[k].lot_yield
                  }
                }
              }
              for (let i = 0; i < lot.length; i++) {
                if (lot[i] !== 0) {
                  this.$set(subtotal, this.cols[2].child[i].prop, lot[i])
                  lot[i] = 0
                }
              }
              this.tableData.push(subtotal)
              start = i
            }
          }
          this.tableData.push(data[i])
          if (i === data.length - 1) {
            const subtotal = { production_name: '小计' }
            const lot = new Array(this.cols[2].child.length).fill(0)
            for (let k = start; k <= i; k++) {
              if (k > start) {
                data[k].production_name = ''
              }
              for (let j = 0; j < this.cols[2].child.length; j++) {
                if (this.cols[2].child[j].prop === data[k].step_code) {
                  lot[j] = lot[j] + data[k].lot_yield
                }
              }
            }
            for (let i = 0; i < lot.length; i++) {
              if (lot[i] !== 0) {
                this.$set(subtotal, this.cols[2].child[i].prop, lot[i])
                lot[i] = 0
              }
            }
            this.tableData.push(subtotal)
          }
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
    },
    color({ row, column, rowIndex, columnIndex }) {
      let index = 0
      let flag = false
      for (let j = 0; j < this.cols[2].child.length; j++) {
        if (this.cols[2].child[j].prop === row.step_code) {
          index = j
          flag = true
        }
        if (flag) {
          if (columnIndex > index + 2) {
            return 'jk-white'
          } else if (columnIndex > 1) {
            return 'jk-cyan'
          }
        }
      }
      if (row.production_name === '小计' && columnIndex > 0) {
        return 'jk-violet'
      }
      if (row.production_name === '小计' && columnIndex === 0) {
        return 'jk-violet-1'
      }
      if (columnIndex > 1) {
        return 'jk-white'
      }
    }
  }
}
</script>
<style lang="scss">
.Rtplotyieldday {
  width: 100%;
  height: 100%;
  margin: 0 auto;

  .el-table td {
    border-bottom: 1px solid black;
    border-right: 1px solid black;
    text-align: center;
    color: black;
  }
  .el-table thead.is-group th {
    background-color: #9999ff;
    text-align: center;
    color: black;
    border-bottom: 1px solid black;
    border-right: 1px solid black;
  }
  .el-table__row td.jk-cyan {
    background-color: #87c0f5;
    border-right: 1px solid #87c0f5;
    text-align: right;
  }
  .el-table__row td.jk-violet {
    background-color: #9400d3;
    border-right: 1px solid #9400d3;
    text-align: right;
  }
  .el-table__row td.jk-violet-1 {
    background-color: #9400d3;
    border-right: 1px solid #9400d3;
  }
  .el-table__row td.jk-white {
    background-color: #f5f7fa;
    border-right: 1px solid #f5f7fa;
  }
  .form {
    margin-top: 20px;
  }
}
</style>
