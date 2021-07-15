<template>
  <div id="tempchar" class="tempchar">
    <el-form ref="form" :model="form" :inline="true" :rules="formRules" class="form" label-width="90px" size="small">
      <el-row>
        <el-form-item label="设备号:" prop="eqpId">
          <div class="condition">
            <el-select v-model="form.eqpId" clearable @change="changeImg">
              <el-option v-for="item in tempEqpId" :key="item.eqpId" :label="item.eqpName" :value="item.eqpId" />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="日期:" prop="dateTime">
          <el-date-picker
            v-model="form.dateTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="searchLine"> {{ searchBtn }} </el-button>
        <el-button type="primary" @click="tempExport">导出</el-button>
      </el-row>
    </el-form>
    <el-tabs v-model="editableTabsValue" type="card" @tab-click="loadTempDataPart">
      <el-tab-pane v-for="item in editableTabs" :key="item.title" :label="item.title" :name="item.title" />
    </el-tabs>
    <div v-show="tempEchart === 'eqpTemp'" class="eqpTemp">
      <div id="tempChart" style="width: 100%; height: 500px; overflow: hidden" />
    </div>
    <div v-show="tempEchart === 'unEqpTemp'" class="unEqpTemp">
      <div id="tempChart2" style="width: 60%; height: 500px; overflow: hidden" />
      <div
        :style="{
          width: '30%',
          height: '300px',
          marginTop: '-500px',
          float: 'left',
          marginLeft: '65%',
          position: 'absolute'
        }"
        class="picPanel"
      >
        <tempImg :img-url="picUrl" :img-option="imgPosition" :click-able="true" @positionName="positionChange" />
      </div>
      <div
        :style="{
          width: '30%',
          height: '300px',
          marginTop: '-200px',
          float: 'left',
          marginLeft: '65%',
          position: 'absolute'
        }"
        class="picPanel"
      >
        <tempImg :img-url="picUrlDetail" :img-option="imgPosition" :click-able="true" @positionName="positionChange" />
      </div>
    </div>
  </div>
</template>
<script>
import { tempbytime } from '@/api/public'
import * as echarts from 'echarts'
import { eqpList } from '@/api/oven/temperature'
import tempImg from '@/views/tool/temperature/tempImg'
import api from '../ports/fetch'

export default {
  name: 'Tempchar',
  components: { tempImg },
  data() {
    return {
      tempEqpId: [],
      form: {
        eqpId: undefined,
        dateTime: []
      },
      formRules: {
        eqpId: [{ required: true, message: '请选择设备！', trigger: 'change' }],
        dateTime: [{ required: true, message: '请选择时间！', trigger: 'change' }]
      },
      editableTabsValue: 0,
      editableTabs: [],
      tempsTitles: [],
      tempsValue: [],
      extraTitle: ['运行温度', '设定温度', '低温报警', '高温报警'],
      list: [],
      chart: undefined,
      charLegend: ['运行温度', '设定温度', '低温报警', '高温报警'],
      picUrl: undefined,
      picUrlDetail: undefined,
      picUrlB: require('../../../assets/img/HTRT_G1.png'),
      tempEchart: 'eqpTemp',
      imgPosition: 0,
      limitMax: {
        'APJ-IGBT-REFLOW1': [80, 80, 90, 90, 102, 102, 116, 116, 116, 116],
        'APJ-FRD-REFLOW1': [80, 80, 90, 90, 102, 102, 116, 116, 116, 116],
        'APJ-DBCT-REFLOW1': [80, 80, 140, 140, 140, 140, 140, 140, 140, 140, 140, 140],
        'APJ-DBCB-REFLOW1': [80, 80, 140, 140, 140, 140, 140, 140, 140, 140, 140, 140],
        'APJ-AT1': [165, 165, 156, 156, 156, 156, 156, 156, 156, 156, 156, 156, 27],
        'APJ-CLEAN-US1': [75, 75, 75, 125],
        'APJ-TRM1': [
          186, 186, 186, 186, 186, 186, 192, 192, 186, 186, 186, 186, 186, 186, 192, 192, 186, 186, 186, 186, 186, 186,
          192, 192
        ],
        'APJ-RT': [166, 164, 164, 166, 166, 175, 26],
        'APJ-HT': [164, 164, 164, 164, 164, 164, 164, 164, 175, 164, 164, 166],
        'APJ-HTRT1': [
          165,
          165,
          165,
          165,
          165,
          165,
          165,
          165,
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          164,
          164,
          168,
          168,
          164,
          164,
          168,
          168,
          32
        ],
        'APJ-OVEN1': [125],
        'APJ-AT2': [154, 154, 154, 154, 154, 154, 154, 154, 154, 154],
        'APJ-FREEZER3': [6, 6],
        'APJ-OVEN2': [192],
        'APJ-FREEZER2': [12],
        'APJ-FREEZER1': [-16],
        'SIM-TRM1': [156, 156, 156, 156, 156, 156, 192, 192, 192, 192, 192, 192],
        'SIM-TRM2': [156, 156, 156, 156, 156, 156, 192, 192, 192, 192, 192, 192],
        'SIM-PRINTER1': [36, 70],
        'SIM-REFLOW1': [
          144,
          150,
          154,
          160,
          154,
          160,
          154,
          160,
          164,
          164,
          190,
          190,
          280,
          280,
          270,
          270,
          null,
          null,
          null
        ],
        // 'SIM-OVEN1': [190, 195, 195, 6, 6, 6, 6],
        'SIM-OVEN1': [195],
        'SIM-OVEN2': [195],
        'SMA-OVEN1': [190],
        'SMA-FREEZER1': [6, 6],
        'SX-FREEZER1': [6, 6]
      },
      limitMin: {
        'APJ-IGBT-REFLOW1': [-10, -20, 70, 70, 87, 87, 104, 104, 104, 104],
        'APJ-FRD-REFLOW1': [-10, -20, 70, 70, 87, 87, 104, 104, 104, 104],
        'APJ-DBCT-REFLOW1': [-10, -10, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        'APJ-DBCB-REFLOW1': [-10, -10, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        'APJ-AT1': [130, 130, 144, 144, 144, 144, 144, 144, 144, 144, 144, 144, 12],
        'APJ-CLEAN-US1': [45, 45, 45, 95],
        'APJ-TRM1': [
          174, 174, 174, 174, 174, 174, 177, 177, 174, 174, 174, 174, 174, 174, 177, 177, 174, 174, 174, 174, 174, 174,
          177, 177
        ],
        'APJ-RT': [154, 152, 152, 154, 154, 155, 14],
        'APJ-HT': [152, 152, 152, 152, 152, 152, 152, 152, 155, 152, 152, 154],
        'APJ-HTRT1': [
          150,
          150,
          150,
          150,
          150,
          150,
          150,
          150,
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          150,
          150,
          152,
          152,
          150,
          150,
          152,
          152,
          18
        ],
        'APJ-OVEN1': [95],
        'APJ-AT2': [146, 146, 146, 146, 146, 146, 146, 146, 146, 146],
        'APJ-FREEZER3': [-6, -6],
        'APJ-OVEN2': [172],
        'APJ-FREEZER2': [-2],
        'APJ-FREEZER1': [null],
        'SIM-TRM1': [144, 144, 144, 144, 144, 144, 177, 177, 177, 177, 177, 177],
        'SIM-TRM2': [144, 144, 144, 144, 144, 144, 177, 177, 177, 177, 177, 177],
        'SIM-PRINTER1': [18, 10],
        'SIM-REFLOW1': [
          136,
          140,
          146,
          150,
          146,
          150,
          146,
          150,
          156,
          156,
          180,
          180,
          270,
          270,
          260,
          260,
          null,
          null,
          null
        ],
        // 'SIM-OVEN1': [160,165,165,-6, -6,-6, -6],
        'SIM-OVEN1': [165],
        'SIM-OVEN2': [165],
        'SMA-OVEN1': [160],
        'SMA-FREEZER1': [-6, -6],
        'SX-FREEZER1': [-6, -6]
      },
      searchBtn: '范围内查询',
      api: api('/oven/ovnbatchlot/tempExport'),
      toolbarStatus: {
        exportsLoading: false
      }
    }
  },
  mounted() {
    var now = new Date()
    var endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10)
    var startDate = endDate.slice(0, 8) + '01'
    this.form.dateTime = [startDate, endDate]
  },
  created() {
    eqpList().then((response) => {
      this.tempEqpId = response.data.eqpId
    })
  },
  methods: {
    tempExport() {
      if (this.toolbarStatus.exportsLoading) {
        return
      }
      this.toolbarStatus.exportsLoading = true
      // const q = (this.query)
      // const q = this.form
      var param = {}
      param.eqpId = this.form.eqpId
      param.startTime = this.form.dateTime[0]
      param.endTime = this.form.dateTime[1]
      if (param.eqpId === '' || this.form.dateTime[0] === '' || this.form.dateTime[1] === '') {
        alert('请选择机种名和时间段')
        return
      }
      this.api.export(param).then((response) => {
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
      }).catch((e) => {
        this.toolbarStatus.exportsLoading = false
      })
    },
    onValueChange(name) {
      this.form.eqpId = name
    },
    positionChange(pName) {
      this.initChart(pName)
      this.imgPosition = pName
      this.editableTabsValue = this.editableTabs[pName].title
    },
    check() {
      var start = this.form.dateTime[0].slice(8, 10)
      var end = this.form.dateTime[1].slice(8, 10)
      var startc = parseInt(start)
      var endc = parseInt(end)
      console.log('qq' + startc + 'ww' + endc)
      if (endc - startc > 6) {
        this.$alert('限制时间范围为7天内', '请重新选择时间范围！', {
          confirmButtonText: '确定',
          callback: (action) => {}
        })
        // eslint-disable-next-line brace-style
      } else if (endc - startc < 0 && endc - startc > -24) {
        this.$alert('限制时间范围为7天内', '请重新选择时间范围！', {
          confirmButtonText: '确定',
          callback: (action) => {}
        })
        // eslint-disable-next-line brace-style
      } else {
        this.search()
      }
    },
    changeImg() {
      if (
        this.form.eqpId === 'APJ-RT' ||
        this.form.eqpId === 'APJ-HT' ||
        this.form.eqpId === 'APJ-AT2' ||
        this.form.eqpId === 'APJ-OVEN1' ||
        this.form.eqpId === 'APJ-OVEN2' ||
        this.form.eqpId === 'APJ-FREEZER3' ||
        this.form.eqpId === 'APJ-FREEZER1' ||
        this.form.eqpId === 'APJ-FREEZER2' ||
        this.form.eqpId === 'APJ-CLEAN-US1' ||
        this.form.eqpId === 'SIM-OVEN1' ||
        this.form.eqpId === 'SIM-OVEN2' ||
        this.form.eqpId === 'SMA-OVEN1' ||
        this.form.eqpId === 'SMA-FREEZER1' ||
        this.form.eqpId === 'SX-FREEZER1'
      ) {
        this.picUrl = this.form.eqpId
        this.picUrlDetail = this.picUrl
          .replace('APJ-', 'DETAIL-')
          .replace('SIM-', 'DETAIL-')
          .replace('SMA-', 'DETAIL-')
          .replace('SX-', 'DETAIL-')
        this.tempEchart = 'unEqpTemp'
      } else {
        this.tempEchart = 'eqpTemp'
      }
      this.imgPosition = 0
      this.search()
    },
    searchLine() {
      if (this.searchBtn === '数据线查询') {
        this.searchBtn = '范围内查询'
      } else {
        this.searchBtn = '数据线查询'
      }
      this.initChart(this.imgPosition)
    },
    search() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            target: document.querySelector('#tempchar')
          })
          tempbytime(this.form.eqpId, {
            beginTime: this.form.dateTime[0],
            endTime: this.form.dateTime[1]
          }).then((res) => {
            const data = res.data
            loading.close()
            this.editableTabs.splice(0, this.editableTabs.length)
            this.tempsTitles = data.title.split(',')
            if (this.tempsTitles[0].indexOf('第2温区') !== -1) {
              this.tempsTitles.splice(0, 0, '第1温区温度当前值')
              this.tempsTitles.splice(1, 0, '第1温区温度SET')
              this.tempsTitles.splice(2, 0, '第1温区温度MIN')
              this.tempsTitles.splice(3, 0, '第1温区温度MAX')
              for (let index = 0; index < this.tempsTitles.length; index++) {
                if (
                  this.tempsTitles[index].indexOf('当前值') !== -1 ||
                  this.tempsTitles[index].indexOf('现在值') !== -1
                ) {
                  this.editableTabs.push({
                    name: this.tempsTitles[index].replace('当前值', '').replace('现在值', ''),
                    title: this.tempsTitles[index].replace('当前值', '').replace('现在值', '')
                  })
                }
              }
            } else if (this.tempsTitles[0].indexOf('0003相似度当前值') !== -1) {
              this.tempsTitles.splice(0, 0, '0002相似度当前值')
              this.tempsTitles.splice(1, 0, '0002相似度SET')
              this.tempsTitles.splice(2, 0, '0002相似度MIN')
              this.tempsTitles.splice(3, 0, '0002相似度MAX')
              for (let index = 0; index < this.tempsTitles.length; index++) {
                if (
                  this.tempsTitles[index].indexOf('当前值') !== -1 ||
                  this.tempsTitles[index].indexOf('现在值') !== -1
                ) {
                  this.editableTabs.push({
                    name: this.tempsTitles[index].replace('当前值', '').replace('现在值', ''),
                    title: this.tempsTitles[index].replace('当前值', '').replace('现在值', '')
                  })
                }
              }
            } else if (this.tempsTitles[0].indexOf('T102面积当前值') !== -1) {
              this.tempsTitles.splice(0, 0, 'T101面积当前值')
              this.tempsTitles.splice(1, 0, 'T101面积SET')
              this.tempsTitles.splice(2, 0, 'T101面积MIN')
              this.tempsTitles.splice(3, 0, 'T101面积MAX')
              for (let index = 0; index < this.tempsTitles.length; index++) {
                if (
                  this.tempsTitles[index].indexOf('当前值') !== -1 ||
                  this.tempsTitles[index].indexOf('现在值') !== -1
                ) {
                  this.editableTabs.push({
                    name: this.tempsTitles[index].replace('当前值', '').replace('现在值', ''),
                    title: this.tempsTitles[index].replace('当前值', '').replace('现在值', '')
                  })
                }
              }
            } else {
              for (let index = 0; index < this.tempsTitles.length; index++) {
                if (this.tempsTitles[index] !== '' && this.tempsTitles[index] !== null) {
                  this.editableTabs.push({ name: this.tempsTitles[index], title: this.tempsTitles[index] })
                }
              }
            }
            this.editableTabsValue = this.editableTabs[0].title
            this.tempsValue = data.results
            if (this.tempsValue.length === 0) {
              return this.$message.error('echarts表格数据为空！！！')
            }
            this.initChart(0)
          })
        }
      })
    },
    getDate(datestr) {
      var temp = datestr.split('-')
      if (temp[1] === '01') {
        temp[0] = parseInt(temp[0], 10) - 1
        temp[1] = '12'
      } else {
        temp[1] = parseInt(temp[1], 10) - 1
      }
      // new Date()的月份入参实际都是当前值-1
      var date = new Date(temp[0], temp[1], temp[2])
      return date
    },
    initChart(index) {
      // 选择是否带有图示的echart
      var chartDiv = 'tempChart'
      if (this.tempEchart === 'unEqpTemp') {
        chartDiv = 'tempChart2'
      } else {
        chartDiv = 'tempChart'
      }
      this.chart = echarts.init(document.getElementById(chartDiv))
      const Cureoption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: this.charLegend
          // data: ['运行温度', '低温报警', '高温报警']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            show: true,
            type: 'slider',
            y: '90%',
            start: 0,
            end: 100
          }
        ],
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: { onZero: false },
          data: []
        },
        yAxis: { type: 'value' },
        series: [
          {
            name: this.extraTitle[0],
            itemStyle: {
              normal: {
                color: '#458B74',
                lineStyle: {
                  color: '#458B74',
                  width: 3
                }
              }
            },
            smooth: true,
            type: 'line',
            data: ['temp_pv'],
            animationDuration: 3000,
            animationEasing: 'quadraticOut'
          },
          {
            name: this.extraTitle[1],
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#DAA520',
                lineStyle: {
                  color: '#DAA520',
                  width: 2,
                  type: 'dotted'
                }
              }
            },
            data: ['temp_sp'],
            animationDuration: 2600,
            animationEasing: 'quadraticOut'
          },
          {
            name: this.extraTitle[2],
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#FF4040',
                lineStyle: {
                  color: '#FF4040',
                  width: 2,
                  type: 'dashed'
                }
              }
            },
            data: ['temp_min'],
            animationDuration: 2000,
            animationEasing: 'quadraticOut',
            markLine: {
              data: [{ type: 'max', name: '最大数据' }]
            }
          },
          {
            name: this.extraTitle[3],
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#8B2323',
                lineStyle: {
                  color: '#8B2323',
                  width: 2,
                  type: 'dashed'
                },
                areaStyle: {
                  color: '#BBFFFF'
                }
              }
            },
            data: ['temp_max'],
            animationDuration: 2000,
            animationEasing: 'quadraticOut',
            markLine: {
              data: [{ type: 'max', name: '最大数据' }]
            }
          }
        ]
      }
      this.chart.showLoading({
        text: 'loading',
        color: '#c23531',
        textColor: '#000',
        maskColor: 'rgba(255, 255, 255, 0.2)',
        zlevel: 0
      })
      setTimeout(() => {
        // setOption前隐藏loading事件
        this.chart.hideLoading()
        if (index === 0 || index === '0') {
          this.chart.setOption(this.loadTempDataFirst(Cureoption), true)
        } else {
          this.chart.setOption(this.loadTempData(Cureoption, index), true)
        }
      }, 1000)
    },
    loadTempDataFirst(option) {
      option.xAxis.data = this.produce(this.tempsValue, 'create_date')
      option.series[0].data = this.produce(this.tempsValue, 'temp_pv')
      option.series[1].data = this.produce(this.tempsValue, 'temp_sp')
      option.series[2].data = this.produce(this.tempsValue, 'temp_min')
      option.series[3].data = this.produce(this.tempsValue, 'temp_max')
      // 重置Y轴
      var limitMax = this.limitMax[this.form.eqpId][0]
      var limitMin = this.limitMin[this.form.eqpId][0]
      var myYAxis = this.getYAxis(option.series[0].data, limitMax, limitMin)
      option.yAxis = myYAxis
      return option
    },
    produce(data, name) {
      var result = []
      for (var i = 0, len = data.length; i < len; i++) {
        result.push(data[i][name])
      }
      return result
    },
    loadTempData(option, index) {
      option.xAxis.data = this.produce(this.tempsValue, 'create_date')
      option.series[0].data = this.produceOther(this.tempsValue, index, 0)
      var limitMax = this.limitMax[this.form.eqpId][index]
      var limitMin = this.limitMin[this.form.eqpId][index]
      if ((this.form.eqpId === 'APJ-RT' && index === '5') || (this.form.eqpId === 'APJ-HT' && index === '8')) {
        // 高温的预热平台没有上下限和设定值
        option.series[1].data = [] // 设定
        option.series[2].data = [] // 下限
        option.series[3].data = [] // 上限
        limitMax = ''
        limitMin = ''
      } else {
        option.series[1].data = this.produceOther(this.tempsValue, index, 1) // 设定
        option.series[2].data = this.produceOther(this.tempsValue, index, 2) // 下限
        option.series[3].data = this.produceOther(this.tempsValue, index, 3) // 上限
      }
      // 设置y轴的最大值和最小值
      var myYAxis = this.getYAxis(option.series[0].data, limitMax, limitMin)
      option.yAxis = myYAxis
      return option
    },
    produceOther(data, index, int) {
      var key = 4 * (index - 1) + int
      var result = []
      for (var i = 0, len = data.length; i < len; i++) {
        var tempsValues = data[i].other_temps_value.split(',')
        result.push(tempsValues[key])
      }
      return result
    },
    loadTempDataPart(tab) {
      // 更新图片
      this.imgPosition = parseInt(tab.index)
      // eslint-disable-next-line eqeqeq
      if (this.form.eqpId === 'SIM-PRINTER1' && tab.index == 1) {
        this.extraTitle = ['运行湿度', '设定湿度', '湿度下限报警', '湿度上限报警']
        this.charLegend = ['运行湿度', '设定湿度', '湿度下限报警', '湿度上限报警']
      } else {
        this.extraTitle = ['运行温度', '设定温度', '低温报警', '高温报警']
        this.charLegend = ['运行温度', '设定温度', '低温报警', '高温报警']
      }
      this.initChart(tab.index)
    },
    getYAxis(tempsValue, limitMax, limitMin) {
      var dataMax = limitMax
      var dataMin = limitMin
      var myYAxis = {}
      myYAxis.type = 'value'
      if (this.searchBtn === '数据线查询' || limitMin === '') {
        // 展示所有的数据,当数据没有超过上下限时显示同 else
        if (tempsValue.length > 0) {
          for (var i = 0; i < tempsValue.length; i++) {
            var tempv = parseFloat(tempsValue[i])
            if (isNaN(dataMax) || dataMax === '') {
              dataMax = tempv
            } else {
              if (dataMax < tempv) {
                dataMax = tempv
              }
            }
            if (isNaN(dataMin) || dataMin === '') {
              dataMin = tempv
            } else {
              if (dataMin > tempv) {
                dataMin = tempv
              }
            }
          }
        }
      }
      if (!isNaN(dataMax) && dataMax !== '') {
        myYAxis.max = dataMax
      }
      if (!isNaN(dataMin) && dataMin !== '') {
        myYAxis.min = dataMin
      }
      return myYAxis
    }
  }
}
</script>
<style lang="scss" scoped>
.tempchar {
  width: 100%;
  height: 100%;
  margin: 0 auto;

  .form {
    margin-top: 20px;
  }
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
img {
  width: 100%;
  height: 100%;
  border: 1px solid red;
}
</style>
