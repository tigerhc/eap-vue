<template>
  <div>
  <div id="main" style="width:95%;height:600px;"/>
  <el-button type="primary" @click=" search">查询</el-button>
  </div>
</template>
<script>
import echarts from 'echarts'
import { findDustCount } from '@/api/ms/monitor'
export default {
  data() {
    return {
      value: [],
      form: {
        eqpId: 'test',
        beginTime: '2021-03-21',
        endTime: '2021-03-29'
      },
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
      piont3μm: Array
    }
  },
  methods: {
    search() {
      findDustCount(this.form).then(res => {
        // this.data = res.data[0]
        // this.series = res.data[1]
        // this.min = res.data[2].min
        this.temp = res.data.data['温度']
        this.date = res.data.data['date']
        this.piont5μm = res.data.data['0.5μm']
        this.windSpeed = res.data.data['风速']
        this.oneμm = res.data.data['1μm']
        this.flow = res.data.data['流量']
        this.threeμm = res.data.data['3μm']
        this.fiveμm = res.data.data['5μm']
        this.tenμm = res.data.data['10μm']
        this.pressure = res.data.data['压差']
        this.piont3μm = res.data.data['0.3μm']
        this.wet = res.data.data['湿度']
        // this.series = res.data[1]
        // this.min = res.data[2].min
        this.handleChange()
      })
    },
    handleChange() {
      var myChart = echarts.init(document.getElementById('main'))
      var colors = ['#FD2446', '#248EFD', '#C916F2', '#6669B1', '#00BFFF', '#5F9EA0', '#00CED1', '#32CD32', '#FFD700', '#FFA500', '#B22222']
      var option = {
        color: colors,
        title: {
          text: '尘埃例子计数器'
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
          data: this.date
        },
        grid: {
          top: '10%',
          left: '5%',
          right: '45%',
          bottom: '10%'
        },
        yAxis: [
          {
            position: 'left',
            type: 'value',
            name: '温度',
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
            type: 'value',
            name: '0.5μm',
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
            offset: 70,
            type: 'value',
            name: '风速',
            axisLine: {
              lineStyle: {
                color: colors[2]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            position: 'right',
            offset: 140,
            type: 'value',
            name: '1μm',
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
            offset: 210,
            type: 'value',
            name: '流量',
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
            offset: 280,
            type: 'value',
            name: '3μm',
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
            offset: 350,
            type: 'value',
            name: '5μm',
            axisLine: {
              lineStyle: {
                color: colors[6]
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
            name: '10μm',
            axisLine: {
              lineStyle: {
                color: colors[7]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            position: 'right',
            offset: 490,
            type: 'value',
            name: '压差',
            axisLine: {
              lineStyle: {
                color: colors[8]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            position: 'right',
            offset: 560,
            type: 'value',
            name: '湿度',
            axisLine: {
              lineStyle: {
                color: colors[9]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            position: 'right',
            offset: 630,
            type: 'value',
            name: '0.3μm',
            axisLine: {
              lineStyle: {
                color: colors[10]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        toolbox: {
          show: true,
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
          {
            name: '温度',
            type: 'line',
            barMaxWidth: '20%',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            yAxisIndex: '0',
            data: this.temp
          },
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
            yAxisIndex: '1',
            data: this.piont5μm
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
            yAxisIndex: '2',
            data: this.windSpeed
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
            yAxisIndex: '3',
            data: this.oneμm
          },
          {
            name: '流量',
            type: 'line',
            barMaxWidth: '20%',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            yAxisIndex: '4',
            data: this.flow
          },
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
            yAxisIndex: '5',
            data: this.threeμm
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
            yAxisIndex: '6',
            data: this.fiveμm
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
            yAxisIndex: '7',
            data: this.tenμm
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
            yAxisIndex: '8',
            data: this.pressure
          },
          {
            name: '湿度',
            type: 'line',
            barMaxWidth: '20%',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            yAxisIndex: '9',
            data: this.wet
          },
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
            yAxisIndex: '10',
            data: this.piont3μm
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
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
