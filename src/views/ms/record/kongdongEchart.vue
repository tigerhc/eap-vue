<template>
	<div class="app-container calendar-list-container">
		<div class="condition-panel">
			<el-form class="form" label-width="90px" size="small">

				<el-col :span="6">
					<el-form-item label="机种名:">
						<div class="condition">
							<el-select v-model="chartParam.productionNo">
								<el-option
									v-for="item in lineNoOptions"
									:key="item.lineNo"
									:label="item.lineNo"
									:value="item.lineNo" />
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
		<div id="echAppLine" :style="{width: '80%', height: '300px',float:'left'}"/>
		<el-form class="form" label-width="90px" size="small">
			<el-col :span="6">
				<el-form-item label="批号:">
					<div class="condition">
						<input v-model="chartParam.lotNo" type="text" placeholder="批号" class="el-input__inner">
					</div>
				</el-form-item>
			</el-col>
		</el-form>
		<div id="echApp" :style="{width: '80%', height: '200px',float:'left'}"/>
	</div>
</template>

<script>
import echarts from 'echarts'
import { kongdongChart, kongdongBar } from '@/api/ms/monitor'
export default {
  name: 'MeasureKongdongEchart',
  data() {
    return {
      chart: null,
      remarkArr: [],
      dateTime: [],
      chartParam: {
        lotNo: '',
        productionNo: '',
        startDate: '',
        endDate: ''
      },
      lineNoOptions: [{ 'lineNo': 'SMA' }, { 'lineNo': 'SX' }, { 'lineNo': 'SIM' }, { 'lineNo': '5GI' }, { 'lineNo': '6GI' }]
    }
  },
  methods: {
    searchClick() {
      if (this.chartParam.productionNo === '') {
        alert('机种名不可同时为空')
        return
      }
      this.chartParam.productionNo = this.chartParam.productionNo.toUpperCase()
      if (this.dateTime.length === 2) {
        this.chartParam.startDate = this.dateTime[0]
        this.chartParam.endDate = this.dateTime[1]
      }
      var _this = this
      kongdongChart(this.chartParam).then(res => {
        if (res.data.code === 0 || res.data.code === '0') {
          _this.initLineChart(res.data.kongdong)
        } else {
          alert(res.data.msg)
        }
      })
      if (this.chartParam.lotNo !== '') {
        this.chartParam.lotNo = this.chartParam.lotNo.toUpperCase()
        kongdongBar(this.chartParam).then(res => {
          if (res.data.code === 0 || res.data.code === '0') {
            _this.initChart(res.data.kongdong)
          } else {
            alert(res.data.msg)
          }
        })
      }
    },
    refreshClick() {
      this.chartParam.lotNo = ''
      this.chartParam.productionNo = ''
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
        legend: {
          data: kongdongData.legend
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: kongdongData.xAxis
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} %'
          }
        },
        series: kongdongData.series
      }
      this.chart.setOption(option)
    },
    initChart(kongdongData) {
      var xAxisArr = []
      var yAxisArr = []
      if (kongdongData.length > 0) {
        for (var i = 0; i < kongdongData.length; i++) {
          xAxisArr.push(kongdongData[i].xAxis)
          yAxisArr.push(kongdongData[i].kongdongVal)
          var remarkObj = {}
          remarkObj.keyName = kongdongData[i].xAxis
          remarkObj.createTime = kongdongData[i].createTime
          this.remarkArr.push(remarkObj)
        }
      }

      this.chart = echarts.init(document.getElementById('echApp'))
      var option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          enterable: true, // 鼠标是否可进入提示框浮层中
          formatter: this.formatterBarHover// 修改鼠标悬停显示的内容
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: xAxisArr
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} %'
          }
        },
        series: [
          {
            barWidth: 20 + 'px',
            type: 'bar',
            data: yAxisArr,
            itemStyle: {

            }
          }
        ]
      }
      this.chart.setOption(option)
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
	}
	.el-col-9 div{
		height:39px !important;
	}
</style>
