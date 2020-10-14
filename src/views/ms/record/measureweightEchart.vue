<template>
	<div class="app-container calendar-list-container">
		<div class="condition-panel">
			<el-form class="form" label-width="90px" size="small">
				<el-col :span="4">
					<el-form-item label="站点" prop="lineNo">
            <el-select v-model="lineNo" @change="updateEqp">
              <el-option
                v-for="item in lineNoOptions"
                :key="item.lineNo"
                :label="item.lineNo"
                :value="item.lineNo" />
            </el-select>
          </el-form-item>
					<!--<div class="condition">
						<input v-model="chartParam.eqpId" type="text" placeholder="设备号" class="el-input__inner">
					</div>-->
				</el-col>
				<el-col :span="6">
					<el-form-item label="设备号" prop="eqpId">
						<el-select v-model="chartParam.eqpId">
							<el-option
								v-for="item in eqpIdOptions"
								:key="item.eqpId"
								:label="item.eqpName"
								:value="item.eqpId" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<div class="condition">
            <input v-model="chartParam.lotNo" type="text" placeholder="批号" class="el-input__inner">
          </div>
        </el-col>
				<el-col :span="6">
            <el-date-picker v-model="dateTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" class="dateTimeClass"/>
				</el-col>
			</el-form>

			<button type="button" class="el-button el-button--primary el-button--medium filter-item" style="margin-left: 10px;" @click="searchClick">
				<i class="el-icon-search"/>
				<span>搜索</span>
			</button>
		</div>
		<div id="echApp" :style="{width: '80%', height: '300px',float:'left'}"/>
	</div>
</template>

<script>
import echarts from 'echarts'
import { weightChart } from '@/api/ms/monitor'
import request from '@/utils/request'

export default {
  name: 'MeasureweightEchart',
  data() {
    return {
      chart: null,
      remarkArr: [],
      dateTime: [],
      chartParam: {
        lotNo: '',
        eqpId: '',
        startTime: '',
        endTime: ''
      },
      lineNo: '',
      lineNoOptions: [],
      eqpIdOptions: []
    }
  },
  created() {
    var _this = this
    request({
      url: 'ms/msmeasurerecord/getLineNoOptions',
      method: 'get'
    }).then((response) => {
      _this.lineNoOptions = response.data.lineNoOptions
    })
  },
  methods: {
    searchClick() {
      if (this.chartParam.lotNo === '' && this.chartParam.eqpId === '') {
        alert('设备和批号不可同时为空')
        return
      }
      if (this.dateTime.length === 1) {
        alert('日期不完整')
        return
      }
      if (this.dateTime.length === 2) {
        this.chartParam.startTime = this.dateTime[0]
        this.chartParam.endTime = this.dateTime[1]
      }
      var _this = this
      weightChart(this.chartParam).then(res => {
        if (res.data.code === 0 || res.data.code === '0') {
          _this.initChart(res.data.weightList)
        } else {
          alert(res.data.msg)
        }
      })
    },
    initChart(weightData) {
      var xAxisArr = []
      var yAxisArr = []
      var minArr = []
      var maxArr = []
      if (weightData.length > 0) {
        for (var i = 0; i < weightData.length; i++) {
          xAxisArr.push(weightData[i].createDate)
          yAxisArr.push(weightData[i].weight)
          minArr.push(weightData[i].limitMin)
          maxArr.push(weightData[i].limitMax)
          var remarkObj = {}
          remarkObj.keyName = weightData[i].createDate
          remarkObj.eqpId = weightData[i].eqpId
          remarkObj.limitMin = weightData[i].limitMin
          remarkObj.limitMax = weightData[i].limitMax
          remarkObj.fact = weightData[i].weight
          this.remarkArr.push(remarkObj)
        }
      }

      this.chart = echarts.init(document.getElementById('echApp'))
      var option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          enterable: true, // 鼠标是否可进入提示框浮层中
          formatter: this.formatterHover// 修改鼠标悬停显示的内容
        },
        legend: {
          data: ['实际重量', '最低标准', '最高标准']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxisArr
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} g'
          }
        },
        series: [
          {
            type: 'line',
            name: '实际重量',
            data: yAxisArr,
            stack: '实际重量',
            itemStyle: {
              normal: {
                color: '#00FF00',
                lineStyle: {
                  color: '#00FF00'
                }
              }
            }
          },
          {
            type: 'line',
            name: '最低标准',
            data: minArr,
            itemStyle: {}
          },
          {
            type: 'line',
            name: '最高标准',
            data: maxArr,
            itemStyle: {}
          }
        ]
      }
      this.chart.setOption(option)
    },
    formatterHover(param) {
      var eqpId = ''
      var fact = ''
      var limitMin = ''
      var limitMax = ''
      for (var i = 0; i < this.remarkArr.length; i++) {
        if (this.remarkArr[i].keyName === param.name) {
          eqpId = this.remarkArr[i].eqpId
          fact = this.remarkArr[i].fact
          limitMin = this.remarkArr[i].limitMin
          limitMax = this.remarkArr[i].limitMax
        }
      }

      return '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;">时间：' + param.name + '</span><br>' +
							'<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;">实际值：' + fact + ' g</span><br>' +
							'<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;">最低标准：' + limitMin + ' g</span><br>' +
							'<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;">最高标准：' + limitMax + ' g</span><br>' +
							'<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;">eqpId：' + eqpId + '</span>'
    },
    updateEqp() {
      var _this = this
      request({
        url: 'ms/msmeasurerecord/getEqpIdOptions?lineNo=' + this.lineNo,
        method: 'get'
      }).then((response) => {
        _this.eqpIdOptions = response.data.eqpIdOptions
      })
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
	.el-col-6 div{
		padding-bottom: 20px;
	}
	.el-date-editor .el-range-input, .el-date-editor .el-range-separator{
		height:20% !important;
	}
</style>
