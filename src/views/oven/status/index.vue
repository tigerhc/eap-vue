<template>
  <div class="monitor">
    <div style="height: 300px;">
      <div id="monitorChart" :style="{width: '80%', height: '300px',float:'left'}"/>
      <el-button style="float:right" type="text" @click="maxFull">最大化</el-button>
    </div>

  <div class="content">
      <div :class="statusText[item.eqpStatus ||'status']"  v-for="(item,index) in tabData" :key="index" class="item">
        <div :class="statusText[item.eqpStatus]"  class="item-header">
          <span>{{item.eqpId}}</span>
          <span>{{item.modelName}}</span>
        </div>
        <div class="item-content">
          <div class="item-mid">
            <div class="item-left">
              <img  src="@/assets/img/temp.jpg" >
            </div>
            <div class="item-right">
              <div class="item-right-text">
                <label>程序位置</label> <span>{{ item.ptNo }}</span>
              </div>
              <div class="item-right-text">
                <label>当前段位</label> <span>{{ item.segNo }}</span>
              </div>
              <div class="item-right-text">
                <label>剩余时间</label> <span>{{ item.rtime }}</span>
              </div>
            </div>
          </div>
          <div class="temp">
            <span style="margin-right: 54px;">{{ item.temp }} ℃</span>
          </div>
          <div class="item-buttom">
            <div>
              <label style="margin-left:0.2rem">批次:</label> <span>{{ item.lotId }}</span>
            </div>
            <div style="font-size: 1.3rem;margin-top: 0.4rem;">
              <label style="margin-left:0.2rem">程序号:</label> <span>{{ item.ptNo }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { fetchList, fetchChart } from '@/api/dashboard/dashboard'
import Screenfull from '@/components/Screenfull'
export default {
  name: 'status',
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
        IDLE: 'span-IDLE',
        status:'span-status'
      }// 显示状态
    }
  },
  watch: {
    tabData() {
      this.timer()
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
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
    maxFull() {
      const route = this.$router.resolve({
        name: 'statusFull'
      })
      window.open(route.href, '_blank')
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
        'queryFields': 'eqpId,controlState,modelName,lotId,eqpStatus,connectionStatus,recipeName,lockFlag,'
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
              },
              color:function(params) {
                var colorList = ['#999fa7','#43ca17','#e81818','#cfe60c'];
                return colorList[params.dataIndex]
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
.span-status{
  border: 2px solid #999fa7;
}
.span-ALARM {
  border: 2px solid #e81818;
  background: #e81818
}
.span-DOWN {
  border: 2px solid #999fa7;
  background: #999fa7
}
.span-RUN {
  border: 2px solid #43ca17;
  background: #43ca17
}
.span-IDLE {
  border: 2px solid #cfe60c;
  background: #cfe60c
}
.monitor {
    .content {
        border-top : 1px solid #dcdfe6;
        padding-top: 20px;
        padding-bottom: 20px;
        display: flex;
        flex-wrap: wrap;
        .item {
            display: flex;
            width: 16rem;
            height: 20rem;
            flex-direction: column ;
            margin-left: 20px;
            margin-top: 20px;
            .item-header {
              height: 5rem;
              span {
                color: white;
                height: 2.5rem;
                line-height: 2.5rem;
                font-size: 1.5rem;
                    display: inherit;
              }
            }
            .item-content {
              background: white;
              height: 15rem;
              .item-mid {
                height: 7rem;
                .item-left {
                  width: 50%;
                  float: left;
                  img {
                    width: 100%;
                    height: 7rem;
                  }
                }
                .item-right {
                  width: 50%;
                  float: right;
                  padding-left: 10px;
                  padding-right: 10px;
                  .item-right-text {
                    display: flex;
                    line-height: 2.33rem;
                    height: 2.33rem;
                    justify-content: space-between;
                  }
                }
              }
              .temp{
                text-align: center;
                width: 98%;
                height: 4rem;
                line-height: 4rem;
                font-size: 2rem;
              }
              .item-buttom {
                height: 3rem;
              }
            }
        }
    }
}
</style>
