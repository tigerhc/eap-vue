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
        <el-col :span="9">
          <el-form-item label="日期" prop="dateTime">
            <el-date-picker v-model="form.dateTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"/>
          </el-form-item>
        </el-col>
        <el-button type="primary" @click="serch">查询</el-button>
      </el-row>
    </el-form>
    <div id="yieldDayChart" style="width: 100%;height: 500px;overflow: hidden;"/>
  </div>
</template>
<script>
import { rtplotyieldday } from '@/api/public'
import echarts from 'echarts'

export default {
  name: 'Rtplotyieldday',
  components: {},
  data() {
    return {
      form: {
        lineNo: undefined,
        dateTime: []
      },
      formRules: {
        lineNo: [{ required: true, message: '请选择线别！', trigger: 'change' }],
        dateTime: [{ required: true, message: '请选择时间！', trigger: 'change' }]
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
    var now = new Date()
    var endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10)
    var startDate = endDate.slice(0, 8) + '01'
    this.form.dateTime = [startDate, endDate]
  },
  created() {
  },
  methods: {
    serch() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          rtplotyieldday({
            beginTime: this.form.dateTime[0],
            endTime: this.form.dateTime[1],
            lineNo: this.form.lineNo
          }).then((res) => {
            const data = res.data
            this.source = data.yield
            this.initChart()
          })
        }
      })
    },
    getDate(datestr) {
      var temp = datestr.split('-')
      if (temp[1] === '01') {
        temp[0] = parseInt(temp[0], 10) - 1
        temp[1] = '12'
      } else {
        temp[1] = parseInt(temp[1], 10) - 1
      }
      // new Date()的月份入参实际都是当前值-1
      var date = new Date(temp[0], temp[1], temp[2])
      return date
    },
    initChart() {
      var chart = document.getElementById('yieldDayChart')
      var yieldDayChart = echarts.init(chart)
      const option = {
        // title: {
        //   text: 'SIM日产量分析'
        //
        //   // padding: [20, 20]
        // },
        color: ['#003366', '#FFA500', '#003366', '#FFA500', '#FF0000'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['MES产量', '设备产量', 'MES达标率', '设备达标率', '计划产量']
        },
        xAxis: [
          {
            type: 'category',
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '日产量',
            min: 0,
            // max: 60000,
            // interval: 6000,
            axisLabel: {
              formatter: '{value} K'
            }
          },
          {
            type: 'value',
            name: '完成率',
            min: 0,
            // max: 150,
            // interval: 5,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: 'MES产量',
            type: 'bar',
            barGap: 0,
            label: {
              formatter: '{c}  {name|{a}}'
            }
            // barWidth: 10
          },
          {
            name: '设备产量',
            type: 'bar',
            barGap: 0
            // barWidth: 10
          },
          {
            name: 'MES达标率',
            type: 'line',
            yAxisIndex: 1
          },
          {
            name: '设备达标率',
            type: 'line',
            yAxisIndex: 1
          },
          {
            name: '计划产量',
            type: 'line',
            yAxisIndex: 0,
            color: 'red'
          }
        ],
        dataset: {
          dimensions: ['period_date', 'lot_yield', 'lot_yield_eqp', 'rate', 'eqp_rate', 'plan_qty'],
          source: this.source
        }
      }
      yieldDayChart.setOption(option, true)
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
