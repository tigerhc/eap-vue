<template>
  <div>
    <el-form ref="modelForm" :inline="true" :rules="rules" :model="modelList" class="modelForm" label-width="150px">
      <el-form-item label="批次号" prop="lotId">
        <!--:autosize="{ minRows: 2, maxRows: 4}"-->
        <el-input v-model="modelList.lotId" style="width: 530px" type="textarea" />
      </el-form-item>
      <el-form-item label="站别" prop="officeName">
        <el-input v-model="modelList.officeName" />
      </el-form-item>
      <el-form-item label="设备号" prop="eqpId">
        <el-input v-model="modelList.eqpId" />
      </el-form-item>
      <el-form-item label="程序名" prop="recipeCode">
        <el-input v-model="modelList.recipeCode" />
      </el-form-item>
      <el-form-item label="作业开始时间" prop="startTime">
        <el-input v-model="modelList.startTime" />
      </el-form-item>
      <el-form-item label="作业结束时间" prop="endTime">
        <el-input v-model="modelList.endTime" />
      </el-form-item>
    </el-form>
    <div class="filter-container" />
    <el-button
      v-for="tempName in otherTempsTitles"
      v-if="tempName.indexOf('PV') != -1"
      :key="tempName"
      type="primary"
      icon="el-icon-arrow-right"
      style="margin: 5px"
      @click="loadTempDataPart(tempName)"
    >
      {{ tempName.replace('PV', '') }}
    </el-button>
    <el-button type="primary" round icon="el-icon-arrow-right" @click="loadTempDataPV">加载测量数据</el-button>
    <el-button type="primary" round icon="el-icon-d-arrow-right" @click="loadTempDataAll">加载所有数据</el-button>
    <div id="tempChart" :style="{ width: '100%', height: '500px' }" />
  </div>
</template>

<script>
import * as echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import { fetchEcharts } from '@/api/oven/temperature'

export default {
  name: 'TempModel',
  data() {
    return {
      chart: null,
      id: '',
      resultList: [],
      otherTempsTitles: [],
      rules: {},
      modelList: {
        lotId: '',
        officeName: '',
        eqpId: '',
        recipeCode: '',
        startTime: '',
        endTime: ''
      },
      charLegend: ['运行温度', '设定温度', '低温报警', '高温报警']
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this.modelList = this.$route.query.list
    this.getList()
  },
  methods: {
    getList() {
      fetchEcharts(this.id).then((response) => {
        this.resultList = response.data.ovnBatchLotParamList
        var otherTempsTitle = response.data.otherTempsTitle
        this.otherTempsTitles = otherTempsTitle.split(',')
        this.initChart()
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('tempChart'))
      var Cureoption = {
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
            name: '运行温度',
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
            data: [],
            animationDuration: 3000,
            animationEasing: 'quadraticOut'
          },
          {
            name: '设定温度',
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
            data: [],
            animationDuration: 2600,
            animationEasing: 'quadraticOut'
          },
          {
            name: '低温报警',
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
            data: [],
            animationDuration: 2000,
            animationEasing: 'quadraticOut',
            markLine: {
              data: [{ type: 'max', name: '最大数据' }]
            }
          },
          {
            name: '高温报警',
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
            data: [],
            animationDuration: 2000,
            animationEasing: 'quadraticOut',
            markLine: {
              data: [{ type: 'max', name: '最大数据' }]
            }
          }
        ]
      }
      this.chart.setOption(this.loadTempDataFirst(Cureoption))
    },
    loadTempDataFirst(option) {
      option.xAxis.data = this.produce(this.resultList, 'createDate')
      option.series[0].data = this.produce(this.resultList, 'tempPv')
      option.series[1].data = this.produce(this.resultList, 'tempSp')
      option.series[2].data = this.produce(this.resultList, 'tempMin')
      option.series[3].data = this.produce(this.resultList, 'tempMax')
      return option
    },

    loadTempDataPV() {
      var option = this.chart.getOption()
      let length = 0
      // option.series = option.series.slice(0, 4)
      while (option.series.length > 4) {
        option.series.pop()
      }
      var newseries = option.series.slice(0, 4)
      this.charLegend = this.charLegend.slice(0, 4)
      for (let index = 0; index < this.otherTempsTitles.length; index++) {
        if (this.otherTempsTitles[index].indexOf('MAX') !== -1 || this.otherTempsTitles[index].indexOf('MIN') !== -1) {
          continue
        }
        if (this.otherTempsTitles[index].indexOf('SET') !== -1) {
          continue
        }
        length++
        if (length > 8) {
          break
        }
        const element = this.otherTempsTitles[index]
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
        if (this.otherTempsTitles[index].indexOf('SET') !== -1) {
          othterSeries.itemStyle.normal.lineStyle.type = 'dotted'
        }
        othterSeries.data = this.produceOther(this.resultList, index)
        newseries.push(othterSeries)
      }
      // option.legend[0].data = this.charLegend
      // this.chart.setOption(option)
      this.chart.setOption({
        legend: {
          data: this.charLegend
        },
        series: newseries
      })
      // this.chart.clear()
      return option
    },

    loadTempDataPart(tempName) {
      tempName = tempName.replace('PV', '')
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
        othterSeries.data = this.produceOther(this.resultList, index)
        option.series.push(othterSeries)
      }
      option.legend[0].data = this.charLegend
      this.chart.setOption(option)
      return option
    },

    loadTempDataAll() {
      var option = this.chart.getOption()
      option.series = option.series.slice(0, 4)
      this.charLegend = this.charLegend.slice(0, 4)
      for (let index = 0; index < this.otherTempsTitles.length; index++) {
        const element = this.otherTempsTitles[index]
        this.charLegend.push(element)

        const othterSeries = {
          name: element,
          smooth: true,
          type: 'line',
          data: [],
          animationDuration: 3000,
          animationEasing: 'quadraticOut'
        }
        othterSeries.data = this.produceOther(this.resultList, index)
        option.series.push(othterSeries)
      }
      // this.otherTempsTitles.forEach(function(value, index, array) {
      //   charLegend2.push(value)

      //           let othterSeries =  {
      //       name: value,
      //       smooth: true,
      //       type: 'line',
      //       data: [],
      //       animationDuration: 3000,
      //       animationEasing: 'quadraticOut'
      // }
      // othterSeries.data = this.produce(this.resultList, 'tempPv');
      // option.series.push( othterSeries);
      // })

      option.legend[0].data = this.charLegend
      this.chart.setOption(option)
      // option.series.push( othterSeries);
      // this.chart.setOption(this.loadCureData(Cureoption))
      return option
    },
    produce(data, name) {
      var result = []
      for (var i = 0, len = data.length; i < len; i++) {
        result.push(data[i][name])
      }
      return result
    },

    produceOther(data, index) {
      var result = []
      for (var i = 0, len = data.length; i < len; i++) {
        var otherTempsValues = data[i].otherTempsValue.split(',')
        result.push(otherTempsValues[index])
      }
      return result
    }
  }
}
</script>
<style scoped>
.modelForm {
  margin-top: 20px;
}
</style>

