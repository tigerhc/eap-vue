<template>
  <div class="tempchar">
    <el-form ref="form" :model="form" :inline="true" :rules="formRules" class="form" label-width="90px" size="small">
      <el-row>
        <el-col :span="6">
          <el-form-item label="设备号:">
            <div class="condition">
              <el-select v-model="form.eqpId">
                <el-option v-for="item in tempEqpId" :key="item.eqpId" :label="item.eqpId" :value="item.eqpId" />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="日期" prop="dateTime">
            <el-date-picker
              v-model="form.dateTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-input v-model="limitY" type="primary" placeholder="下限-上限" @change="changTempY" />
        </el-col>
        <el-button type="primary" @click="search">查询</el-button>
      </el-row>
    </el-form>
    <el-tabs v-model="editableTabsValue" type="card" @tab-click="loadTempDataPart">
      <el-tab-pane v-for="item in editableTabs" :key="item.title" :label="item.title" :name="item.title" />
    </el-tabs>

    <div id="tempChart" style="width: 100%; height: 500px; overflow: hidden" />
  </div>
</template>
<script>
import { tempbytime } from '@/api/public'
import * as echarts from 'echarts'
import { eqpList } from '@/api/oven/temperature'

export default {
  name: 'Tempchar',
  components: {},
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
      flag: 10000,
      list: [],
      chart: undefined,
      charLegend: ['运行温度', '设定温度', '低温报警', '高温报警'],
      limitY: '',
      tpMaxY: 0
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
    onValueChange(name) {
      this.form.eqpId = name
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
    search() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          tempbytime(this.form.eqpId, {
            beginTime: this.form.dateTime[0],
            endTime: this.form.dateTime[1]
          }).then((res) => {
            const data = res.data
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
            var tp = 100000
            var maxTp = 0
            for (var i = 0; i < this.tempsValue.length; i++) {
              var te = this.tempsValue[i]['temp_pv']
              if (parseInt(te) < parseInt(tp)) {
                tp = this.tempsValue[i]['temp_pv']
              }
              if (parseInt(te) > maxTp) {
                maxTp = this.tempsValue[i]['temp_pv']
              }
            }
            this.flag = parseInt(tp) < parseInt(this.tempsValue[0]['temp_min']) ? tp : this.tempsValue[0]['temp_min']
            this.tpMaxY =
              parseInt(maxTp) < parseInt(this.tempsValue[0]['temp_max'])
                ? this.tempsValue[0]['temp_max']
                : parseInt(maxTp)
            if (this.form.eqpId === 'APJ-FREEZER3') {
              this.flag = -30
              this.tpMaxY = 30
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
      this.chart = echarts.init(document.getElementById('tempChart'))
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
        yAxis: [
          {
            max: this.tpMaxY + 1,
            type: 'value',
            min: this.flag - 1
          }
        ],
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
      if (index === 0 || index === '0') {
        this.chart.setOption(this.loadTempDataFirst(Cureoption), true)
      } else {
        this.chart.setOption(this.loadTempData(Cureoption, index), true)
      }
    },
    loadTempDataFirst(option) {
      option.xAxis.data = this.produce(this.tempsValue, 'create_date')
      option.series[0].data = this.produce(this.tempsValue, 'temp_pv')
      option.series[1].data = this.produce(this.tempsValue, 'temp_sp')
      option.series[2].data = this.produce(this.tempsValue, 'temp_min')
      option.series[3].data = this.produce(this.tempsValue, 'temp_max')
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
      option.series[1].data = this.produceOther(this.tempsValue, index, 1)
      option.series[2].data = this.produceOther(this.tempsValue, index, 2)
      option.series[3].data = this.produceOther(this.tempsValue, index, 3)
      return option
    },
    produceOther(data, index, int) {
      var key = 4 * (index - 1) + int
      var result = []
      for (var i = 0, len = data.length; i < len; i++) {
        var tempsValues = data[i].other_temps_value.split(',')
        result.push(tempsValues[key])
      }
      // eslint-disable-next-line eqeqeq
      // if (int == 2) {
      //   var tem = data[0].other_temps_value.split(',')
      //   this.flag = tem[key]
      //   alert(this.flag)
      // }

      return result
    },
    loadTempDataPart(tab) {
      if (tab.index === 0 || tab.index === '0') {
        var tp = 100000
        var maxTpTab0 = 0
        for (var i = 0; i < this.tempsValue.length; i++) {
          var te = this.tempsValue[i]['temp_pv']
          if (parseInt(te) < parseInt(tp)) {
            tp = this.tempsValue[i]['temp_pv']
          }
          if (parseInt(te) > maxTpTab0) {
            maxTpTab0 = parseInt(te)
          }
        }
        this.flag = parseInt(tp) < parseInt(this.tempsValue[0]['temp_min']) ? tp : this.tempsValue[0]['temp_min']
        this.tpMaxY =
          parseInt(maxTpTab0) < parseInt(this.tempsValue[0]['temp_max'])
            ? this.tempsValue[0]['temp_max']
            : parseInt(maxTpTab0)
      } else {
        var key = 4 * (tab.index - 1)
        var a = 100000
        var maxTpTab = 0
        this.tempsValue[0].other_temps_value.split(',')[key + 2]
        for (var j = 0; j < this.tempsValue.length; j++) {
          var tem = this.tempsValue[j].other_temps_value.split(',')
          if (parseInt(a) > parseInt(tem[key])) {
            a = tem[key]
          }
          if (parseInt(tem[key]) > maxTpTab) {
            maxTpTab = parseInt(tem[key])
          }
        }
        this.flag =
          parseInt(a) < parseInt(this.tempsValue[0].other_temps_value.split(',')[key + 2])
            ? a
            : this.tempsValue[0].other_temps_value.split(',')[key + 2]
        this.tpMaxY =
          parseInt(maxTpTab) < parseInt(this.tempsValue[0].other_temps_value.split(',')[key + 3])
            ? parseInt(this.tempsValue[0].other_temps_value.split(',')[key + 3])
            : parseInt(maxTpTab)
      }
      if (this.form.eqpId === 'APJ-FREEZER3') {
        this.flag = -30
        this.tpMaxY = 30
      }
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
    changTempY() {
      var lmt = this.limitY.split('-')
      if (lmt.length === 2) {
        this.tpMaxY = parseInt(lmt[1])
        this.flag = lmt[0]
        this.initChart(lmt[2])
      }
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
</style>
<style>
</style>
