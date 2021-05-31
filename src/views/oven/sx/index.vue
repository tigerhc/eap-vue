
<template>
  <div class="app-container calendar-list-container">
    <div class="condition-panel">
      <el-form class="form" label-width="90px" size="small">
        <el-row>
          <el-col :span="4">
            <el-form-item label="类型:">
              <el-select v-model="form1.type" :style="{width:'90px'}" @change="findProduction">
                <el-option v-for="item in TypeResult" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-select v-model="form1.lineNo" :style="{width:'90px'}" @change="findProduction">
                <el-option v-for="item in lineNoResult" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="机种名:">
              <div class="condition">
                <el-select v-model="form.productionName" class="wid90" @change="search">
                  <el-option
                    v-for="item in productionResult"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="位置:">
              <el-select v-model="form.local" class="wid90" @change="search">
                <el-option v-for="item in localResult" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="日期:">
              <el-date-picker
                v-model="dateTime"
                style="width: 250%"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                class="dateTimeClass"
              />
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-button type="primary" style="margin-left: 295px; height: 32px" @click="search">查询</el-button>
          </el-col>
          <el-col :span="1">
            <el-button type="primary" style="margin-left: 300px; height: 32px" @click="finddetail">导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="frame">
      <div id="main" style="width: 65%; height: 300px; overflow: hidden" />
      <img id="mainImg" :src="picUrl" class="arrow_box" >
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import api from '../ports/fetch'
import { productionName } from '@/api/oven/temperature'
import { findSxNumber } from '@/api/ms/monitor'
export default {
  name: 'Index',
  data() {
    return {
      form: {
        number: '',
        type: '',
        productionName: '',
        startDate: '',
        endDate: '',
        local: ''
      },
      api: api('/ms/measuresx/findSxNumberExport'),
      form1: {
        type: '',
        lineNo: ''
      },
      toolbarStatus: {
        exportsLoading: false
      },
      myChart: null,
      dateTime: [],
      series: [],
      data: [],
      min: undefined,
      productionResult: [],
      type: '',
      formatter: '',
      picUrl: undefined,
      picUrlA: require('../../../assets/img/sxA.png'),
      picUrlB: require('../../../assets/img/sxB.png'),
      picUrlC: require('../../../assets/img/sxC.png'),
      picUrlD: require('../../../assets/img/sxD.png'),
      picUrlE: require('../../../assets/img/sim_abc.png'),
      picUrlF: require('../../../assets/img/c21.png'),
      picUrlG: require('../../../assets/img/56GI.png'),
      picUrlH: require('../../../assets/img/56GI2.png'),
      picUrlI: require('../../../assets/img/56GI3.png'),
      localResultSim: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }, { value: 'c21', label: 'c21' }],
      localResultSx: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }, { value: 'd', label: 'D' }],
      localResultGi: [{ value: 'burr_f', label: 'burr_f' }, { value: 'pin_f1', label: 'pin_f1' }, { value: 'pin_f2', label: 'pin_f2' }, { value: 'pin_f3', label: 'pin_f3' }, { value: 'pin_f4', label: 'pin_f4' }, { value: 'pin_f5', label: 'pin_f5' }, { value: 'pin_f6', label: 'pin_f6' }, { value: 'pin_f1_f2', label: 'pin_f1_f2' }, { value: 'pin_f2_f3', label: 'pin_f2_f3' }, { value: 'pin_f3_f4', label: 'pin_f3_f4' }, { value: 'pin_f4_f5', label: 'pin_f4_f5' }, { value: 'pin_f5_f6', label: 'pin_f5_f6' }, { value: 'pin_s1', label: 'pin_s1' }, { value: 'pin_s2', label: 'pin_s2' }, { value: 'pin_s3', label: 'pin_s3' }, { value: 'pin_s4', label: 'pin_s4' }, { value: 'pin_s5', label: 'pin_s5' }, { value: 'pin_s6', label: 'pin_s6' }],
      lineTypeResult: [
        {
          value: '0001',
          label: '1'
        },
        {
          value: '0002',
          label: '2'
        }
      ],
      TypeResult: [
        {
          value: 'LF',
          label: 'LF'
        },
        {
          value: 'check',
          label: '检查'
        },
        {
          value: 'IT',
          label: 'IT'
        }
      ],
      lineNoResult: [
        {
          value: 'SX',
          label: 'SX'
        },
        {
          value: 'SIM',
          label: 'SIM'
        },
        {
          value: '5GI',
          label: '5GI'
        },
        {
          value: '6GI',
          label: '6GI'
        }
      ],
      localResult: []
    }
  },
  methods: {
    finddetail() {
      // var param = this.$refs.ref.fdis()
      // this.query.id = param
      // eslint-disable-next-line no-undef
      this.form.number = '0001'
      this.form.type = this.form1.type
      this.form.startDate = this.dateTime[0]
      this.form.endDate = this.dateTime[1]
      this.form.lineNo = this.form1.lineNo
      if (this.toolbarStatus.exportsLoading) {
        return
      }
      this.toolbarStatus.exportsLoading = true
      // const q = (this.query)
      const q = this.form
      // alert(q)
      this.api
        .export(q)
        .then((response) => {
          if (response.code === 0) {
            return import('../ports/Export2Excel').then((excel) => {
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
    findProduction() {
      productionName(this.form1).then((response) => {
        this.productionResult = response.data
        if (this.form1.lineNo === 'SX') {
          this.localResult = this.localResultSx
        } else if (this.form1.lineNo === 'SIM') {
          this.localResult = this.localResultSim
        } else if (this.form1.lineNo === '6GI' || this.form1.lineNo === '5GI') {
          this.localResult = this.localResultGi
        }
      })
      this.form.productionName = ''
      this.form.local = ''
    },
    search() {
      if (this.form.local === 'd') {
        this.formatter = '{value} °'
      } else {
        this.formatter = '{value} mm'
      }
      // 图片控制
      if (this.form1.lineNo === 'SX') {
        if (this.form.local === 'a') {
          this.picUrl = this.picUrlA
        } else if (this.form.local === 'b') {
          this.picUrl = this.picUrlB
        } else if (this.form.local === 'c') {
          this.picUrl = this.picUrlC
        } else if (this.form.local === 'd') {
          this.picUrl = this.picUrlD
        }
      } else if (this.form1.lineNo === 'SIM') {
        if (this.form.local === 'c21') {
          this.picUrl = this.picUrlF
        } else {
          this.picUrl = this.picUrlE
        }
      } else if (this.form1.lineNo === '5GI' || this.form1.lineNo === '5GI') {
        if (this.form.local === 'burr_f') {
          this.picUrl = this.picUrlI
        } else if (this.form.local === 'pin_s1' || this.form.local === 'pin_s2' || this.form.local === 'pin_s3' || this.form.local === 'pin_s4' || this.form.local === 'pin_s5' || this.form.local === 'pin_s6') {
          this.picUrl = this.picUrlH
        } else { // this.form.local === 'pin_f1' || this.form.local === 'pin_f2' || this.form.local === 'pin_f3'|| this.form.local === 'pin_f4'|| this.form.local === 'pin_f5'|| this.form.local === 'pin_f6'||pin_f1_f2,pin_f2_f3,pin_f3_f4,pin_f4_f5,pin_f5_f6
          this.picUrl = this.picUrlG
        }
      }
      this.form.number = '0001'
      this.form.type = this.form1.type
      this.form.startDate = this.dateTime[0]
      this.form.endDate = this.dateTime[1]
      this.form.lineNo = this.form1.lineNo
      findSxNumber(this.form).then((res) => {
        this.data = res.data[0]
        this.series = res.data[1]
        this.min = res.data[2].min
        this.initChart()
      })
    },
    initChart() {
      if (this.myChart != null) {
        this.myChart.dispose()
      }
      var chartDom = document.getElementById('main')
      this.myChart = echarts.init(chartDom)
      // var app = {};
      var option
      option = {
        color: ['#3CB371', '#00FFFF', '#ff0000', '#FF0000', '#1E90FF', '#FFA500', '#800000', '#1E90FF'],
        title: {
          text: '量测分离倾向管理图'
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [
            '1-1:A',
            '1-2:A',
            '2-1:A',
            '2-2:A',
            '1-1:B',
            '1-2:B',
            '2-1:B',
            '2-2:B',
            '上限',
            '下限',
            '1-1:C',
            '1-2:C',
            '2-1:C',
            '2-2:C',
            '1-1:D',
            '1-2:D',
            '2-1:D',
            '2-2:D',
            '1-1:C21',
            '1-2:C21',
            '2-1:C21',
            '2-1:C21',
            '上限',
            '下限',
            '1-毛刺', '2-毛刺', '3-毛刺', '4-毛刺', '5-毛刺',
            '1-1:1PIN', '2-1:1PIN', '3-1:1PIN', '4-1:1PIN', '5-1:1PIN',
            '1-1:2PIN', '2-1:2PIN', '3-1:2PIN', '4-1:2PIN', '5-1:2PIN',
            '1-1:3PIN', '2-1:3PIN', '3-1:3PIN', '4-1:3PIN', '5-1:3PIN',
            '1-1:4PIN', '2-1:4PIN', '3-1:4PIN', '4-1:4PIN', '5-1:4PIN',
            '1-1:5PIN', '2-1:5PIN', '3-1:5PIN', '4-1:5PIN', '5-1:5PIN',
            '1-1:6PIN', '2-1:6PIN', '3-1:6PIN', '4-1:6PIN', '5-1:6PIN',
            '1-1:1PIN-2PIN', '2-1:1PIN-2PIN', '3-1:1PIN-2PIN', '4-1:1PIN-2PIN', '5-1:1PIN-2PIN',
            '1-1:2PIN-3PIN', '2-1:2PIN-3PIN', '3-1:2PIN-3PIN', '4-1:2PIN-3PIN', '5-1:2PIN-3PIN',
            '1-1:3PIN-4PIN', '2-1:3PIN-4PIN', '3-1:3PIN-4PIN', '4-1:3PIN-4PIN', '5-1:3PIN-4PIN',
            '1-1:4PIN-5PIN', '2-1:4PIN-5PIN', '3-1:4PIN-5PIN', '4-1:4PIN-5PIN', '5-1:4PIN-5PIN',
            '1-1:5PIN-6PIN', '2-1:5PIN-6PIN', '3-1:5PIN-6PIN', '4-1:5PIN-6PIN', '5-1:5PIN-6PIN',
            '1-2:1PIN', '2-2:1PIN', '3-2:1PIN', '4-2:1PIN', '5-2:1PIN',
            '1-2:2PIN', '2-2:2PIN', '3-2:2PIN', '4-2:2PIN', '5-2:2PIN',
            '1-2:3PIN', '2-2:3PIN', '3-2:3PIN', '4-2:3PIN', '5-2:3PIN',
            '1-2:4PIN', '2-2:4PIN', '3-2:4PIN', '4-2:4PIN', '5-2:4PIN',
            '1-2:5PIN', '2-2:5PIN', '3-2:5PIN', '4-2:5PIN', '5-2:5PIN',
            '1-2:6PIN', '2-2:6PIN', '3-2:6PIN', '4-2:6PIN', '5-2:6PIN'
          ]
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.data
        },
        yAxis: {
          type: 'value',
          min: this.min,
          axisLabel: {
            formatter: this.formatter
          }
        },
        series: this.series
      }
      this.myChart.setOption(option)
      // if (option && typeof option === 'object') {
      //   myChart.setOption(option)
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/styles/proindex';
.Rtplotyieldday {
  width: auto;
  height: auto;
  margin: 0 auto;

  .form {
    margin-top: 20px;
  }
  .condition {
    box-sizing: border-box;
    display: inline-block;
    font-family: sans-serif;
    margin: 0;
  }
}
</style>
