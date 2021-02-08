<template>
	<div class="app-container calendar-list-container">
		<div class="condition-panel">
			<el-form class="form" label-width="90px" size="small">
				<el-col :span="10">
					<el-form-item label="机种名:">
						<div class="condition">
							<el-select v-model="chartParam.lineNo" @change="lineNoChange">
								<el-option
									v-for="item in lineNoOptions"
									:key="item.lineNo"
									:label="item.lineNo"
									:value="item.lineNo" />
							</el-select>
						</div>
						<div class="condition">
							<el-select v-model="chartParam.productionName" @change="productionNameChange">
								<el-option v-for="item in proNameOptions" :key="item" :label="item" :value="item" />
							</el-select>
						</div>
						<div class="condition">
							<el-select v-model="chartParam.lineType" @change="lineTypeChange">
								<el-option v-for="item in positionOptions" :key="item" :label="item" :value="item" />
							</el-select>
						</div>
					</el-form-item>
				</el-col>
				<el-col :span="9">
					<el-form-item label="日期:">
            <el-date-picker v-model="dateTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" class="dateTimeClass"/>
					</el-form-item>
				</el-col>
			</el-form>
			<button type="button" class="el-button el-button--primary el-button--medium filter-item" style="margin-left: 10px;" @click="searchClick">
				<i class="el-icon-search"/>
				<span>搜索</span>
			</button>
			<button type="button" class="el-button el-button--primary el-button--medium filter-item" style="margin-left: 10px;" @click="refreshClick">
				<i class="el-icon-refresh"/>
				<span>清空</span>
			</button>
		</div>
		<div :style="{width: '35%', height: '250px',marginLeft:'63%', marginTop:'30px'}" class="picPanel">
			<chipImg :img-url="imgUrl" :img-option="imgOption" :click-able="clickAble" @positionName="positionChange"/>
		</div>
		<div id="echAppLine" :style="{width: '68%', height: '300px',position:'relative',marginTop:'-250px', marginLeft:'-5%'}"/>
		<el-form id="subEchart" class="form" label-width="90px" size="small">
			<el-col :span="6">
				<el-form-item label="批号:">
					<div class="condition">
						<input v-model="chartParam.lotNo" type="text" placeholder="批号" class="el-input__inner">
					</div>
				</el-form-item>
			</el-col>
		</el-form>
		<div id="brD">
			<div id="chartPanelLeft">
				<div id="echApp" :style="{width: '90%', height: '350px'}"/>
			</div>
			<div id="chartPanelRight">
				<div id="echAppRight" :style="{width: '90%', height: '350px'}"/>
			</div>
		</div>
	</div>
</template>

<script>
import echarts from 'echarts'
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
      productionNo: '',
      imgUrl: '',
      imgOption: '',
      clickAble: true,
      positionOptions: [],
      proNameOptions: [],
      lineNoOptions: [{ 'lineNo': 'SMA' }, { 'lineNo': 'SX' }, { 'lineNo': 'SIM' }, { 'lineNo': '5GI' }, { 'lineNo': '6GI' }]
      // list:[{name:"T100",left:"40%",top:"30%",width:"50px",height:"60px",rotate:180,"checked":true,backgroundColor:"red",position:"relative"}],
      // picUrl:"11"
    }
  },
  mounted() {
    var now = new Date()
    var endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10)
    var startDate = endDate.slice(0, 8) + '01'
    this.dateTime = [startDate, endDate]
  },
  methods: {
    lineNoChange() {
      if (this.chartParam.lineNo !== '') {
        var _this = this
        var paramObj = {}
        paramObj.productionNo = this.chartParam.lineNo
        proNameSelect(paramObj).then(res => {
          if (res.data.code === 0 || res.data.code === '0') {
            _this.proNameOptions = res.data.allProName
          } else {
            alert(res.data.msg)
          }
        })
      }
    },
    positionChange(pname) {
      if (this.positionOptions.length > 0) {
        this.chartParam.lineType = pname
        this.imgOption = this.imgUrl + pname
      }
    },
    productionNameChange() {
      var param = {}
      param.productionName = this.chartParam.productionName.replace('J.', '')
      positionSelect(param).then(res => {
        this.positionOptions = res.data.positionList
        this.positionOptions.splice(0, 0, '全部')
      })
      if (this.chartParam.productionName.indexOf('SX681') > -1) {
        this.imgUrl = 'SX681'
        this.imgOption = ''
        this.chartParam.lineType = ''
      } else if (this.chartParam.productionName.indexOf('SX680') > -1) {
        this.imgUrl = 'SX680'
        this.imgOption = ''
        this.chartParam.lineType = ''
      }
    },
    lineTypeChange() {
      this.imgOption = this.imgUrl + this.chartParam.lineType
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
      kongdongChart(this.chartParam).then(res => {
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
        kongdongBar(this.chartParam).then(res => {
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
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          enterable: true, // 鼠标是否可进入提示框浮层中
          formatter: this.formatterHover// 修改鼠标悬停显示的内容
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: kongdongData.legend
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: kongdongData.xAxis
        },
        yAxis: [{
          type: 'value',
          axisLabel: {
            formatter: '{value} %'
          }
        }, {
          type: 'value',
          name: '空洞率',
          min: 0,
          // max: 150,
          // interval: 5,
          axisLabel: {
            formatter: '{value} %'
          }
        }],
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
          formatter: this.formatterBarHover// 修改鼠标悬停显示的内容
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
          type: 'value',
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
          formatter: this.formatterBarHover// 修改鼠标悬停显示的内容
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
          type: 'value',
          axisLabel: {
            formatter: '{value} %'
          }
        },
        series: rightSeries
      }
      this.chartRight.setOption(optionRight)
    },
    formatterHover(param) {
      return '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;">批号：' + param.name + '</span><br>' +
							'<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;">value：' + param.data + '%</span><br>'
    },
    formatterBarHover(param) {
      return '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;">file：' + param.name + '</span><br>' +
							'<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;">value：' + param.data + '%</span><br>'
    }
  }
}
</script>

<style scoped>
	.condition{
		width:200px;height:35px;
		border-radius: 4px;
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
		font-size: inherit;
		height: 35px;
		line-height: 40px;
		outline: 0;
		padding: 0 15px;
		-webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
		transition: border-color .2s cubic-bezier(.645,.045,.355,1);
		width: 100%;
		overflow: hidden;
	}
	.el-col-9 div{
		height:39px !important;
	}
	#chartPanelLeft{
		float:left;
		width:40%;
		height:100%;
		margin-left:0px;
	}
	#chartPanelRight{
		float:left;
		width:40%;
		height:100%;
	}
	#brD{width:100%;height:350px;float:left;}
	.picPanel{border:1px solid #b7b2b2;position:relative;}
	#subEchart{top:-300px;}
</style>
