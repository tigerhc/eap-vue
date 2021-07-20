<template>
  <div class="app-container calendar-list-container">
    <div class="condition-panel">
      <el-form :inline="true" class="form">
        <el-row>
          <el-form-item>
            <div class="condition">
              <input v-model="chartParam.lotNo" type="text" placeholder="批号" class="el-input__inner" >
            </div>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="productionNo"
              style="width: 100px"
              class="wid90"
              placeholder="机种名"
              @change="productionNoChange"
            >
              <el-option v-for="item in lineNoOptions" :key="item.lineNo" :label="item.lineNo" :value="item.lineNo" />
            </el-select>
            <el-select v-model="chartParam.productionNo" class="wid90" @change="updateEqp">
              <el-option v-for="item in productionNoOptions" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select
              v-show="productionNo === '5GI' || productionNo === '6GI'"
              v-model="chartParam.detailOption"
              class="wid90"
              @change="weightPosition"
            >
              <el-option
                v-for="item in detailOptions"
                :key="item.dtlName"
                :label="item.dtlName"
                :value="item.dtlValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="dateTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="wider"
            />
          </el-form-item>
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
        </el-row>
      </el-form>
    </div>
    <div class="echAppPanel">
      <div id="echApp" :style="{ width: '60%', height: '100%', position: 'relative', float: 'left' }" />
      <div :style="{ width: imgUrlWidth, height: imgUrlHeight, marginLeft: '5%', marginTop: '50px' }" class="picPanel">
        <chipImg :img-url="imgUrl" :img-option="imgOption" :click-able="clickAble" @positionName="positionChange" />
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { weightChart, productionNoSelect } from '@/api/ms/monitor'
import request from '@/utils/request'
import chipImg from '@/views/tool/chipimg/chipimg'
import api from '../../oven/ports/fetch'

export default {
  name: 'MeasureweightEchart',
  components: {
    chipImg
  },
  data() {
    return {
      chart: null,
      remarkArr: [],
      dateTime: [],
      chartParam: {
        productionNo: '',
        detailOption: '',
        startTime: '',
        endTime: '',
        lotNo: ''
      },
      api: api('/ms/msmeasurerecord/weightChartExport'),
      toolbarStatus: {
        exportsLoading: false
      },
      imgUrl: '',
      imgOption: '',
      clickAble: true,
      productionNoOptions: [],
      productionNo: '',
      lineNoOptions: [{ lineNo: 'SMA' }, { lineNo: 'SX' }, { lineNo: 'SIM' }, { lineNo: '5GI' }, { lineNo: '6GI' }],
      detailOptions: [
        { dtlName: 'DB', dtlValue: 1 },
        { dtlName: 'DM', dtlValue: 2 },
        { dtlName: '二级管', dtlValue: 3 },
        { dtlName: '电熔', dtlValue: 4 }
      ],
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
  created() {
    //    var _this = this
    //    request({
    //      url: 'ms/msmeasurerecord/getLineNoOptions',
    //      method: 'get'
    //    }).then((response) => {
    //      _this.lineNoOptions = response.data.lineNoOptions
    //    })
  },
  methods: {
    finddetail() {
      this.chartParam.productionNo = this.chartParam.productionNo.toUpperCase()
      if (this.dateTime.length === 2) {
        this.chartParam.startTime = this.dateTime[0]
        this.chartParam.endTime = this.dateTime[1]
      }
      // eslint-disable-next-line no-undef
      if (this.toolbarStatus.exportsLoading) {
        return
      }
      this.toolbarStatus.exportsLoading = true
      // const q = (this.query)
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
    weightPosition() {
      if (this.imgUrl.indexOf('GI5') > -1 || this.imgUrl.indexOf('GI6') > -1) {
        if (this.chartParam.detailOption === 1) {
          this.imgOption = this.imgUrl + 'IGBT'
        } else if (this.chartParam.detailOption === 2) {
          this.imgOption = this.imgUrl + 'MIC'
        } else if (this.chartParam.detailOption === 3) {
          this.imgOption = 'GI6DIOD'
        } else if (this.chartParam.detailOption === 4) {
          this.imgOption = 'GI6C'
        }
        if (this.imgUrl.indexOf('GI6') > -1 && this.chartParam.detailOption === 1) {
          this.imgOption = 'opacityIGBT'
        }
        this.searchClick()
      }
    },
    positionChange(pname) {
      if (this.imgUrl.indexOf('GI5') > -1 || this.imgUrl.indexOf('GI6') > -1) {
        if (pname === 'MIC') {
          this.chartParam.detailOption = 2
          this.imgOption = this.imgUrl + 'MIC'
        } else if (pname === 'IGBT') {
          this.chartParam.detailOption = 1
          this.imgOption = this.imgUrl + 'IGBT'
        } else if (pname === 'DIOD') {
          this.chartParam.detailOption = 3
          this.imgOption = 'GI6DIOD'
        } else if (pname === 'C') {
          this.chartParam.detailOption = 4
          this.imgOption = 'GI6C'
        }
        if (this.imgUrl.indexOf('GI6') > -1 && pname === 'IGBT') {
          this.chartParam.detailOption = 1
          this.imgOption = 'opacityIGBT'
        }
        this.searchClick()
      }
    },
    productionNoChange() {
      // 当下拉框中的值变化时，清除关联的下拉框原来的值
      this.chartParam.productionNo = ''
      this.chartParam.detailOption = ''

      if (this.productionNo !== '') {
        var _this = this
        var param = {}
        param.lineNo = this.productionNo
        productionNoSelect(param).then((res) => {
          if (res.data.code === 0 || res.data.code === '0') {
            _this.productionNoOptions = res.data.productionNoList
          } else {
            alert(res.data.msg)
          }
        })
      }
    },
    searchClick() {
      if (this.dateTime.length === 1) {
        alert('日期不完整')
        return
      }
      if (this.chartParam.productionNo === '') {
        alert('请选择机种')
        return
      }
      if (this.productionNo === '5GI' || this.productionNo === '6GI') {
        if (this.chartParam.detailOption === '' || this.chartParam.detailOption === null) {
          alert('请选择具体项')
          return
        }
      }
      this.chartParam.productionNo = this.chartParam.productionNo.toUpperCase()
      if (this.dateTime.length === 2) {
        this.chartParam.startTime = this.dateTime[0]
        this.chartParam.endTime = this.dateTime[1]
      }
      var _this = this
      weightChart(this.chartParam).then((res) => {
        _this.echarClear('echApp')
        if (res.data.code === 0 || res.data.code === '0') {
          if (res.data.weightList !== undefined && res.data.weightList !== null && res.data.weightList.length !== 0) {
            _this.initChart(res.data.weightList)
          } else {
            alert('无数据')
          }
        } else {
          alert(res.data.msg)
        }
      })
    },
    refreshClick() {
      this.productionNo = ''
      this.chartParam.detailOption = ''
      this.chartParam.productionNo = ''
      this.chartParam.lotNo = ''
      //      this.dateTime = []
    },
    echarClear(chartId) {
      this.chart = echarts.init(document.getElementById(chartId))
      this.chart.clear()
    },
    renderItem(params, api) {
      var xValue = api.value(0)
      var highPoint = api.coord([xValue, api.value(1)])
      var lowPoint = api.coord([xValue, api.value(2)])
      var halfWidth = api.size([1, 0])[0] * 0.1
      var style = api.style({
        stroke: api.visual('color'),
        fill: null
      })

      return {
        type: 'group',
        children: [
          {
            type: 'line',
            shape: {
              x1: highPoint[0] - halfWidth,
              y1: highPoint[1],
              x2: highPoint[0] + halfWidth,
              y2: highPoint[1]
            },
            style: style
          },
          {
            type: 'line',
            shape: {
              x1: highPoint[0],
              y1: highPoint[1],
              x2: lowPoint[0],
              y2: lowPoint[1]
            },
            style: style
          },
          {
            type: 'line',
            shape: {
              x1: lowPoint[0] - halfWidth,
              y1: lowPoint[1],
              x2: lowPoint[0] + halfWidth,
              y2: lowPoint[1]
            },
            style: style
          }
        ]
      }
    },
    initChart(weightData) {
      var categoryData = []
      var errorData = []
      var barData = []
      var minArr = []
      var maxArr = []
      var min11 = []
      var max90 = []
      var yMax = 0
      var yMin = -1
      if (weightData.length > 0) {
        for (var i = 0; i < weightData.length; i++) {
          categoryData.push(weightData[i].lotNo)
          errorData.push([i, weightData[i].minWeight, weightData[i].maxWeight])
          minArr.push(weightData[i].limitMin)
          maxArr.push(weightData[i].limitMax)
          barData.push(weightData[i].avgWeight)
          min11.push(weightData[i].limit11)
          max90.push(weightData[i].limit90)
          if (weightData[i].limitMax > yMax) {
            yMax = weightData[i].limitMax + weightData[i].limitMax * 0.05
          }
          if (weightData[i].avgWeight > yMax) {
            yMax = weightData[i].avgWeight + weightData[i].avgWeight * 0.05
          }
          if (yMin === -1) {
            yMin = weightData[i].limitMin - weightData[i].limitMin * 0.05
          }
          if (weightData[i].limitMin < yMin) {
            yMin = weightData[i].limitMin - weightData[i].limitMin * 0.05
          }
          if (weightData[i].avgWeight < yMin) {
            yMin = weightData[i].avgWeight - weightData[i].avgWeight * 0.05
          }

          var remarkObj = {}
          remarkObj.limitMin = weightData[i].limitMin
          remarkObj.limitMax = weightData[i].limitMax
          remarkObj.fact = weightData[i].weight
          remarkObj.lotNo = weightData[i].lotNo
          remarkObj.minWeight = weightData[i].minWeight
          remarkObj.maxWeight = weightData[i].maxWeight
          remarkObj.avgWeight = weightData[i].avgWeight
          this.remarkArr.push(remarkObj)
        }

        this.chart = echarts.init(document.getElementById('echApp'))
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {},
            enterable: true, // 鼠标是否可进入提示框浮层中
            formatter: this.formatterHover // 修改鼠标悬停显示的内容
          },
          toolbox: {
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ['line', 'bar'] },
              restore: { show: true },
              saveAsImage: { show: true }
            },
            orient: 'horizontal',
            top: '5%',
            left: '80%'
          },
          legend: {
            data: ['平均重量', '测量值', '设定管理下限', '设定管理上限', '工程管理上限', '工程管理下限']
          },
          xAxis: {
            data: categoryData,
            boundaryGap: false,
            name: '批号'
          },
          yAxis: {
            scale: true,
            splitNumber: 7,
            boundaryGap: [0.02, 0.02],
            axisLabel: {
              formatter: '{value} mg'
            },
            type: 'value',
            // min: yMin,
            // max: yMax,
            name: '重量'
          },
          series: [
            {
              symbolSize: 10,
              type: 'line',
              name: '平均重量',
              data: barData,
              itemStyle: {
                color: 'blue'
              }
            },
            {
              type: 'custom',
              name: '测量值',
              itemStyle: {
                normal: {
                  borderWidth: 1.5
                }
              },
              renderItem: this.renderItem,
              data: errorData,
              z: 100
            },
            {
              type: 'line',
              name: '设定管理下限',
              data: minArr,
              itemStyle: {
                color: 'red'
              },
              markLine: {
                data: [{ type: 'max', name: '最大数据' }]
              }
            },
            {
              type: 'line',
              name: '设定管理上限',
              data: maxArr,
              itemStyle: {
                color: 'red'
              },
              markLine: {
                data: [{ type: 'max', name: '最大数据' }]
              }
            },
            {
              symbolSize: 10,
              type: 'line',
              name: '工程管理下限',
              data: min11,
              itemStyle: {
                color: '#06b8af'
              },
              markLine: {
                data: [{ type: 'max', name: '最大数据' }]
              }
            },
            {
              symbolSize: 10,
              type: 'line',
              name: '工程管理上限',
              data: max90,
              itemStyle: {
                color: '#06b8af'
              },
              markLine: {
                data: [{ type: 'max', name: '最大数据' }]
              }
            }
          ]
        }
        this.chart.setOption(option)
      }
    },
    formatterHover(param) {
      var fact = ''
      var limitMin = ''
      var limitMax = ''
      var lotNo = ''
      var minWeight = ''
      var maxWeight = ''
      for (var i = 0; i < this.remarkArr.length; i++) {
        if (this.remarkArr[i].lotNo === param[0].axisValue) {
          fact = this.remarkArr[i].avgWeight
          lotNo = this.remarkArr[i].lotNo
          limitMin = this.remarkArr[i].limitMin
          limitMax = this.remarkArr[i].limitMax
          minWeight = this.remarkArr[i].minWeight
          maxWeight = this.remarkArr[i].maxWeight
        }
      }

      return (
        '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;">最大重量：' +
        maxWeight +
        ' mg</span><br>' +
        '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;">平均重量：' +
        fact +
        ' mg</span><br>' +
        '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;">最小重量：' +
        minWeight +
        ' mg</span><br>' +
        '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;">设定管理上限：' +
        limitMax +
        ' mg</span><br>' +
        '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;">设定管理下限：' +
        limitMin +
        ' mg</span><br>' +
        '<span style="padding-left:5px;height:30px;line-height:30px;display: inline-block;">批号：' +
        lotNo +
        '</span>'
      )
    },
    updateEqp() {
      var _this = this
      if (_this.chartParam.productionNo.indexOf('5GI-2860') > -1) {
        _this.imgUrl = 'GI5_2860'
        _this.imgUrlWidth = '200px' // 400
        _this.imgUrlHeight = '320px' // 640
      } else if (
        _this.chartParam.productionNo.indexOf('5GI-2864') > -1 ||
        _this.chartParam.productionNo.indexOf('5GI-2865') > -1
      ) {
        _this.imgUrl = 'GI5_28645'
        _this.imgUrlWidth = '200px' // 400
        _this.imgUrlHeight = '320px' // 640
      } else if (_this.chartParam.productionNo.indexOf('5GI-2866') > -1) {
        _this.imgUrl = 'GI5_2866'
        _this.imgUrlWidth = '200px' // 400
        _this.imgUrlHeight = '320px' // 640
      } else if (_this.chartParam.productionNo.indexOf('6GI') > -1) {
        _this.imgUrl = 'GI6'
        _this.imgUrlWidth = '237.5px' // 475
        _this.imgUrlHeight = '365px' // 730
      } else if (_this.chartParam.productionNo.indexOf('SX680') > -1) {
        _this.imgUrl = 'SX680'
        _this.imgUrlWidth = '35%'
        _this.imgUrlHeight = '250px'
      } else if (_this.chartParam.productionNo.indexOf('SX681') > -1) {
        _this.imgUrl = 'SX681'
        _this.imgUrlWidth = '35%'
        _this.imgUrlHeight = '250px'
      } else if (_this.chartParam.productionNo.indexOf('SIM') > -1) {
        _this.imgUrl = 'SIM'
        _this.imgUrlWidth = '35%'
        _this.imgUrlHeight = '250px'
      } else if (_this.chartParam.productionNo.indexOf('SMA') > -1) {
        _this.imgUrl = 'SMA'
        _this.imgUrlWidth = '35%'
        _this.imgUrlHeight = '250px'
      }

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

<style scoped lang='scss'>
.condition {
  width: 90px;
  height: 35px;
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
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}
.el-col-6 div {
  padding-bottom: 20px;
}
.el-date-editor .el-range-input,
.el-date-editor .el-range-separator {
  height: 20% !important;
}
#echApp {
  margin-top: 50px;
}
.wid90 {
  width: 250px;
}
.echAppPanel {
  width: 100%;
  height: 400px;
  float: left;
}
.picPanel {
  position: relative;
  float: left;
  border: 1px solid #b7b2b2;
}
.wider {
  width: 260px;
}
</style>
