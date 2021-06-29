<template>
  <div class="eqpInfo">
    <div class="row">
      <div class="col">
        <h3>设备概况</h3>
        <div id="survey"/>
      </div>
      <div class="col">
        <h3>今日报警</h3>
        <w-select-dept class="selection" @input="change" />
        <div id="alarm" />
      </div>
      <div class="col">
        <h3>产品进度</h3>
        <div id="progress" />
      </div>
      <div class="col">
        <h3>合格率</h3>
        <div id="qualified" />
      </div>
    </div>
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
                fontSize: '24',
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
                fontSize: '24',
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

<style  scoped lang='scss' >
.eqpInfo {
  width: 100%;
  height: calc(100vh - 85px);
  padding-top: 20px;
  .row {
    width: 100%;
    height: 60%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .col {
      width: 23%;
      height: 100%;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      padding: 10px;
      display: flex;
      // align-items: center;
      justify-content: space-between;
      flex-direction: column;
      h3 {
        margin: 0;
        line-height: 25px;
        margin-bottom: 15px;
      }
      #survey,
      #alarm,
      #progress,
      #qualified {
        width: 100%;
        height: calc(100% - 25px - 36px - 15px);
        div {
          width: 100%;
          height: 100%;
          .canvas {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
