<template>
  <div class="app-container calendar-list-container">
    <div class="condition-panel">
      <el-form class="form" label-width="90px" size="small">
        <el-col :span="10">
          <el-form-item label="机种名:">
            <div class="condition">
              <el-select v-model="chartParam.lineNo" class="wid90" @change="lineNoChange">
                <el-option v-for="item in lineNoOptions" :key="item.lineNo" :label="item.lineNo" :value="item.lineNo" />
              </el-select>
              <el-select v-model="chartParam.productionName" class="wider" @change="productionNameChange">
                <el-option v-for="item in proNameOptions" :key="item" :label="item" :value="item" />
              </el-select>
              <el-select v-model="chartParam.lineType" :style="{width:'140px'}" @change="lineTypeChange">
                <el-option v-for="item in positionOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="日期:">
            <el-date-picker
              v-model="dateTime"
              :style="{ width: '320px' }"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="__"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="dateTimeClass"
            />
          </el-form-item>
        </el-col>
      </el-form>
      <button
        type="button"
        class="el-button el-button--primary el-button--medium filter-item"
        style="margin-left: 10px"
        @click="searchClick"
      >
        <i class="el-icon-search" />
        <span>搜索</span>
      </button>
      <button
        type="button"
        class="el-button el-button--primary el-button--medium filter-item"
        style="margin-left: 10px"
        @click="refreshClick"
      >
        <i class="el-icon-refresh" />
        <span>清空</span>
      </button>
      <button
        type="button"
        class="el-button el-button--primary el-button--medium filter-item"
        style="margin-left: 10px"
        @click="finddetail"
      >
        <i class="el-icon-refresh" />
        <span>导出</span>
      </button>
    </div>
    <div class="echartPanel">
      <div id="echAppLine" :style="{ width: '60%', height: '300px', float: 'left', marginLeft: '-4%' }" />
      <div :style="{ width: imgUrlWidth, height: imgUrlHeight, marginTop: '30px', float: 'left' }" class="picPanel">
        <chipImg :img-url="imgUrl" :img-option="imgOption" :click-able="clickAble" @positionName="positionChange" />
      </div>
    </div>
    <el-form id="subEchart" class="form" label-width="90px" size="small">
      <el-col :span="6">
        <el-form-item label="批号:">
          <div class="condition">
            <input v-model="chartParam.lotNo" type="text" placeholder="批号" class="el-input__inner" >
          </div>
        </el-form-item>
      </el-col>
    </el-form>
    <div id="brD">
      <div id="chartPanelLeft">
        <div id="echApp" :style="{ width: '90%', height: '350px' }" />
      </div>
      <div id="chartPanelRight">
        <div id="echAppRight" :style="{ width: '90%', height: '350px' }" />
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import api from '../../oven/ports/fetch'
import { kongdongChart, kongdongBar, proNameSelect, positionSelect } from '@/api/ms/monitor'
import chipImg from '@/views/tool/chipimg/chipimg'
export default {
  name: 'MeasureKongdongEchart',
  components: {
    chipImg
  },
  data() {
    return {
      chart: null,
      remarkArr: [],
      dateTime: [],
      chartParam: {
        lineNo: '',
        lotNo: '',
        productionName: '',
        startDate: '',
        endDate: '',
        lineType: ''
      },
      toolbarStatus: {
        exportsLoading: false
      },
      api: api('/ms/msmeasurekongdong/kongdongChartExport'),
      productionNo: '',
      imgUrl: '',
      imgOption: '',
      clickAble: true,
      positionOptions: [],
      proNameOptions: [],
      lineNoOptions: [{ lineNo: 'SMA' }, { lineNo: 'SX' }, { lineNo: 'SIM' }, { lineNo: '5GI' }, { lineNo: '6GI' }],
      // list:[{name:"T100",left:"40%",top:"30%",width:"50px",height:"60px",rotate:180,"checked":true,backgroundColor:"red",position:"relative"}],
      // picUrl:"11"
      imgUrlWidth: '35%',
      imgUrlHeight: '250px'
    }
  },
  mounted() {
    var now = new Date()
    var endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10)
    var startDate = endDate.slice(0, 8) + '01'
    this.dateTime = [startDate, endDate]
  },
  methods: {
    finddetail() {
      if (this.chartParam.productionName === '') {
        alert('机种名不可同时为空')
        return
      }
      this.chartParam.productionName = this.chartParam.productionName.toUpperCase()
      if (this.dateTime.length === 2) {
        this.chartParam.startDate = this.dateTime[0]
        this.chartParam.endDate = this.dateTime[1] + ' 23:59:59'
      }
      this.chartParam.lineType = this.chartParam.lineType.replace('全部', '')
      if (this.toolbarStatus.exportsLoading) {
        return
      }
      this.toolbarStatus.exportsLoading = true
      const q = this.chartParam
      this.api
        .export(q)
        .then((response) => {
          if (response.code === 0) {
            return import('../../oven/ports/Export2Excel').then((excel) => {
              excel.export_byte_to_excel(response.bytes, response.title)
              this.toolbarStatus.exportsLoading = false
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: (response && response.errmsg) || '导出失败!',
              duration: 2000
            })
            this.toolbarStatus.exportsLoading = false
          }
        })
        .catch((e) => {
          this.toolbarStatus.exportsLoading = false
        })
    },
    lineNoChange() {
      if (this.chartParam.lineNo !== '') {
        this.chartParam.productionName = '' // 清空上次的选择
        var _this = this
        var paramObj = {}
        paramObj.productionNo = this.chartParam.lineNo
        proNameSelect(paramObj).then((res) => {
          if (res.data.code === 0 || res.data.code === '0') {
            _this.proNameOptions = res.data.allProName
          } else {
            alert(res.data.msg)
          }
        })
      }
    },
    positionChange(pname) {
      if (
        this.positionOptions.length > 0 // &&
        // this.chartParam.productionName.indexOf('5GI') < 0 &&
        // this.chartParam.productionName.indexOf('6GI') < 0
      ) {
        this.chartParam.lineType = pname
        this.imgOption = this.imgUrl + pname
        this.searchClick()
      }
    },
    productionNameChange() {
      var param = {}
      param.productionName = this.chartParam.productionName.replace('J.', '')
      positionSelect(param).then((res) => {
        this.positionOptions = res.data.positionList
        if (this.chartParam.productionName.indexOf('5GI') > -1 || this.chartParam.productionName.indexOf('6GI') > -1) {
          this.positionOptions.splice(0, 0, 'IGBT')
        }
        this.positionOptions.splice(0, 0, '全部')
      })
      if (this.chartParam.productionName.indexOf('SX681') > -1) {
        this.imgUrl = 'SX681'
        this.imgOption = ''
        this.chartParam.lineType = ''
        this.imgUrlWidth = '35%'
        this.imgUrlHeight = '250px'
      } else if (this.chartParam.productionName.indexOf('SX680') > -1) {
        this.imgUrl = 'SX680'
        this.imgOption = ''
        this.chartParam.lineType = ''
        this.imgUrlWidth = '35%'
        this.imgUrlHeight = '250px'
      } else if (this.chartParam.productionName.indexOf('SIM') > -1) {
        this.imgUrl = 'SIM'
        this.imgOption = ''
        this.chartParam.lineType = ''
        this.imgUrlWidth = '35%'
        this.imgUrlHeight = '250px'
      } else if (this.chartParam.productionName.indexOf('5GI-2860') > -1) {
        this.imgUrl = 'GI5_2860_opacity'
        this.chartParam.lineType = ''
        this.imgUrlWidth = '200px'
        this.imgUrlHeight = '320px'
      } else if (
        this.chartParam.productionName.indexOf('5GI-2864') > -1 ||
        this.chartParam.productionName.indexOf('5GI-2865') > -1
      ) {
        this.imgUrl = 'GI5_28645_opacity'
        this.chartParam.lineType = ''
        this.imgUrlWidth = '200px'
        this.imgUrlHeight = '320px'
      } else if (this.chartParam.productionName.indexOf('5GI-2866') > -1) {
        this.imgUrl = 'GI5_2866_opacity'
        this.chartParam.lineType = ''
        this.imgUrlWidth = '200px'
        this.imgUrlHeight = '320px'
      } else if (this.chartParam.productionName.indexOf('6GI') > -1) {
        this.imgUrl = 'GI6_opacity'
        // this.imgOption = ''
        this.chartParam.lineType = ''
        this.imgUrlWidth = '237.5px'
        this.imgUrlHeight = '365px'
      } else if (this.chartParam.productionName.indexOf('SMA') > -1) {
        this.imgUrl = 'SMA'
        this.imgOption = ''
        this.chartParam.lineType = ''
        this.imgUrlWidth = '35%'
        this.imgUrlHeight = '250px'
      } else {
        this.imgUrl = ''
        this.imgOption = ''
        this.chartParam.lineType = ''
      }
      this.searchClick()
    },
    lineTypeChange() {
      this.imgOption = this.imgUrl + this.chartParam.lineType
      this.searchClick()
    },
    echarClear(chartId) {
      this.chart = echarts.init(document.getElementById(chartId))
      this.chart.clear()
    },
    searchClick() {
      if (this.chartParam.productionName === '') {
        alert('机种名不可同时为空')
        return
      }
      this.chartParam.productionName = this.chartParam.productionName.toUpperCase()
      if (this.dateTime.length === 2) {
        this.chartParam.startDate = this.dateTime[0]
        this.chartParam.endDate = this.dateTime[1] + ' 23:59:59'
      }
      var _this = this
      _this.echarClear('echAppLine')
      this.chartParam.lineType = this.chartParam.lineType.replace('全部', '')
      var params = {}
      // params.lineNo = this.chartParam.lineNo
      params.productionName = this.chartParam.productionName
      params.startDate = this.chartParam.startDate
      params.endDate = this.chartParam.endDate
      if (params.productionName.indexOf('5GI') < 0 && params.productionName.indexOf('6GI') < 0) {
        params.lineType = this.chartParam.lineType
      } else {
        params.lineType = ''
      }
      kongdongChart(params).then((res) => {
        if (res.data.code === 0 || res.data.code === '0') {
          if (res.data.data !== undefined && res.data.data !== null) {
            _this.initLineChart(res.data.data)
          } else {
            alert('无数据')
          }
        } else {
          alert(res.data.msg)
        }
      })
      if (this.chartParam.lotNo !== '' && this.chartParam.lineNo !== '5GI' && this.chartParam.lineNo !== '6GI') {
        this.chartParam.lotNo = this.chartParam.lotNo.toUpperCase()
        _this.echarClear('echApp')
        _this.echarClear('echAppRight')
        kongdongBar(this.chartParam).then((res) => {
          if (res.data.code === 0 || res.data.code === '0') {
            _this.initChart(res.data.kongdong.barData, res.data.kongdong.configData)
          } else {
            alert(res.data.msg)
          }
        })
      }
    },
    refreshClick() {
      this.chartParam.lotNo = ''
      this.chartParam.productionName = ''
      this.chartParam.lineType = ''
      this.dateTime = []
    },
    initLineChart(kongdongData) {
      this.chart = echarts.init(document.getElementById('echAppLine'))
      var option = {
        title: {
          text: '空洞率%',
          left: '10%',
          top: -2
        },
        // grid: {
        //   top: '25%'
        // },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          enterable: true, // 鼠标是 否可进入提示框浮层中
          formatter: this.formatterHover // 修改鼠标悬停显示的内容
        },
        grid: {
          top: '40%',
          left: '10%',
          right: '4%',
          bottom: '-1%',
          containLabel: true
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          },
          orient: 'horizontal',
          top: '23%',
          left: '80%'
        },
        legend: {
          data: kongdongData.legend,
          top: '13%',
          // left: '5%',
          textStyle: {
            fontSize: 15, // 设置legend字体大小 表格名称下一行
            color: '#000000'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: kongdongData.xAxis
        },
        yAxis: [

          {
            top: '20px',
            type: 'value',
            // name: '空洞率%',
            boundaryGap: [0, 0.02],
            min: 0,
            // max: 150,
            // interval: 5,
            axisLabel: {

              textStyle: {
                color: '#',
                fontSize: 20,
                fontWeight: 800
              }
            }
          }
        ],
        series: kongdongData.series
      }
      this.chart.setOption(option)
    },
    initChart(kongdongData, config) {
      var leftAxis = []
      var leftLends = []
      var leftSeries = []
      var rightAxis = []
      var rightLends = []
      var rightSeries = []
      var leftData = []
      var rightData = []
      // 构建数据柱状图需要的数据
      for (var i = 0; i < kongdongData.length; i++) {
        for (var j = 0; j < config.length; j++) {
          if (kongdongData[i].lineType.indexOf(config[j].lineType) > -1) {
            if (config[j].lmt <= 10) {
              leftData.push(kongdongData[i].voidRatio)
              leftAxis.push(kongdongData[i].lineType)
            } else {
              rightData.push(kongdongData[i].voidRatio)
              rightAxis.push(kongdongData[i].lineType)
            }
            break
          }
        }
      }

      // 构建上限的折线图
      for (var n = 0; n < config.length; n++) {
        config[n].name = 'limit_' + config[n].lineType
        config[n].type = 'line'
        config[n].color = 'red'

        var limitArr = []
        if (config[n].lmt <= 10) {
          for (var x = 0; x < leftData.length; x++) {
            limitArr.push(config[n].lmt)
          }
          leftLends.push('limit_' + config[n].lineType)
          config[n].data = limitArr
          config[n].markLine = { data: [{ type: 'max', name: '最大数据' }] }
          leftSeries.push(config[n])
        } else {
          for (var y = 0; y < rightData.length; y++) {
            limitArr.push(config[n].lmt)
          }
          config[n].data = limitArr
          config[n].markLine = { data: [{ type: 'max', name: '最大数据' }] }
          rightLends.push('limit_' + config[n].lineType)
          rightSeries.push(config[n])
        }
      }

      var leftBar = {}
      leftBar.type = 'bar'
      leftBar.data = leftData
      leftBar.barWidth = '20px'
      leftSeries.push(leftBar)

      var rightBar = {}
      rightBar.type = 'bar'
      rightBar.data = rightData
      rightBar.barWidth = '20px'
      rightSeries.push(rightBar)

      this.chartLeft = echarts.init(document.getElementById('echApp'))
      var optionLeft = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          enterable: true, // 鼠标是否可进入提示框浮层中
          formatter: this.formatterBarHover // 修改鼠标悬停显示的内容
        },
        legend: {
          data: leftLends
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: leftAxis
        },
        yAxis: {
          scale: true,
          type: 'value',
          splitNumber: 4,
          boundaryGap: [0, 0.2],
          min: 0,
          axisLabel: {
            formatter: '{value} %'
          }
        },
        series: leftSeries
      }
      this.chartLeft.setOption(optionLeft)

      this.chartRight = echarts.init(document.getElementById('echAppRight'))
      var optionRight = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          enterable: true, // 鼠标是否可进入提示框浮层中
          formatter: this.formatterBarHover // 修改鼠标悬停显示的内容
        },
        legend: {
          data: rightLends
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: rightAxis
        },
        yAxis: {
          scale: true,
          type: 'value',
          splitNumber: 4,
          boundaryGap: [0, 0.2],
          min: 0,
          axisLabel: {
            formatter: '{value} %'
          }
        },
        series: rightSeries
      }
      this.chartRight.setOption(optionRight)
    },
    formatterHover(param) {
      return (
        '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;">批号：' +
        param.name +
        '</span><br>' +
        '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;">value：' +
        param.data +
        '%</span><br>'
      )
    },
    formatterBarHover(param) {
      return (
        '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;">file：' +
        param.name +
        '</span><br>' +
        '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;">value：' +
        param.data +
        '%</span><br>'
      )
    }
  }
}
</script>

<style scoped>
.condition {
  box-sizing: border-box;
  display: inline-block;
  font-family: sans-serif;
  margin: 0;
}
.el-input__inner {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: 25px;
  height: 35px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  overflow: hidden;
}
.el-col-9 div {
  height: 39px !important;
}
#chartPanelLeft {
  float: left;
  width: 40%;
  height: 100%;
  margin-left: 0px;
}
#chartPanelRight {
  float: left;
  width: 40%;
  height: 100%;
}
#brD {
  width: 100%;
  height: 350px;
  float: left;
}
.picPanel {
  border: 1px solid #b7b2b2;
  position: relative;
}
#subEchart {
  top: -300px;
}
.echartPanel {
  width: 100%;
  height: 300px;
  float: left;
}
.wid90 {
  width: 120px;
}
.wider {
  width: 316px;
}
</style>
