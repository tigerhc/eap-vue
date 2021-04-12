<template>
  <div class="Rtplotyieldday">
    <el-form ref="form" :model="form" :inline="true" class="form" label-width="90px" size="small">
      <el-row>
        <el-col :span="5">
          <el-form-item label="设备" prop="station_code">
            <el-select v-model="form.eqpId" filterable placeholder="请选择" >
              <el-option
                v-for="item in list"
                :key="item.eqpId"
                :label="item.eqpName"
                :value="item.eqpId"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="类型" prop="station_code">
            <el-select v-model="type" filterable placeholder="请选择" >
              <el-option
                v-for="item in list2"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="日期" prop="dateTime">
            <el-date-picker v-model="dateTime" type="daterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" @click="search">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div id="main" style="width:95%;height:550px;"/>
<!--    <div id="eqpChart" style="width: 95%;height: 600px;overflow: hidden;"/>-->
  </div>
<!--  <div id="main" style="width:95%;height:600px;"/>-->
<!--  <el-button type="primary" @click=" search">查询</el-button>-->
</template>
<script>
import echarts from 'echarts'
import { findDustCount, findDustEqps } from '@/api/ms/monitor'
export default {
  data() {
    return {
      value: [],
      form: {
        eqpId: '',
        beginTime: '2021-03-21',
        endTime: '2021-03-29'
      },
      dateTime: [],
      type: '',
      list: [],
      list2: [{
        value: 'μm',
        label: 'μm',
        disabled: true
      }, {
        value: 'temp',
        label: '温度'
      }, {
        value: 'wet',
        label: '湿度',
        disabled: true
      }, {
        value: 'flow',
        label: '流量',
        disabled: true
      }],
      total: {
        date: Array,
        temp: Array,
        piont5μm: Array,
        windSpeed: Array,
        oneμm: Array,
        flow: Array,
        threeμm: Array,
        fourμm: Array,
        fiveμm: Array,
        tenμm: Array,
        pressure: Array,
        wet: Array,
        piont3μm: Array },
      myChart: undefined
    }
  },
  created() {
    findDustEqps().then(res => {
      this.list = res.data.eqps
    })
  },
  methods: {
    search() {
      var a = this.type
      this.form.beginTime = this.dateTime[0] + ' 00:00:00'
      this.form.endTime = this.dateTime[1] + ' 23:59:59'
      findDustCount(this.form).then(res => {
        // this.data = res.data[0]
        // this.series = res.data[1]
        // this.min = res.data[2].min
        this.total['temp'] = res.data.data['温度']
        this.total['date'] = res.data.data['date']
        this.total['piont5μm'] = res.data.data['0.5μm']
        this.total['windSpeed'] = res.data.data['风速']
        this.total['oneμm'] = res.data.data['1μm']
        this.total['flow'] = res.data.data['流量']
        this.total['threeμm'] = res.data.data['3μm']
        this.total['fiveμm'] = res.data.data['5μm']
        this.total['tenμm'] = res.data.data['10μm']
        this.total['pressure'] = res.data.data['压差']
        this.total['piont3μm'] = res.data.data['0.3μm']
        this.total['wet'] = res.data.data['湿度']
        // this.series = res.data[1]
        // this.min = res.data[2].min
        if (a === 'temp' || a === 'wet' || a === 'flow') {
          this.tem(a)
        } else {
          this.handleChange()
        }
      })
    },
    tem(a) {
      var b = this.total[a]
      if (this.myChart != null) {
        this.myChart.dispose()
      }
      this.myChart = echarts.init(document.getElementById('main'))
      var option = {
        tooltip: {
          trigger: 'axis',
          position: function(pt) {
            return [pt[0], '10%']
          }
        },
        title: {
          left: 'center',
          text: '尘埃粒子计数器'
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.total['date']
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 100
        }, {
          start: 0,
          end: 10
        }],
        series: [
          {
            name: '模拟数据',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: 'rgb(255, 70, 131)'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(255, 158, 68)'
              }, {
                offset: 1,
                color: 'rgb(255, 70, 131)'
              }])
            },
            // eslint-disable-next-line no-undef
            data: b
          }
        ]
      }
      this.myChart.setOption(option)
    },
    handleChange() {
      if (this.myChart != null) {
        this.myChart.dispose()
      }
      this.myChart = echarts.init(document.getElementById('main'))
      var colors = ['#FD2446', '#248EFD', '#C916F2', '#B22222', '#FFA500', '#5F9EA0', '#00CED1', '#32CD32', '#FFD700', '#FFA500', '#6669B1']
      var option = {
        color: colors,
        title: {
          text: '尘埃粒子计数器'
        },
        legend: {
          data: ['温度', '0.5μm', '风速', '1μm', '流量', '3μm', '5μm', '10μm', '压差', '湿度', '0.3μm']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          data: this.total['date']
        },
        grid: {
          top: '10%',
          left: '5%',
          right: '45%',
          bottom: '10%'
        },
        yAxis: [
          // {
          //   position: 'left',
          //   type: 'value',
          //   name: '温度',
          //   axisLine: {
          //     lineStyle: {
          //       color: colors[0]
          //     }
          //   },
          //   axisLabel: {
          //     formatter: '{value}'
          //   }
          // },
          {
            position: 'left',
            type: 'value',
            name: '0.5μm',
            // max: 1200,
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            position: 'right',
            offset: 70,
            type: 'value',
            name: '风速',
            axisLine: {
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            position: 'right',
            offset: 140,
            // max: 400,
            type: 'value',
            name: '1μm',
            axisLine: {
              lineStyle: {
                color: colors[2]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          // {
          //   position: 'right',
          //   offset: 210,
          //   type: 'value',
          //   name: '流量',
          //   axisLine: {
          //     lineStyle: {
          //       color: colors[4]
          //     }
          //   },
          //   axisLabel: {
          //     formatter: '{value}'
          //   }
          // },
          {
            position: 'right',
            offset: 210,
            type: 'value',
            name: '3μm',
            axisLine: {
              lineStyle: {
                color: colors[3]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            position: 'right',
            offset: 280,
            type: 'value',
            name: '5μm',
            // max: 50,
            axisLine: {
              lineStyle: {
                color: colors[4]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            position: 'right',
            offset: 350,
            type: 'value',
            // max: 30,
            name: '10μm',
            axisLine: {
              lineStyle: {
                color: colors[5]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            position: 'right',
            offset: 420,
            type: 'value',
            name: '压差',
            axisLine: {
              lineStyle: {
                color: colors[6]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          // {
          //   position: 'right',
          //   offset: 560,
          //   type: 'value',
          //   name: '湿度',
          //   axisLine: {
          //     lineStyle: {
          //       color: colors[9]
          //     }
          //   },
          //   axisLabel: {
          //     formatter: '{value}'
          //   }
          // },
          {
            position: 'right',
            offset: 490,
            type: 'value',
            name: '0.3μm',
            axisLine: {
              lineStyle: {
                color: colors[7]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        toolbox: {
          show: true,
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            dataView: {
              show: true,
              title: '某地区的、单位数、职工人数、和平均工资'
            },
            restore: { show: true }
          },
          saveAsImage: { show: true },
          restore: { show: true }

        },
        series: [
          // {
          //   name: '温度',
          //   type: 'line',
          //   barMaxWidth: '20%',
          //   label: {
          //     normal: {
          //       show: true,
          //       position: 'top'
          //     }
          //   },
          //   yAxisIndex: '0',
          //   data: this.total['temp']
          // },
          {
            name: '0.5μm',
            type: 'line',
            barMaxWidth: '20%',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            yAxisIndex: '0',
            data: this.total['piont5μm']
          },
          {
            name: '风速',
            type: 'line',
            barMaxWidth: '20%',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            yAxisIndex: '1',
            data: this.total['windSpeed']
          },
          {
            name: '1μm',
            type: 'line',
            barMaxWidth: '20%',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            yAxisIndex: '2',
            data: this.total['oneμm']
          },
          // {
          //   name: '流量',
          //   type: 'line',
          //   barMaxWidth: '20%',
          //   label: {
          //     normal: {
          //       show: true,
          //       position: 'top'
          //     }
          //   },
          //   yAxisIndex: '4',
          //   data: this.total['flow']
          // },
          {
            name: '3μm',
            type: 'line',
            barMaxWidth: '20%',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            yAxisIndex: '3',
            data: this.total['threeμm']
          },
          {
            name: '5μm',
            type: 'line',
            barMaxWidth: '20%',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            yAxisIndex: '4',
            data: this.total['fiveμm']
          },
          {
            name: '10μm',
            type: 'line',
            barMaxWidth: '20%',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            yAxisIndex: '5',
            data: this.total['tenμm']
          },
          {
            name: '压差',
            type: 'line',
            barMaxWidth: '20%',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            yAxisIndex: '6',
            data: this.total['pressure']
          },
          // {
          //   name: '湿度',
          //   type: 'line',
          //   barMaxWidth: '20%',
          //   label: {
          //     normal: {
          //       show: true,
          //       position: 'top'
          //     }
          //   },
          //   yAxisIndex: '9',
          //   data: this.total['wet']
          // },
          {
            name: '0.3μm',
            type: 'line',
            barMaxWidth: '20%',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            yAxisIndex: '7',
            data: this.total['piont3μm']
          }
        ]
      }
      this.myChart.setOption(option)
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
  }}
  .arrow_box{
    animation: glow 800ms ease-out infinite alternate;
    width:300px;
    height:40px;
    margin-left: 100px;
    margin-top: 100px;
  }
  @keyframes glow {
    0% {
      border-color: #393;
      box-shadow: 0 0 5px rgba(0,255,0,.2), inset 0 0 5px rgba(0,255,0,.1), 0 0px 0 #393;
    }
    100% {
      border-color: #6f6;
      box-shadow: 0 0 20px rgba(0,255,0,.6), inset 0 0 10px rgba(0,255,0,.4), 0 0px 0 #6f6;
    }
  }
</style>
