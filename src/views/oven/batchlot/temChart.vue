<template>
  <div>
    <el-form ref="modelForm" :inline="true" :rules="rules" :model="modelList" class="modelForm" label-width="150px">
      <el-form-item label="批次号" prop="lotId">
        <el-input style="width:530px" v-model="modelList.lotId" type="textarea"/>
      </el-form-item>
      <el-form-item label="站别" prop="officeName">
        <el-input v-model="modelList.officeName"/>
      </el-form-item>
      <el-form-item label="设备号" prop="eqpId">
        <el-input v-model="modelList.eqpId"/>
      </el-form-item>
      <el-form-item label="程序名" prop="recipeCode">
        <el-input v-model="modelList.recipeCode"/>
      </el-form-item>
      <el-form-item label="作业开始时间" prop="startTime">
        <el-input v-model="modelList.startTime"/>
      </el-form-item>
      <el-form-item label="作业结束时间" prop="endTime">
        <el-input v-model="modelList.endTime"/>
      </el-form-item>
    </el-form>
    <div id="tempChart" :style="{width: '100%', height: '500px'}"/>
  </div>

</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import { fetchList, fetchEcharts } from '@/api/sys/temperature'
export default {
  name:'tempModel',
  data() {
    return {
      chart: null,
      id: '',
      resultList: [],
      rules:{},
      modelList: {
        lotId: '',
        officeName: '',
        eqpId: '',
        recipeCode: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this.modelList = this.$route.query.list
    this.getList()
  },
  methods: {
    getList() {
      fetchEcharts(this.id).then(response => {
        this.resultList = response.data.ovnBatchLotParamList
        this.initChart()
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('tempChart'))
      var Cureoption = {
        title: {
          text: '温度曲线',
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
          data: ['运行温度', '设定温度', '低温报警', '高温报警']
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
        yAxis: [{
          type: 'value'
        }
        ],
        series: [
          {
            name: '运行温度', itemStyle: {
              normal: {
                color: '#458B74',
                lineStyle: {
                  color: '#458B74',
                  width: 2
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
                color: '#FFDEAD',
                lineStyle: {
                  color: '#FFDEAD',
                  width: 2
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
                  width: 2
                }
              }
            },
            data: [],
            animationDuration: 2000,
            animationEasing: 'quadraticOut'
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
                  width: 2
                },
                areaStyle: {
                  color: '#BBFFFF'
                }
              }
            },
            data: [],
            animationDuration: 2000,
            animationEasing: 'quadraticOut'
          }
        ]
      }
      this.chart.setOption(this.loadCureData(Cureoption))
    },
    loadCureData(option) {
      option.xAxis.data = this.produce(this.resultList, 'createDate')
      option.series[0].data = this.produce(this.resultList, 'tempPv1')
      option.series[3].data = this.produce(this.resultList, 'tempMax')
      option.series[2].data = this.produce(this.resultList, 'tempMin')
      option.series[1].data = this.produce(this.resultList, 'tempSp1')
      return option
    },
    produce(data, name) {
      var result = []
      for (var i = 0, len = data.length; i < len; i++) {
        result.push(data[i][name])
      }
      return result
    }
  }
}
</script>
<style scoped>
.modelForm{
  margin-top: 20px;
}
</style>

