<template>
  <div class="eqpInfo">
    <el-row>
      <el-card>
        <h2>设备概况</h2>
        <div id="survey" />
      </el-card>
      <el-card>
        <h2>今日报警</h2>
        <w-select-dept class="selection" @input="change" />
        <div id="alarm" />
      </el-card>
      <el-card>
        <h2>产品进度</h2>
        <div id="progress" />
      </el-card>
      <el-card>
        <h2>合格率</h2>
        <div id="qualified" />
      </el-card>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import WSelectDept from '../../../components/eap-select-dept/index'
export default {
  name: '',
  components: {
    WSelectDept
  },
  data() {
    return {
      optionsList: [],
      surveyCharts: '',
      surveyOpinion: ['运行', '离线', '待机'],
      surveyOpinionData: [
        { value: 12, name: '运行' },
        { value: 5, name: '离线' },
        { value: 3, name: '待机' }
      ],
      alarmCharts: '',
      alarmOpinion: ['未处理', '已处理'],
      alarmOpinionData: [
        { value: 12, name: '未处理' },
        { value: 5, name: '已处理' }
      ],
      progressCharts: '',
      progressOpinionData: [
        {
          value: 70,
          detail: {
            offsetCenter: ['0%', '0%']
          }
        }
      ],
      qualifiedCharts: '',
      qualifiedOpinionData: [
        {
          value: 70,
          detail: {
            offsetCenter: ['0%', '0%']
          }
        }
      ]
    }
  },
  // 调用
  mounted() {
    this.$nextTick(function() {
      this.surveyPie('survey')
      this.alarmPie('alarm')
      this.progressGauge('progress')
      this.qualifiedGauge('qualified')
    })
  },
  methods: {
    change(v) {
      console.log(v)
    },
    // 设备概况饼状图
    surveyPie(id) {
      this.surveyCharts = echarts.init(document.getElementById(id))
      this.surveyCharts.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>{b}:{c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: '10%',
          bottom: '30%',
          data: this.surveyOpinion
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            center: ['30%', '55%'],
            color: ['greenyellow', 'red', '#58D9F9'],
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '28',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.surveyOpinionData
          }
        ]
      })
    },
    // 今日报警饼状图
    alarmPie(id) {
      this.alarmCharts = echarts.init(document.getElementById(id))
      this.alarmCharts.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>{b}:{c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: '10%',
          bottom: '30%',
          data: this.alarmOpinion
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            center: ['30%', '55%'],
            color: ['greenyellow', 'red'],
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '28',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.alarmOpinionData
          }
        ]
      })
    },
    qualifiedGauge(id) {
      this.qualifiedCharts = echarts.init(document.getElementById(id))
      this.qualifiedCharts.setOption({
        series: [
          {
            type: 'gauge',
            radius: '60%',
            center: ['50%', '55%'],
            itemStyle: {
              color: '#58D9F9',
              shadowColor: 'rgba(0,138,255,0.45)',
              shadowBlur: 10,
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            startAngle: 90,
            endAngle: -270,
            pointer: {
              show: false
            },
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false
            },
            axisLine: {
              lineStyle: {
                width: 15
              }
            },
            splitLine: {
              show: false,
              distance: 0,
              length: 20
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false,
              distance: 50
            },
            data: this.qualifiedOpinionData,

            detail: {
              width: 50,
              height: 20,
              fontSize: 16,
              color: 'auto',
              borderColor: 'auto',
              borderRadius: 20,
              borderWidth: 1,
              formatter: '{value}%',
              valueAnimation: true
            }
          }
        ]
      })
    },
    progressGauge(id) {
      this.progressCharts = echarts.init(document.getElementById(id))
      this.progressCharts.setOption({
        series: [
          {
            type: 'gauge',
            radius: '60%',
            startAngle: 90,
            center: ['50%', '55%'],
            endAngle: -270,
            itemStyle: {
              color: '#58D9F9',
              shadowColor: 'rgba(0,138,255,0.45)',
              shadowBlur: 10,
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            pointer: {
              show: false
            },
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false
            },
            axisLine: {
              lineStyle: {
                width: 15
              }
            },
            splitLine: {
              show: false,
              distance: 0,
              length: 20
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false,
              distance: 50
            },
            data: this.progressOpinionData,
            title: {
              fontSize: 14
            },
            detail: {
              width: 50,
              height: 20,
              fontSize: 16,
              color: 'auto',
              borderColor: 'auto',
              borderRadius: 20,
              borderWidth: 1,
              formatter: '{value}%',
              valueAnimation: true
            }
          }
        ]
      })
    }
  }
}
</script>

<style  scoped >
h2 {
  margin: 0;
}
#survey,
#alarm,
#progress,
#qualified {
  width: 100%;
  height: 300px;
}
.eqpInfo {
  width: 100%;
  height: calc(100vh - 85px);
  padding-top: 20px;
}
.eqpInfo .el-row {
  width: 100%;
  height: 40%;
  display: flex;
  align-content: center;
  justify-content: space-around;
}
.eqpInfo .el-row .el-card {
  width: 23%;
}
.selection {
  float: left;
  margin-top: 10px;
  z-index: 10;
}
</style>
