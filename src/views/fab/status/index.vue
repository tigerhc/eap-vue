<template>
  <div :style="{overflowY:yScroll,height:monitorHeight}" class="monitor">
    <el-row>
      <el-col :span="8">
        <el-button style="float: left" type="text" @click="maxFull" />
        <div style="height: 300px">
          <div id="monitorChart" :style="{ width: '80%', height: '300px', float: 'left' }" />
        </div>
      </el-col>
      <el-col :span="16">
        <div>
          <strong
            ><span id="FirstTitle" style="font-size: 20px">{{ projectText }}工程生产情报</span>
          </strong>
          &nbsp;&nbsp;<date />
          <el-select :style="{width:'120px',float: 'right',marginRight: '1%',marginTop: '2px'}" v-model="curProject" placeholder="工程选择" @change="projectChange">
            <el-option v-for="item in projectList" :key="item" :label="item.lab" :value="item.value" />
          </el-select>
        </div>

        <el-row style="padding: 10 10px;margin-top: 30px;">
          <el-col :span="24" style="margin-top: 10px;">
            <eqp-panel-group ref="refs" :sel-project="curProject" @handleSetLineChartData="handleSetLineChartData" />
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" :style="{marginLeft:'-40%',width: '130%'}">
            <div class="grid-content bg-purple-dark pdttable">
              <div class="itemTitle">
                <span class="bigerfont">站点</span>
                <span class="bigfont">批次|数量</span>
                <span class="bigfont">仕挂|数量</span>
                <span class="bigfont">稼动状况</span>
              </div>
              <div v-for="(item, index) in yieldList" :key="index" class="itemTitle">
                <span class="bigerfont">{{ item.step_code }}</span>
                <span class="bigfont">{{ item.lot_no + '-' + item.lot_yield }}</span>
                <span class="bigfont littlefont">{{ item.waitwip }}</span>
                <span :class="statusText[item.eqp_status]">{{ item.eqp_status }}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!--<el-divider content-position="left"> 设备详细</el-divider>-->
    <!--<hr style="FILTER:alpha(opacity=100,finishopacity=0,style=3)" width="90%" color="#987cb9" SIZE="3" >-->
    <hr style="filter: alpha(opacity=100, finishopacity=0, style=3)" width="90%" color="#987cb9" SIZE="3" >

    <div class="content">
      <div v-for="(item, index) in tabData2[0]" :key="index">
        <div class="item">
          <span>{{ item.eqpId }}</span>
          <span>{{ item.lotNo }}</span>
          <span class="littlefont">{{ item.recipeCode }}</span>
          <span :class="statusText[item.eqpStatus]">{{ item.eqpStatus }}</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div v-for="(item, index) in tabData2[1]" :key="index">
        <div class="item">
          <span>{{ item.eqpId }}</span>
          <span>{{ item.lotNo }}</span>
          <span class="littlefont">{{ item.recipeCode }}</span>
          <span :class="statusText[item.eqpStatus]">{{ item.eqpStatus }}</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div v-for="(item, index) in tabData2[2]" :key="index">
        <div class="item">
          <span>{{ item.eqpId }}</span>
          <span>{{ item.lotNo }}</span>
          <span class="littlefont">{{ item.recipeCode }}</span>
          <span :class="statusText[item.eqpStatus]">{{ item.eqpStatus }}</span>
        </div>
      </div>
    </div>
    <div class="contentBi" ><!--style="display: flex; flex-direction: row"-->
      <div class="content">
        <div v-for="(item, index) in tabData2[3]" :key="index">
          <div class="item">
            <span>{{ item.eqpId }}</span>
            <span>{{ item.lotNo }}</span>
            <span class="littlefont">{{ item.recipeCode }}</span>
            <span :class="statusText[item.eqpStatus]">{{ item.eqpStatus }}</span>
          </div>
        </div>
      </div>

      <div class="content" ><!--style="margin-left: 110px"-->
        <div v-for="(item, index) in tabData2[4]" :key="index">
          <div class="item">
            <span>{{ item.eqpId }}</span>
            <span>{{ item.lotNo }}</span>
            <span class="littlefont">{{ item.recipeCode }}</span>
            <span :class="statusText[item.eqpStatus]">{{ item.eqpStatus }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div v-for="(item, index) in tabData2[5]" :key="index">
        <div class="item">
          <span>{{ item.eqpId }}</span>
          <span>{{ item.lotNo }}</span>
          <span class="littlefont">{{ item.recipeCode }}</span>
          <span :class="statusText[item.eqpStatus]">{{ item.eqpStatus }}</span>
        </div>
      </div>
    </div>

    <div class="content">
      <div v-for="(item, index) in tabData2[6]" :key="index">
        <div class="item">
          <span>{{ item.eqpId }}</span>
          <span>{{ item.lotNo }}</span>
          <span class="littlefont">{{ item.recipeCode }}</span>
          <span :class="statusText[item.eqpStatus]">{{ item.eqpStatus }}</span>
        </div>
      </div>
    </div>

    <!--    <div class="content">-->
    <!--      <div v-for="(item,index) in tabData2[2]" :key="index" >-->
    <!--        <div class="item" >-->
    <!--          <span :class="{ first: item.eqpId=='SIM-TRM1' }">{{ item.eqpId }}</span>-->
    <!--          <span>{{ item.lotNo }}</span>-->
    <!--          <span class="littlefont">{{ item.recipeCode }}</span>-->
    <!--          <span :class="statusText[item.eqpStatus]">{{ item.eqpStatus }}</span>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>
<script>
import * as echarts from 'echarts'
import Date from '../../../components/Date/index'
import { fetchGetChart, fetchDataList, fetchYield } from '@/api/fab/monitor'
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
        IDLE: 'span-IDLE',
        READY: 'span-READY'
      }, // 显示状态
      statusColor: {
        ALARM: '#FF0000',
        DOWN: '#808080',
        RUN: '#FFFF00',
        IDLE: '#43ca17',
        IDLE2: '#8B0000',
        READY: '#000000'
      },
      projectText: '',
      curProject: 'YK',
      // projectList: [{ lab: '前工程', value: 'YK' }, { lab: '后工程', value: 'EK' }]
      projectList: [],
      DMProjectList: [{ lab: '部品', value: 'BP' }, { lab: '前工程', value: 'YK' }, { lab: '后工程', value: 'EK' }],
      SIMProjectList: [{ lab: '前工程', value: 'YK' }, { lab: '后工程', value: 'EK' }],
      yScroll: 'hidden',
      monitorHeight: '100vh',
      lineNo: 'DM'
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
    clearInterval(this.timer)
  },
  mounted() {
    // eslint-disable-next-line eqeqeq,no-empty
    if (window.location.host.indexOf('10.160.144.9') > -1) {
      // var ele = window.document.getElementById('FirstTitle')
      // ele.innerHTML = 'DM工程生产情报'
      this.projectText = 'DM'
      this.curProject = 'BP'
      this.yScroll = 'scroll'
      this.monitorHeight = '800px'
      this.projectList = this.DMProjectList
      this.lineNo = 'DM'
    } else {
      this.projectText = 'SIM'
      this.curProject = 'YK'
      this.yScroll = 'scroll' // hidden
      this.monitorHeight = '800px' // 100vh
      this.projectList = this.SIMProjectList
      this.lineNo = 'SIM'
    }
    // this.projectText = 'DM' // TODO 本地调试
    // this.curProject = 'YK' // TODO 本地调试
    // this.projectList = this.DMProjectList // TODO 本地调试

    this.inIt()
    if (this.timer) {
      clearInterval(this.timer)
    } else {
      this.timer = setInterval(() => {
        this.inIt()
      }, 15000)
    }
  },
  methods: {
    projectChange() {
      // if (window.location.hostname.indexOf('10.160.144.9') > -1) {
      //   this.host = "http://10.160.144.9:800/dashboard";
      // }
      // 样式控制, 仅部品加滚动条
      if (this.curProject === 'BP') {
        this.yScroll = 'scroll'
        this.monitorHeight = '800px'
      } else {
        if (this.lineNo === 'SIM' && this.curProject === 'YK') {
          this.monitorHeight = '800px'
          this.yScroll = 'scroll'
        } else {
          this.yScroll = 'hidden'
          this.monitorHeight = '100vh'
        }
      }
      this.inIt()
    },
    inIt() {
      this.getData()
      this.getList()
      this.getYield()
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    getData() {
      var param = {}
      param.curProject = this.curProject
      fetchGetChart(param).then((response) => {
        for (const item of response.data) {
          this.statusList.push(item.EQP_STATUS)
        }
        this.dataList = response.data
        this.initChart()
      })
    },
    // 这是一个定时器
    timer() {
      setTimeout(() => {
        this.inIt()
        this.$refs.refs.getData()
      }, 15000)
    },

    getYield() {
      fetchYield({
        lineNo: this.lineNo,
        curProject: this.curProject
      }).then((response) => {
        this.yieldList = response.data
      })
    },

    getList() {
      this.tabData2 = [[]]
      const params = {
        sort: 'updateDate',
        'page.pn': 1,
        'page.size': 999999,
        delFlag: 0,
        queryFields: 'eqpId,controlState,lotNo,eqpStatus,connectionStatus,recipeCode,lockFlag,',
        curProject: this.curProject
      }
      fetchDataList(params).then((res) => {
        this.tabData = res.data
        var lineIndex = 0
        this.tabData2[1] = []
        this.tabData2[2] = []
        this.tabData2[3] = []
        this.tabData2[4] = []
        this.tabData2[5] = []
        this.tabData2[6] = []
        if (this.tabData !== '[][]') {
          this.tabData.forEach((item) => {
            // APJ
            if (item.eqpId === 'DM-FRD-SMT1') {
              lineIndex = 1
              // this.projectText = 'DM'
            }
            if (item.eqpId === 'DM-HB1-SORT1') {
              lineIndex = 2
            }
            if (item.eqpId === 'DM-DBCT-SORT1') {
              lineIndex = 3
            }
            if (item.eqpId === 'DM-DBCB-SORT1') {
              lineIndex = 4
            }
            if (item.eqpId === 'DM-HB2-SORT1') {
              lineIndex = 5
            }
            if (item.eqpId === 'DM-TRM1') {
              lineIndex = 6
            }
            // SIM
            if (item.eqpId === 'SIM-WB-1A') {
              lineIndex = 1
              // this.projectText = 'SIM'
            }
            if (item.eqpId === 'SIM-AOI1') {
              lineIndex = 2
              // this.projectText = 'SIM'
            }
            this.tabData2[lineIndex].push(item)
          })
        }
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
                  IDLE2: '#8B0000',
                  READY: '#87CEFA'
                }
                return statusColor2[params.name]
              }
            }
          }
        ]
      }
      option.legend.data = this.statusList
      const arry = []
      this.dataList.forEach((item) => {
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
.span-READY {
  background-color: #87cefa;
}
.span-STOP {
  background-color: DarkRed;
}
.monitor {
  overflow-x: hidden;
  .pdttable {
    /*border-top : 1px solid #dcdfe6;*/
    /*padding-top: 10px;*/
    display: flex;
    //  justify-content: center;
    flex-wrap: wrap;
    .item {
      display: flex;
      width: 120px;
      height: 80px;
      border: 1px solid #500f0f;
      flex-direction: column;
      margin-left: 2px;
      margin-top: 0px;
      span {
        line-height: 20px;
        text-align: center;
        height: 20px;
        border-bottom: 1px solid #dcdfe6;
        font-size: 12px;
      }
      span.littlefont {
        font-size: 10px;
      }
      span.bigfont {
        font-size: 14px;
        font-weight: bold;
      }
      span.bigerfont {
        font-size: 18px;
        font-weight: bold;
      }
    }
    .itemTitle {
      display: flex;
      width: 160px;
      height: 140px;
      border: 1px solid #500f0f;
      flex-direction: column;
      margin-left: 2px;
      margin-top: 0px;
      span {
        line-height: 35px;
        text-align: center;
        height: 35px;
        border-bottom: 1px solid #dcdfe6;
        font-size: 12px;
      }
      span.littlefont {
        font-size: 10px;
      }
      span.bigfont {
        font-size: 14px;
        font-weight: bold;
      }
      span.bigerfont {
        font-size: 18px;
        font-weight: bold;
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
      width: 178px;
      height: 80px;
      border: 1px solid #500f0f;
      flex-direction: column;
      margin-left: 10px;
      margin-top: 10px;
      span {
        /*line-height: 20px;*/
        text-align: center;
        height: 30px;
        border-bottom: 0.5px solid #dcdfe6;
        font-size: 12px;
      }
      span.littlefont {
        font-size: 8px;
      }
      span.bigfont {
        font-size: 14px;
        font-weight: bold;
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
<style>
  .card-panel-text{font-size: 20px !important;}
  .panel-group .card-panel{height: 210px !important;}
</style>
