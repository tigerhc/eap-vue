<template>
  <div class="monitor">
    <el-row>
      <el-col :span="8">
        <el-button style="float:left" type="text" @click="maxFull"/>
        <div style="height: 300px;">
          <div id="monitorChart" :style="{width: '80%', height: '300px',float:'left'}"/>

        </div>
      </el-col>
      <el-col :span="16">
        <div><span style="font-size: 20px"><strong>SIM工程生产情报</strong></span>  <date/></div>

          <el-row>
            <el-col :span="24">
              <eqp-panel-group @handleSetLineChartData="handleSetLineChartData"/>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <div class="grid-content bg-purple-dark pdttable">
              <div class="item">
                <span class="bigfont">站点</span>
                <span class="bigfont">批次|数量</span>
                <span class="bigfont">仕挂|数量</span>
                <span class="bigfont">稼动状况</span>
              </div>
              <div v-for="(item,index) in yieldList" :key="index" class="item">
                <span class="bigfont">{{ item.step_code }}</span>
                <span>{{ item.lot_no +"-"+item.lot_yield }}</span>
                <span class="littlefont">{{ item.waitwip }}</span>
                <span :class="statusText[item.eqp_status]">{{ item.eqp_status }}</span>
              </div>
            </div>
            </el-col>
          </el-row>
      </el-col>
    </el-row>

    <!--<el-divider content-position="left"> 设备详细</el-divider>-->
    <!--<hr style="FILTER:alpha(opacity=100,finishopacity=0,style=3)" width="90%" color="#987cb9" SIZE="3" >-->
    <hr style="FILTER:alpha(opacity=100,finishopacity=0,style=3)" width="90%" color="#987cb9" SIZE="3" >

    <div class="content">
      <div v-for="(item,index) in tabData2[0]" :key="index" >
        <div class="item" >
          <span >{{ item.eqpId }}</span>
          <span>{{ item.lotNo }}</span>
          <span class="littlefont">{{ item.recipeCode }}</span>
          <span :class="statusText[item.eqpStatus]">{{ item.eqpStatus }}</span>
        </div>
      </div>
    </div>

    <div class="content">
      <div v-for="(item,index) in tabData2[1]" :key="index" >
        <div class="item" >
          <span >{{ item.eqpId }}</span>
          <span>{{ item.lotNo }}</span>
          <span class="littlefont">{{ item.recipeCode }}</span>
          <span :class="statusText[item.eqpStatus]">{{ item.eqpStatus }}</span>
        </div>
      </div>
    </div>

    <div class="content">
      <div v-for="(item,index) in tabData2[2]" :key="index" >
        <div class="item" >
          <span :class="{ first: item.eqpId=='SIM-TRM1' }">{{ item.eqpId }}</span>
          <span>{{ item.lotNo }}</span>
          <span class="littlefont">{{ item.recipeCode }}</span>
          <span :class="statusText[item.eqpStatus]">{{ item.eqpStatus }}</span>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import echarts from 'echarts'
import Date from '../../../components/Date/index'
import { fetchGetChart, fetchDataList, fetchYield } from '@/api/sys/monitor'
import Screenfull from '@/components/Screenfull'
import EqpPanelGroup from './components/EqpPanelGroup'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'Monitor',
  components: {
    Screenfull,
    Date,
    EqpPanelGroup

  },
  data() {
    return {
      chart: null,
      tabData: [],
      tabData2: [[]],
      dataList: [],
      statusList: [],
      yieldList: [],
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
    this.getYield()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    getData() {
      fetchGetChart().then(response => {
        for (const item of response.data) {
          this.statusList.push(item.EQP_STATUS)
        }
        this.dataList = response.data
        this.initChart()
      })
    },

    getYield() {
      fetchYield({
        lineNo: 'SIM'
      }).then(response => {
        this.yieldList = response.data
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
        var lineIndex = 0
        this.tabData2[1] = []
        this.tabData2[2] = []
        this.tabData2[3] = []
        this.tabData.forEach(item => {
          if (item.eqpId === 'SIM-WB-1A') {
            lineIndex = 1
          }
          if (item.eqpId === 'SIM-AOI1') {
            lineIndex = 2
          }
          this.tabData2[lineIndex].push(item)
        })

        // this.dataList.forEach(item => {
        //   const obj = {}
        //   obj.name = item.EQP_STATUS
        //   obj.value = item.COUNT
        //   arry.push(obj)
        // })
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
  .pdttable {
    /*border-top : 1px solid #dcdfe6;*/
    /*padding-top: 10px;*/
    display: flex;
    //  justify-content: center;
    flex-wrap: wrap;
    .item {
      display: flex;
      width: 100px;
      height: 80px;
      border: 1px solid #500f0f;
      flex-direction: column ;
      margin-left: 2px;
      margin-top: 0px;
      span {
        line-height: 20px;
        text-align: center;
        height: 20px;
        border-bottom:1px solid #dcdfe6;
        font-size:12px;
      }
      span.littlefont {
        font-size:10px;
      }
      span.bigfont {
        font-size:14px;
        font-weight:bold;
      }
    }
  }

    .content {
      /*margin-top: 1px;*/
        /*border-top : 1px solid #dcdfe6;*/
        padding-top: 5px;
        display: flex;
      //  justify-content: center;
        flex-wrap: wrap;
        .item {
            display: flex;
            width: 100px;
            height: 80px;
            border: 1px solid #500f0f;
            flex-direction: column ;
            margin-left: 10px;
            margin-top: 10px;
            span {
              /*line-height: 20px;*/
              text-align: center;
              height: 20px;
              border-bottom:0.5px solid #dcdfe6;
              font-size:12px;
            }
            span.littlefont {
              font-size:8px;
            }
            span.bigfont {
              font-size:14px;
              font-weight:bold;
            }
            span.first {
              background-color: #d4f54e;
            }
        }
        .firstItem {
          /*margin-left: 120px;*/
          word-break: normal;
          word-wrap: break-word;
          border: 1px solid #d4f54e;
        }
    }
}
</style>
