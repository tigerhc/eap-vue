<template>
  <div id="tempchar" class="app">
    <el-form ref="form" :model="form" :inline="true" :rules="formRules" class="form" label-width="90px" size="small">
      <el-row>
        <el-form-item label="设备号:" prop="eqpId">
          <div class="condition">
            <el-select v-model="form.eqpId" clearable>
              <el-option v-for="item in tempEqpId" :key="item.eqpId" :label="item.eqpName" :value="item.eqpId" />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="日期:" prop="dateTime">
          <el-date-picker
            v-model="form.dateTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-row>
    </el-form>
    <el-tabs v-model="editableTabsValue" type="card" @tab-click="loadTempDataPart">
      <el-tab-pane v-for="item in editableTabs" :key="item" :label="item" :name="item" />
    </el-tabs>
    <div id="kChart" />
    <div id="lineChart" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import request from '@/utils/request'
import { tempbytime } from '@/api/public'
import { eqpList } from '@/api/oven/temperature'

export default {
  components: {},
  data() {
    return {
      editableTabsValue: '',
      editableTabs: [],
      tempEqpId: [],
      kTime: [],
      kData: [],
      extraTitle: ['运行温度', '设定温度', '低温报警', '高温报警'],
      tempsValue: [],
      form: {
        eqpId: undefined,
        dateTime: []
      },
      formRules: {
        eqpId: [{ required: true, message: '请选择设备！', trigger: 'change' }],
        dateTime: [{ required: true, message: '请选择时间！', trigger: 'change' }]
      }
    }
  },
  created() {
    eqpList().then((response) => {
      this.tempEqpId = response.data.eqpId
    })
  },
  methods: {
    loadTempDataPart(tab) {
      this.getKData(tab.index)
    },
    search() {
      this.$refs['form'].validate((val) => {
        if (val) {
          this.getKData(this.form.eqpId, this.form.dateTime[0], this.form.dateTime[1])
        }
      })
    },
    getKData(eqpId, startTime, endTime, index) {
      return request(`oven/ovnbatchlotday/findDetail/${eqpId}/${startTime}/${endTime}`)
        .then((res) => {
          console.log(res)
          const data = res.data.results[index]
          // let arr = []
          res.data.results.forEach((item) => {
            // this.kTime.push(item[this.num].periodDate)
            // arr.push(parseInt(item[this.num].tempStart), parseInt(item.tempEnd), parseInt(item.tempMax), parseInt(item.tempMin))
            // this.kData.push(arr)
            // arr = []
            this.editableTabs.push(item.eqpTemp)
          })
          this.kTime.push(data.periodDate)
          this.kData.push(
            parseInt(data.tempStart),
            parseInt(data.tempEnd),
            parseInt(data.tempMax),
            parseInt(data.tempMin)
          )
          this.editableTabsValue = this.editableTabs[0]
        })
        .finally(() => {
          this.kChart()
        })
    },
    kChart() {
      var chartDom = document.getElementById('kChart')
      var mycharts = echarts.init(chartDom)
      var option

      option = {
        legend: {
          data: []
        },
        xAxis: {
          type: 'category',
          data: this.kTime
        },
        yAxis: {},
        series: [
          {
            type: 'k',
            data: this.kData
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        }
      }
      mycharts.setOption(option)
      mycharts.on('click', (params) => {
        this.getLData(params.name)
      })
    },
    lChart() {
      var mycharts = echarts.init(document.getElementById('lineChart'))
      var option
      option = {
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
          data: this.extraTitle
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
        yAxis: { type: 'value' },
        series: [
          {
            name: this.extraTitle[0],
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
            name: this.extraTitle[1],
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
            name: this.extraTitle[2],
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
            animationEasing: 'quadraticOut',
            markLine: {
              data: [{ type: 'max', name: '最大数据' }]
            }
          },
          {
            name: this.extraTitle[3],
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
            animationEasing: 'quadraticOut',
            markLine: {
              data: [{ type: 'max', name: '最大数据' }]
            }
          }
        ]
      }
      mycharts.setOption(this.loadTempDataFirst(option), true)
    },
    getLData(time) {
      this.tempsValue = []
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        target: document.querySelector('#tempchar')
      })

      tempbytime('APJ-TRM1', {
        beginTime: time,
        endTime: time
      })
        .then((res) => {
          console.log(res)
          this.tempsValue = res.data.results
          loading.close()
        })
        .finally(() => {
          this.lChart()
        })
    },
    loadTempDataFirst(option) {
      option.xAxis.data = this.produce(this.tempsValue, 'create_date')
      option.series[0].data = this.produce(this.tempsValue, 'temp_pv')
      option.series[1].data = this.produce(this.tempsValue, 'temp_sp')
      option.series[2].data = this.produce(this.tempsValue, 'temp_min')
      option.series[3].data = this.produce(this.tempsValue, 'temp_max')
      // 重置Y轴
      var limitMax = 186
      var limitMin = 174
      var myYAxis = this.getYAxis(option.series[0].data, limitMax, limitMin)
      option.yAxis = myYAxis
      return option
    },
    produce(data, name) {
      var result = []
      for (var i = 0, len = data.length; i < len; i++) {
        result.push(data[i][name])
      }
      return result
    },
    getYAxis(tempsValue, limitMax, limitMin) {
      var dataMax = limitMax
      var dataMin = limitMin
      var myYAxis = {}
      myYAxis.type = 'value'
      if (this.searchBtn === '数据线查询' || limitMin === '') {
        // 展示所有的数据,当数据没有超过上下限时显示同 else
        if (tempsValue.length > 0) {
          for (var i = 0; i < tempsValue.length; i++) {
            var tempv = parseFloat(tempsValue[i])
            if (isNaN(dataMax) || dataMax === '') {
              dataMax = tempv
            } else {
              if (dataMax < tempv) {
                dataMax = tempv
              }
            }
            if (isNaN(dataMin) || dataMin === '') {
              dataMin = tempv
            } else {
              if (dataMin > tempv) {
                dataMin = tempv
              }
            }
          }
        }
      }
      if (!isNaN(dataMax) && dataMax !== '') {
        myYAxis.max = dataMax
      }
      if (!isNaN(dataMin) && dataMin !== '') {
        myYAxis.min = dataMin
      }
      return myYAxis
    }
  }
}
</script>

<style  scoped>
#kChart,
#lineChart {
  width: 100%;
  height: 400px;
  margin-top: 20px;
}
.form {
  margin-top: 20px;
}
</style>
