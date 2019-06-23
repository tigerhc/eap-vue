<template>
  <div class="monitor">
    <div style="height: 300px;">
      <div id="monitorChart" :style="{width: '80%', height: '300px',float:'left'}"/>
    </div>

    <div class="content">
      <div v-for="(item,index) in tabData" :key="index" class="item">
        <div class="item-text">
          <label>程序位置</label> <span>{{ item.ptNo }}</span>
        </div>
        <div class="item-text">
          <label>当前段位</label> <span>{{ item.segNo }}</span>
        </div>
        <div class="item-text">
          <label>剩余时间</label> <span>{{ item.rtime }}</span>
        </div>
        <div class="item-text">
          <label>温度</label> <span>{{ item.temp }}</span>
        </div>
        <div class="item-text">
          <label>批次</label> <span>{{ item.lotId }}</span>
        </div>
        <div class="item-text">
          <label>程序号</label> <span>{{ item.ptNo }}</span>
        </div>
        <div style="text-align: center;display: inline;" class="item-text" :class="statusText[item.eqpStatus]">{{ item.eqpStatus }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { fetchList, fetchChart } from '@/api/dashboard/dashboard'
import Screenfull from '@/components/Screenfull'
export default {
  name: 'dashboard',
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
      }// 显示状态
    }
  },
  watch: {
    tabData() {
      this.timer()
    }
  },
  destroyed() {
    clearTimeout(this.timer)
  },
  mounted() {
    this.inIt()
  },
  methods: {
    inIt() {
      this.getData()
      this.getList()
    },
    // 这是一个定时器
    timer() {
      return setTimeout(() => {
        this.inIt()
      }, 60000)
    },
    getData() {
      fetchChart().then(response => {
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
        'queryFields': 'eqpId,controlState,lotId,eqpStatus,connectionStatus,recipeName,lockFlag,'
      }
      fetchList(params).then(res => {
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
.monitor {
    .content {
        border-top : 1px solid #dcdfe6;
        padding-top: 20px;
        display: flex;
      //  justify-content: center;
        flex-wrap: wrap;
        .item {
            display: flex;
            width: 200px;
            height: 350px;
            border: 1px solid #500f0f;
            flex-direction: column ;
            margin-left: 20px;
            margin-top: 20px;
            .item-text {
               display: flex;
               line-height: 50px;
               height: 50px;
               border-bottom: 1px solid #dcdfe6;
               justify-content: space-between;
               label {
                 font-weight: 900;
                 margin-left: 20px;
              }
               span {
                margin-right: 20px;
              }
            }
        }
    }
}
</style>
