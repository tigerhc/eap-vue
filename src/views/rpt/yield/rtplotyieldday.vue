<template>
  <div class="Rtplotyieldday">
    <el-form ref="form" :model="form" :inline="true" :rules="formRules" class="form" label-width="90px" size="small">
      <el-row>
        <el-form-item prop="lineNo">
          <el-select v-model="form.lineNo" placeholder="请选择线别" @change="ValueChange(1)">
            <el-option
              v-for="item in lineNoOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="station_code">
          <el-select v-model="form.station_code" filterable placeholder="请选择站别">
            <el-option
              v-for="item in noList"
              :key="item.station_code"
              :label="item.station_code"
              :value="item.station_code"
            />
          </el-select>
          <!--            <w-select :str="form.productionNo" :multiple="true" :disabled="false" @input="onNoChange($event)"/>-->
        </el-form-item>
        <el-form-item prop="dateTime">
          <el-date-picker
            v-model="form.dateTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-button type="primary" @click="serch">查询</el-button>
      </el-row>
    </el-form>
    <div id="yieldDayChart" style="width: 100%; height: 300px; overflow: hidden" />
    <div id="findAllEqp" style="width: 100%; height: 280px" />
    <div id="eqpChart" style="width: 100%; height: 250px; overflow: hidden" />
  </div>
</template>
<script>
import { rtplotyieldday, selectEqp, findAllEqp } from '@/api/public'
import * as echarts from 'echarts'
import request from '@/utils/request'

export default {
  name: 'Rtplotyieldday',
  components: {},
  data() {
    return {
      aa: { multiple: true },
      form: {
        lineNo: undefined,
        dateTime: [],
        station_code: '',
        value: []
      },
      formRules: {
        lineNo: [{ required: true, message: '请选择线别！', trigger: 'change' }],
        dateTime: [{ required: true, message: '请选择时间！', trigger: 'change' }]
      },
      list: [],
      source: [],
      source2: [],
      noList: [],
      noList1: [],
      formatArr: [],
      series: [],
      legend: [],
      // 先写死
      lineNoOptions: [
        {
          value: 'SIM',
          label: 'SIM'
        },
        {
          value: 'SMA',
          label: 'SMA',
          disabled: true
        },
        {
          value: 'SX',
          label: 'SX',
          disabled: true
        },
        {
          value: '5GI',
          label: '5GI',
          disabled: true
        },
        {
          value: '6GI',
          label: '6GI',
          disabled: true
        }
      ]
    }
  },
  mounted() {
    var now = new Date()
    var endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10)
    var startDate = endDate.slice(0, 8) + '01'
    this.form.dateTime = [startDate, endDate]
  },
  created() {
    if (window.location.hostname === '10.160.144.9') {
      this.lineNoOptions = [
        {
          value: 'DM',
          label: 'DM'
        }
      ]
    }
  },
  methods: {
    serch() {
      // eslint-disable-next-line eqeqeq
      if (this.form.station_code != '') {
        this.legend = []
        this.series = []
        this.formatArr = []
        this.$refs['form'].validate((valid) => {
          if (valid) {
            // eslint-disable-next-line no-undef
            findAllEqp({
              beginTime: this.form.dateTime[0],
              endTime: this.form.dateTime[1],
              lineNo: this.form.lineNo,
              stationCode: this.form.station_code
            }).then((res) => {
              const data = res.data
              this.source3 = data || []
              for (var i in data[0]) {
                this.formatArr.push(i)
              }
              for (var p in data[0]) {
                this.legend.push(p)
                this.series.push({
                  name: p,
                  type: 'bar',
                  barGap: 0
                })
              }
              this.series.splice(0, 1)
              this.AllEqpChart()
            })
          }
        })
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          rtplotyieldday({
            beginTime: this.form.dateTime[0],
            endTime: this.form.dateTime[1],
            lineNo: this.form.lineNo,
            stationCode: this.form.station_code
          }).then((res) => {
            const data = res.data
            this.source = data.yield
            this.initChart()
          })
        }
      })
    },
    ValueChange(index) {
      request({
        url: 'edc/rptlotyieldday/searchStand/' + this.form.lineNo,
        method: 'get'
      }).then((response) => {
        const rs = response.data
        this.noList = rs || []
        this.noList1 = rs || []
        // this.productionNo = rss.split(',')
      })
    },
    selectEqp(periodDate) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          selectEqp({
            year: this.form.dateTime[0],
            day: periodDate,
            stationCode: this.form.station_code,
            lineNo: this.form.lineNo
          }).then((res) => {
            const rs = res.data
            this.source2 = rs || []
            this.initEqp(periodDate)
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
        color: ['#FFA500', '#37A2DA', '#FFA500', '#37A2DA', '#FF0000'],
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
              formatter: '{value} k'
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
            color: 'red',
            lineStyle: {
              width: 3
            }
          }
        ],
        dataset: {
          dimensions: ['period_date', 'lot_yield', 'lot_yield_eqp', 'rate', 'eqp_rate', 'plan_qty'],
          source: this.source
        }
      }
      yieldDayChart.setOption(option, true)
      var _this = this
      yieldDayChart.on('dblclick', function(params) {
        _this.selectEqp(params.data.period_date)
      })
    },

    initEqp(periodDate) {
      var chart2 = document.getElementById('eqpChart')
      var yieldChart = echarts.init(chart2)
      const option = {
        title: {
          text: '日期 : ' + periodDate,
          // left: 'left',
          // padding: [20, 20]
          margin: [100, 100, 100, 100]
        },
        color: ['#FFA500', '#37A2DA', '#37A2DA', '#FFA500', '#FF0000'],
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
          data: ['MES产量', '设备产量']
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
              formatter: '{value} k '
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
          }
        ],
        dataset: {
          dimensions: ['eqp_id', 'lot_yield', 'lot_yield_eqp'],
          source: this.source2
        }
      }
      yieldChart.setOption(option, true)
    },
    AllEqpChart() {
      var chart3 = document.getElementById('findAllEqp')
      var yieldDayChart = echarts.init(chart3)
      const option = {
        // title: {
        //   text: 'SIM日产量分析'
        //
        //   // padding: [20, 20]
        // },
        color: [
          '#FFA500',
          '#D2691E',
          '#B0C4DE',
          '#778899',
          '#FF69B4',
          '#FF1493',
          '#00FFFF',
          '#00CED1',
          '#808000',
          '#BDB76B',
          '#FF7F50',
          '#FF4500',
          '#32CD32',
          '#00FF00',
          '#FFFF00',
          '#BDB76B',
          '#0000FF',
          '#1E90FF',
          '#EE82EE',
          '#FF00FF',
          '#87CEFA',
          '#00BFFF'
        ],
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
          },
          top: '20%'
        },
        grid: {
          top: '37%',
          bottom: '8%'
        },
        legend: {
          data: this.legend
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
              formatter: '{value} k'
            }
          }
        ],
        series: this.series,
        dataset: {
          dimensions: this.formatArr,
          source: this.source3
        }
      }
      yieldDayChart.setOption(option, true)
      var _this = this
      yieldDayChart.on('dblclick', function(params) {
        _this.selectEqp(params.data.period_date)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.Rtplotyieldday {
  width: auto;
  height: auto;
  margin: 0 auto;

  .form {
    margin-top: 20px;
  }
}
</style>
<style>
</style>
