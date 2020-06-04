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
    <div id="yieldDayChart" style="width: 100%;height: 300px;overflow: hidden;"/>
    <div id="eqpAlarm" style="width: 100%;height: 250px;overflow: hidden;"/>
  </div>
</template>
<script>
import { selectAlarmCountByLine, selectAlarmCountByEqp } from '@/api/public'
import echarts from 'echarts'

export default {
  name: 'AlarmReport',
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
      source2: [],
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
          selectAlarmCountByLine({
            beginTime: this.form.dateTime[0],
            endTime: this.form.dateTime[1],
            lineNo: this.form.lineNo
          }).then((res) => {
            const data = res.data
            this.source = data.record
            this.initChart()
          })
        }
      })
    },

    serch2(eqpId) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          selectAlarmCountByEqp({
            beginTime: this.form.dateTime[0],
            endTime: this.form.dateTime[1],
            eqpId: eqpId
          }).then((res) => {
            const data = res.data
            this.source2 = data.record
            this.initEqpAlarm(eqpId)
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
        color: ['#FF4500', '#B22222', '#003366', '#FFA500'],
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
          data: ['alarm', 'error']
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
            name: '数量',
            min: 0,
            // max: 60000,
            // interval: 6000,
            axisLabel: {
              formatter: '{value} '
            }
          }
        ],
        series: [
          {
            name: 'alarm',
            type: 'bar',
            barGap: 0,
            label: {
              formatter: '{c}  {name|{a}}'
            }
            // barWidth: 10
          },
          {
            name: 'error',
            type: 'bar',
            barGap: 0
            // barWidth: 10
          }
        ],
        dataset: {
          dimensions: ['eqp_id', 'alarm_count', 'error_count'],
          source: this.source
        }
      }
      yieldDayChart.setOption(option, true)
      var _this = this
      yieldDayChart.on('dblclick', function(params) {
        _this.serch2(params.data.eqp_id)
      })
    },

    initEqpAlarm(eqpId) {
      var chart2 = document.getElementById('eqpAlarm')
      var eqpAlarmChart = echarts.init(chart2)
      const option = {
        title: {
          text: eqpId + '报警统计',
          left: 'center'

          // padding: [20, 20]
        },
        color: ['#FF4500', '#B22222', '#003366', '#FFA500'],
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            console.log(params)
            return params[0].data.alarm_name + ': ' + params[0].data.alarm_count +
                '<br />' + params[1].data.alarm_name + ': ' + params[1].data.alarm_count
          },
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
        // legend: {
        //   data: ['alarm', 'error']
        // },
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
            name: '数量',
            min: 0,
            // max: 60000,
            // interval: 6000,
            axisLabel: {
              formatter: '{value} '
            }
          }
        ],
        series: [
          {
            name: 'alarm',
            type: 'bar',
            barGap: 0,
            label: {
              formatter: '{c}  {name|{a}}'
            }
            // barWidth: 10
          },
          {
            name: 'error',
            type: 'bar',
            barGap: 0
            // barWidth: 10
          }
        ],
        dataset: {
          dimensions: ['alarm_code', 'alarm_count', 'error_count'],
          source: this.source2
        }
      }
      eqpAlarmChart.setOption(option, true)
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
