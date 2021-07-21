<template>
  <div class="Rtplotyieldday">
    <el-form ref="form" :model="form" :inline="true" class="form" label-width="90px" size="small">
      <el-row>
        <el-form-item prop="station_code">
          <el-select v-model="form.eqpId" filterable placeholder="请选择设备">
            <el-option v-for="item in list" :key="item.eqpId" :label="item.eqpName" :value="item.eqpId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="station_code">
          <el-select v-model="type" filterable placeholder="请选择类型">
            <el-option v-for="item in list2" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="dateTime">
          <el-date-picker
            v-model="dateTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="finddetail">导出</el-button>
      </el-row>
    </el-form>
    <div id="main" style="width: 95%; height: 550px" />
    <!--    <div id="eqpChart" style="width: 95%;height: 600px;overflow: hidden;"/>-->
  </div>
  <!--  <div id="main" style="width:95%;height:600px;"/>-->
  <!--  <el-button type="primary" @click=" search">查询</el-button>-->
</template>
<script>
import * as echarts from 'echarts'
import { findDustCount, findDustEqps } from '@/api/ms/monitor'
import api from './fetch'
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
      text: '',
      list: [],
      areaStyle: undefined,
      api: api('/edc/edcparticle/export23'),
      areaStyle0: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgb(255, 158, 68)' },
          { offset: 1, color: 'rgb(255, 70, 131)' }
        ])
      },
      areaStyle1: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(80,141,255,0.39)' },
          { offset: 0.34, color: 'rgba(56,155,255,0.25)' },
          { offset: 1, color: 'rgba(38,197,254,0.00)' }
        ])
      },
      maxValue: undefined,
      minValue: undefined,
      toolbarStatus: { exportsLoading: false },
      list2: [
        { value: 'μm', label: 'μm', disabled: true },
        { value: 'temp', label: '温度' },
        { value: 'wet', label: '湿度', disabled: true },
        { value: 'flow', label: '流量', disabled: true }
      ],
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
        piont3μm: Array
      },
      myChart: undefined,
      tempMax: 26
    }
  },
  created() {
    var now = new Date()
    var endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10)
    var startDate = endDate.slice(0, 8) + '01'
    this.form.beginTime = startDate
    this.form.endTime = endDate
    this.dateTime = [startDate, endDate]
    findDustEqps().then((res) => {
      this.list = res.data.eqps
    })
  },
  methods: {
    finddetail() {
      // var param = this.$refs.ref.fdis()
      // this.query.id = param
      // eslint-disable-next-line no-undef
      if (this.toolbarStatus.exportsLoading) {
        return
      }
      this.toolbarStatus.exportsLoading = true
      const q = this.form
      this.api
        .export(q)
        .then((response) => {
          if (response.code === 0) {
            return import('./Export2Excel').then((excel) => {
              excel.export_byte_to_excel(response.bytes, response.title)
              this.toolbarStatus.exportsLoading = false
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: (response && response.errmsg) || '导出失败!',
              duration: 2000
            })
            this.toolbarStatus.exportsLoading = false
          }
        })
        .catch((e) => {
          this.toolbarStatus.exportsLoading = false
        })
    },
    search() {
      var a = this.type
      this.form.beginTime = this.dateTime[0] + ' 00:00:00'
      this.form.endTime = this.dateTime[1] + ' 23:59:59'
      findDustCount(this.form).then((res) => {
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
          if (a === 'temp') {
            this.maxValue = 26
            this.minValue = 20
            this.text = '尘埃粒子计数器(温度)'
            this.areaStyle = this.areaStyle0
            // 设置y轴最大值
            this.tempMax = 25
            for (var i = 0; i < this.total['temp'].length; i++) {
              if (this.total['temp'][i] > this.tempMax) {
                this.tempMax = this.total['temp'][i]
              }
            }
            this.tempMax = this.tempMax + 5 // 为与上边界留有空间
          } else if (a === 'wet') {
            this.maxValue = 60
            this.minValue = 40
            this.text = '尘埃粒子计数器(湿度)'
            this.areaStyle = this.areaStyle1
            // 设置y轴最大值
            this.tempMax = 60
            for (var j = 0; j < this.total['wet'].length; j++) {
              if (this.total['wet'][j] > this.tempMax) {
                this.tempMax = this.total['wet'][j]
              }
            }
            this.tempMax = this.tempMax + 2 // 为与上边界留有空间
          } else {
            this.tempMax = 4 // 为与上边界留有空间
            this.text = '尘埃粒子计数器(流量)'
            this.maxValue = 50
            this.minValue = 20
            this.areaStyle = this.areaStyle0
            for (var n = 0; n < this.total['flow'].length; n++) {
              if (this.total['flow'][n] > this.tempMax) {
                this.tempMax = this.total['flow'][n]
              }
            }
          }
          this.tem(a)
        } else {
          this.text = '尘埃粒子计数器(μm)'
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
      var myYAxis = {}
      myYAxis.type = 'value'
      // if (a === 'temp' || a === 'wet') {
      myYAxis.max = this.tempMax
      // }
      var option = {
        tooltip: {
          trigger: 'axis',
          position: function(pt) {
            return [pt[0], '10%']
          }
        },
        title: {
          left: 'center',
          text: this.text
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
        yAxis: myYAxis,
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 10
          }
        ],
        series: [
          {
            name: '数值',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: 'rgb(255, 70, 131)'
            },
            markLine: {
              symbol: ['none', 'arrow'],
              label: {
                position: 'end'
              },
              data: [
                {
                  name: '管理上限',
                  silent: true,
                  lineStyle: {
                    type: 'dotted',
                    color: '#FA3934',
                    width: 3
                  },
                  label: {
                    formatter: this.maxValue + '   管理上限'
                  },
                  yAxis: this.maxValue
                },
                {
                  name: '管理下限',
                  silent: true,
                  lineStyle: {
                    type: 'dotted',
                    color: '#1E90FF',
                    width: 3
                  },
                  label: {
                    formatter: this.minValue + '   管理下限'
                  },
                  yAxis: this.minValue
                }
              ]
            },
            areaStyle: this.areaStyle,
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
      var colors = [
        '#FD2446',
        '#248EFD',
        '#C916F2',
        '#B22222',
        '#FFA500',
        '#5F9EA0',
        '#00CED1',
        '#32CD32',
        '#FFD700',
        '#FFA500',
        '#6669B1'
      ]
      var option = {
        color: colors,
        title: {
          text: this.text
        },
        itemStyle: {
          normal: {
            lineStyle: {
              type: 'solid',
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'red '
                  },
                  {
                    offset: 1,
                    color: 'blue'
                  }
                ],
                global: false // 缺省为 false
              }
            },
            label: {
              show: true,
              position: 'middle'
            }
          }
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
            max: 10000,
            min: 0,
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
            max: 8000,
            min: 0,
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
            max: 8000,
            min: 0,
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
            max: 8000,
            min: 0,
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
            max: 8000,
            min: 0,
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
          }
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
          // {
          //   position: 'right',
          //   offset: 490,
          //   max: 8000,
          //   min: 0,
          //   type: 'value',
          //   name: '0.3μm',
          //   axisLine: {
          //     lineStyle: {
          //       color: colors[7]
          //     }
          //   },
          //   axisLabel: {
          //     formatter: '{value}'
          //   }
          // }
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
              title: '原始数据列表'
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
            markLine: {
              symbol: ['none', 'arrow'],
              label: {
                position: 'end',
                formatter: '管理上限'
              },
              data: [
                {
                  silent: true,
                  lineStyle: {
                    type: 'dotted',
                    color: '#FA3934',
                    width: 3
                  },
                  yAxis: 8000
                }
              ]
            },
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
          }
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
          // {
          //   name: '0.3μm',
          //   type: 'line',
          //   barMaxWidth: '20%',
          //   label: {
          //     normal: {
          //       show: true,
          //       position: 'top'
          //     }
          //   },
          //   yAxisIndex: '7',
          //   data: this.total['piont3μm']
          // }
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
  }
}
.arrow_box {
  animation: glow 800ms ease-out infinite alternate;
  width: 300px;
  height: 40px;
  margin-left: 100px;
  margin-top: 100px;
}
@keyframes glow {
  0% {
    border-color: #393;
    box-shadow: 0 0 5px rgba(0, 255, 0, 0.2), inset 0 0 5px rgba(0, 255, 0, 0.1), 0 0px 0 #393;
  }
  100% {
    border-color: #6f6;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.6), inset 0 0 10px rgba(0, 255, 0, 0.4), 0 0px 0 #6f6;
  }
}
</style>
