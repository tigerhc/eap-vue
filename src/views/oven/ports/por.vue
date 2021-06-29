<template>
  <div id="tempchar" class="tempchar">
    <el-form ref="form" :model="form" :rules="formRules" :inline="true" class="form" label-width="90px" size="small">
      <el-row>
        <el-col :span="8">
          <el-form-item label="批量号" prop="lotNo">
            <el-input v-model="form.lotNo" placeholder="请输入批量号" clearable />
          </el-form-item>
        </el-col>

        <el-form-item label="位置" prop="position">
          <el-select v-model="form.position" @change="ValueChange()">
            <el-option
              v-for="item in positionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-row>
    </el-form>
    <div v-show="fistPic" id="back">
      <div id="zero" class="element">T100</div>
      <div id="T101" :class="{ active: position == 'T101' }" class="element">T101</div>
      <div id="T102" class="element">T102</div>
      <div id="T103" class="element">T103</div>
      <div id="T104" class="element"><span class="span">T104</span></div>
      <div id="T105" class="element">T105</div>
      <div id="T106" class="element">T106</div>
      <div id="T107" class="element">T107</div>
      <div id="T108" class="element">T108</div>
      <div id="T109" class="element">T109</div>
      <div id="T110" class="element">T110</div>
      <div id="T111" class="element">T111</div>
      <div id="T112" class="element">T112</div>
      <div id="T113" class="element">T113</div>
      <div id="T114" class="element">T114</div>
      <div id="T115" class="element">T115</div>
      <div id="T116" class="element">T116</div>
      <div id="T117" class="element">T117</div>
      <div id="T118" class="element">T118</div>
      <div id="T119" class="element">T119</div>
      <div id="T120" class="element">T120</div>
      <div id="T121" class="element">T121</div>
      <div id="T122" class="element">T122</div>
      <div id="T123" class="element">T123</div>
      <div id="T124" class="element">T124</div>
      <div id="T125" class="element">T125</div>
      <div id="T126" class="element">T126</div>
      <div id="T127" class="element">T127</div>
      <div id="T128" class="element">T128</div>
      <div id="T129" class="element">T129</div>
    </div>
    <div id="tempChart" style="width: 100%; height: 500px; overflow: hidden" />
  </div>
</template>
<!--<script type="text/javascript" src="../../../views/oven/ports/jquery-3.2.1.min.js" ></script>-->
<script>
import { tempbytimeOther } from '@/api/public'
import * as echarts from 'echarts'

export default {
  name: 'Por',
  data() {
    return {
      form: {
        eqpId: '',
        dateTime: [],
        position: '',
        lotNo: ''
      },
      fistPic: true,
      twoPic: false,
      formRules: {
        lotNo: [{ required: true, message: '请选择批量号！', trigger: 'blur' }],
        position: [{ required: true, message: '请选择位置！', trigger: 'change' }]
      },
      positionList: [
        {
          value: 'T101',
          label: 'T101'
        },
        {
          value: 'T102',
          label: 'T102'
        },
        {
          value: 'T103',
          label: 'T103'
        },
        {
          value: 'T104',
          label: 'T104'
        },
        {
          value: 'T105',
          label: 'T105'
        },
        {
          value: 'T106',
          label: 'T106'
        },
        {
          value: 'T107',
          label: 'T107'
        },
        {
          value: 'T108',
          label: 'T108'
        },
        {
          value: 'T109',
          label: 'T109'
        },
        {
          value: 'T110',
          label: 'T110'
        },
        {
          value: 'T111',
          label: 'T111'
        },
        {
          value: 'T112',
          label: 'T112'
        },
        {
          value: 'T113',
          label: 'T113'
        },
        {
          value: 'T114',
          label: 'T114'
        },
        {
          value: 'T115',
          label: 'T115'
        },
        {
          value: 'T116',
          label: 'T116'
        },
        {
          value: 'T117',
          label: 'T117'
        },
        {
          value: 'T118',
          label: 'T118'
        },
        {
          value: 'T119',
          label: 'T119'
        },
        {
          value: 'T120',
          label: 'T120'
        },
        {
          value: 'T121',
          label: 'T121'
        },
        {
          value: 'T122',
          label: 'T122'
        },
        {
          value: 'T123',
          label: 'T123'
        },
        {
          value: 'T124',
          label: 'T124'
        },
        {
          value: 'T125',
          label: 'T125'
        },
        {
          value: 'T126',
          label: 'T126'
        },
        {
          value: 'T127',
          label: 'T127'
        },
        {
          value: 'T128',
          label: 'T128'
        },
        {
          value: 'T129',
          label: 'T129'
        }
      ],
      editableTabsValue: 0,
      editableTabs: [],
      tempsTitles: [],
      tempsValue: [],
      flag: 0,
      list: [],
      chart: undefined,
      charLegend: ['运行温度', '设定温度', '低温报警', '高温报警']
    }
  },
  watch: {
    data() {
      alert(this.form.position)
    }
  },
  methods: {
    ValueChange() {
      if (this.fistPic === false) {
        this.chart.dispose()
      }
      this.fistPic = true
      document.getElementById(this.form.position).style.backgroundColor = 'orange'
      for (const v of this.positionList) {
        if (v.value !== this.form.position) {
          document.getElementById(v.value).style.backgroundColor = 'limegreen'
        }
      }
    },
    onValueChange(name) {
      this.form.eqpId = name
    },
    check() {
      this.search()
    },
    search() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.fistPic = false
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            target: document.querySelector('#tempchar')
          })
          tempbytimeOther({
            lotNo: this.form.lotNo
          }).then((res) => {
            const data = res.data
            console.log(data)
            this.editableTabs.splice(0, this.editableTabs.length)
            this.tempsTitles = data.title.split(',')
            // if (this.tempsTitles[0].indexOf('第2温区') !== -1) {
            if (this.tempsTitles[0].indexOf('234235234242') !== -1) {
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
            } else {
              this.tempsTitles.splice(0, 0, '温度当前值')
              this.tempsTitles.splice(1, 0, '温度SET')
              this.tempsTitles.splice(2, 0, '温度MIN')
              this.tempsTitles.splice(3, 0, '温度MAX')
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
            }
            this.editableTabsValue = this.editableTabs[0].title
            this.tempsValue = data.results
            this.flag = this.tempsValue[0]['temp_min']

            loading.close()
            this.initChart(parseInt(this.form.position.substring(2)))
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
            type: 'value'
            // min: this.flag - 1
          }
        ],
        series: [
          {
            name: '面积',
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
            name: '面积设定',
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
            name: '面积下限',
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
            name: '面积上限',
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

      // if (index === 0 || index === '0') {
      if (index === 1 || index === '1') {
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
      var key = 4 * (index - 2) + int
      var result = []
      for (var i = 0, len = data.length; i < len; i++) {
        var tempsValues = data[i].other_temps_value.split(',')
        result.push(tempsValues[key])
      }
      return result
    },
    loadTempDataPart(tab) {
      if (tab.index === 0 || tab.index === '0') {
        this.flag = this.tempsValue[0]['temp_min']
      } else {
        var key = 4 * (tab.index - 1) + 2
        var tem = this.tempsValue[0].other_temps_value.split(',')
        this.flag = tem[key]
      }
      this.initChart(tab.index)
    }
  }
}
</script>
  <style lang="scss" scoped>
@import 'src/styles/proindex';
.tempchar {
  width: 100%;
  height: 100%;
  margin: 0 auto;

  .form {
    margin-top: 20px;
  }
}
#back {
  background: url(../../../assets/img/11.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
