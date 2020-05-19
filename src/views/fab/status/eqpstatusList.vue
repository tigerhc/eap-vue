<template>
  <div class="monitor">
    <div style="height: 300px;">
      <div id="monitorChart" :style="{width: '80%', height: '300px',float:'left'}"/>
      <el-button style="float:right" type="text" @click="maxFull">最大化</el-button>
    </div>

    <div class="content">
      <div v-for="(item,index) in tabData" :key="index" class="item">
        <span>{{ item.eqpId }}</span>
        <span>{{ item.lotNo }}</span>
        <span class="littlefont">{{ item.recipeCode }}</span>
        <span :class="statusText[item.eqpStatus]">{{ item.eqpStatus }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { fetchGetChart, fetchDataList } from '@/api/sys/monitor'
import Screenfull from '@/components/Screenfull'
export default {
  name: 'Monitor',
  components: {
    Screenfull
  },
  data() {
    return {
      chart: null,
      tabData: [],
      dataList: [],
      statusList: [],
      statusText: {
        ALARM: 'span-ALARM',
        DOWN: 'span-DOWN',
        RUN: 'span-RUN',
        IDLE: 'span-IDLE'
      }, // 显示状态
      statusColor: {
        ALARM: '#FF0000',
        DOWN: '#808080',
        RUN: '#FFFF00',
        IDLE: '#43ca17',
        IDLE2: '#8B0000'
      }

    }
  },
  mounted() {
    this.getData()
    this.getList()
  },
  methods: {
    getData() {
      fetchGetChart().then(response => {
        for (const item of response.data) {
          this.statusList.push(item.EQP_STATUS)
        }
        this.dataList = response.data
        this.initChart()
      })
    },
    getList() {
      const params = {
        'sort': 'updateDate',
        'page.pn': 1,
        'page.size': 999999,
        'delFlag': 0,
        'queryFields': 'eqpId,controlState,lotNo,eqpStatus,connectionStatus,recipeCode,lockFlag,'
      }
      fetchDataList(params).then(res => {
        this.tabData = res.data
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('monitorChart'))
      var option = {
        title: {
          text: '设备运行状态',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: []
        },
        series: [
          {
            name: '状态类型',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              color: function(params) {
                // debugger
                // alert(this.statusColor[params.name]);
                // var colorList = ['#FF0000', '#808080', '#FFFF00', '#43ca17', '#8B0000']
                // statusText[item.eqpStatus]
                var statusColor2 = {
                  ALARM: '#FF0000',
                  DOWN: '#808080',
                  IDLE: '#FFFF00',
                  RUN: '#43ca17',
                  IDLE2: '#8B0000'
                }
                return statusColor2[params.name]
              }
            }
          }
        ]
      }
      option.legend.data = this.statusList
      const arry = []
      this.dataList.forEach(item => {
        const obj = {}
        obj.name = item.EQP_STATUS
        obj.value = item.COUNT
        arry.push(obj)
      })
      option.series[0].data = arry
      this.chart.setOption(option)
    },
    maxFull() {
      const route = this.$router.resolve({
        name: 'screenfullStatus'
      })
      window.open(route.href, '_blank')
    }
  }
}
</script>
<style  lang="scss" scoped>
.span-ALARM {
  background-color: red;
}
.span-DOWN {
  background-color: gray;
}
.span-RUN {
  background-color: green;
}
.span-IDLE {
  background-color: yellow;
}
.span-STOP {
  background-color: DarkRed;
}
.monitor {
    .content {
        border-top : 1px solid #dcdfe6;
        padding-top: 20px;
        display: flex;
      //  justify-content: center;
        flex-wrap: wrap;
        .item {
            display: flex;
            width: 150px;
            height: 200px;
            border: 1px solid #500f0f;
            flex-direction: column ;
            margin-left: 20px;
            margin-top: 20px;
            span {
              line-height: 50px;
              text-align: center;
              height: 50px;
              border-bottom:1px solid #dcdfe6;
            }
            span.littlefont {
              font-size:12px;
            }
        }
    }
}
</style>
