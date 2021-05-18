<template>
  <div class="tempchar">
    <el-form ref="form" :model="form" :inline="true" :rules="formRules" class="form" label-width="90px" size="small">
      <el-row>
        <el-form-item label="设备号" prop="eqpId">
          <w-select-eqp
            :span="8"
            :str="form.eqpId"
            :multiple="false"
            :disabled="false"
            @input="onValueChange($event)"
          />
        </el-form-item>
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
        <el-button type="primary" @click="search">查询</el-button>
      </el-row>
    </el-form>
    <template v-for="tempName in otherTempsTitles">
      <el-button
        v-if="tempName.indexOf('当前值') !== -1 || tempName.indexOf('现在值') !== -1"
        :key="tempName"
        type="primary"
        icon="el-icon-arrow-right"
        style="margin: 5px"
        @click="loadTempDataPart(tempName)"
      >
        {{ tempName.replace('当前值', '').replace('现在值', '') }}
      </el-button>
    </template>

    <div id="tempChart" style="width: 100%; height: 500px; overflow: hidden" />
  </div>
</template>
<script>
import { tempbytime } from '@/api/public'
import * as echarts from 'echarts'

export default {
  name: 'Tempchar',
  components: {},
  data() {
    return {
      form: {
        eqpId: undefined,
        dateTime: []
      },
      formRules: {
        eqpId: [{ required: true, message: '请选择设备！', trigger: 'change' }],
        dateTime: [{ required: true, message: '请选择时间！', trigger: 'change' }]
      },
      otherTempsTitles: [],
      otherTempsValue: [],
      list: [],
      source: [],
      chart: undefined,
      charLegend: ['运行温度', '设定温度', '低温报警', '高温报警']
    }
  },
  mounted() {
    var now = new Date()
    var endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10)
    var startDate = endDate.slice(0, 8) + '01'
    this.form.dateTime = [startDate, endDate]
  },
  created() {},
  methods: {
    onValueChange(name) {
      this.form.eqpId = name
    },
    search() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          tempbytime(this.form.eqpId, {
            beginTime: this.form.dateTime[0],
            endTime: this.form.dateTime[1]
          }).then((res) => {
            const data = res.data
            var title = data.title
            this.otherTempsTitles = title.split(',')
            this.otherTempsValue = data.results[0]
            const a = title.split(',')
            this.otherTempsTitles = a
            this.source = data.results
            this.initChart()
            console.log('this.otherTempsTitles', this.otherTempsTitles)
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
      this.chart = echarts.init(document.getElementById('tempChart'))
      const Cureoption = {
        title: {
          text: '数据曲线',
          padding: [20, 20]
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: this.charLegend
          // data: ['运行温度', '低温报警', '高温报警']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            show: true,
            type: 'slider',
            y: '90%',
            start: 0,
            end: 100
          }
        ],
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: { onZero: false },
          data: []
        },
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '湿度现在值',
            itemStyle: {
              normal: {
                color: '#458B74',
                lineStyle: {
                  color: '#458B74',
                  width: 3
                }
              }
            },
            smooth: true,
            type: 'line',
            data: ['temp_pv'],
            animationDuration: 3000,
            animationEasing: 'quadraticOut'
          },
          {
            name: '湿度SET',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#DAA520',
                lineStyle: {
                  color: '#DAA520',
                  width: 2,
                  type: 'dotted'
                }
              }
            },
            data: ['temp_sp'],
            animationDuration: 2600,
            animationEasing: 'quadraticOut'
          },
          {
            name: '湿度MIN',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#FF4040',
                lineStyle: {
                  color: '#FF4040',
                  width: 2,
                  type: 'dashed'
                }
              }
            },
            data: ['temp_min'],
            animationDuration: 2000,
            animationEasing: 'quadraticOut'
          },
          {
            name: '湿度MAX',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#8B2323',
                lineStyle: {
                  color: '#8B2323',
                  width: 2,
                  type: 'dashed'
                },
                areaStyle: {
                  color: '#BBFFFF'
                }
              }
            },
            data: ['temp_max'],
            animationDuration: 2000,
            animationEasing: 'quadraticOut'
          }
        ]
      }
      this.chart.setOption(this.loadTempDataFirst(Cureoption), true)
    },
    loadTempDataFirst(option) {
      option.xAxis.data = this.produce(this.source, 'create_date')
      option.series[0].data = this.produce(this.source, 'temp_pv')
      option.series[1].data = this.produce(this.source, 'temp_sp')
      option.series[2].data = this.produce(this.source, 'temp_min')
      option.series[3].data = this.produce(this.source, 'temp_max')
      return option
    },
    produce(data, name) {
      var result = []
      for (var i = 0, len = data.length; i < len; i++) {
        result.push(data[i][name])
      }
      return result
    },
    loadTempDataPart(tempName) {
      console.log('测试进入')
      tempName = tempName.replace('当前值', '').replace('现在值', '')
      var option = this.chart.getOption()
      option.series = option.series.slice(0, 4)
      this.charLegend = this.charLegend.slice(0, 4)
      const length = this.otherTempsTitles.length
      for (let index = 0; index < length; index++) {
        const element = this.otherTempsTitles[index]
        if (element.indexOf(tempName) === -1) {
          continue
        }
        this.charLegend.push(element)
        const othterSeries = {
          name: element,
          smooth: true,
          type: 'line',
          data: [],
          animationDuration: 3000,
          animationEasing: 'quadraticOut',
          itemStyle: {
            normal: {
              lineStyle: {
                width: 2
              }
            }
          }
        }
        if (this.otherTempsTitles[index].indexOf('MAX') !== -1 || this.otherTempsTitles[index].indexOf('MIN') !== -1) {
          othterSeries.itemStyle.normal.lineStyle.type = 'dashed'
        } else if (this.otherTempsTitles[index].indexOf('SET') !== -1) {
          othterSeries.itemStyle.normal.lineStyle.type = 'dotted'
        }
        othterSeries.data = this.produceOther(this.source, index)
        option.series.push(othterSeries)
      }
      option.legend[0].data = this.charLegend
      this.chart.setOption(option)
      return option
    },
    produceOther(data, index) {
      var result = []
      for (var i = 0, len = data.length; i < len; i++) {
        var otherTempsValues = data[i].other_temps_value.split(',')
        result.push(otherTempsValues[index])
      }
      return result
    }
  }
}
</script>
<style lang="scss" scoped>
.tempchar {
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
