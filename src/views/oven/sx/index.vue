<template>
  <div class="app-container calendar-list-container">
    <div class="condition-panel">
      <el-form :inline="true" class="form">
        <el-row>
          <el-form-item>
            <el-select v-model="form1.type" :style="{ width: '120px' }" placeholder="类型" @change="findProduction">
              <el-option v-for="item in TypeResult" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form1.lineNo" :style="{ width: '120px' }" placeholder="类型" @change="findProduction">
              <el-option v-for="item in lineNoResult" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="condition">
              <el-select
                v-model="form.productionName"
                :style="{ width: '180px' }"
                placeholder="请选择机种名"
                @change="search"
              >
                <el-option v-for="item in productionResult" :key="item.label" :label="item.label" :value="item.label" />
              </el-select>
            </div>
          </el-form-item>

          <el-form-item>
            <el-select
              v-show="form1.lineNo === '5GI' || form1.lineNo === '6GI'"
              v-model="form.local56GI"
              :style="{ width: '120px' }"
              clearable
              placeholder="位置"
              @change="positionClick('56GI')"
            >
              <el-option v-for="item in localResult56GI" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="form.local" :style="{ width: '120px' }" clearable placeholder="位置" @change="search">
              <el-option v-for="item in localResult" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select
              v-show="form1.lineNo === 'SIM' && form.local === 'c'"
              v-model="form.localSimC"
              :style="{ width: '120px' }"
              placeholder="位置"
              @change="search"
            >
              <el-option v-for="item in localResultSIMC" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-date-picker
              v-model="dateTime"
              :style="{ width: '250px' }"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="dateTimeClass"
            />
          </el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="finddetail">导出</el-button>
        </el-row>
      </el-form>
    </div>
    <div class="frame">
      <div id="main" style="width: 65%; height: 500px; overflow: hidden; margin-top: 5%" />
      <!--      <img v-show="form1.lineNo!=='SIM' && form1.lineNo!=='5GI' && form1.lineNo!=='6GI' && form1.lineNo!=='SX'" id="mainImg" :src="picUrl" class="arrow_box"> -->
      <div v-show="form1.lineNo === 'SIM'" :class="simClass" class="arrow_box">
        <div class="simAPST" @click="positionClick('simA')" />
        <div class="simBPST" @click="positionClick('simB')" />
        <div class="simCPST" @click="positionClick('simC')" />
      </div>
      <div v-show="form1.lineNo === 'SIM'" class="arrow_box simCDtl">
        <div :class="pstColor" />
        <div class="simdtlText">{{ form.localSimC }}</div>
      </div>
      <div v-show="form1.lineNo === '5GI' || form1.lineNo === '6GI'" :class="simClass" class="arrow_box" />
      <div
        v-show="form1.lineNo === '5GI' || form1.lineNo === '6GI'"
        :class="form1.lineNo === '5GI' ? 'gi5Dtl' : 'gi6Dtl'"
        class="arrow_box"
      >
        <div
          :class="form.local56GI === 'burr_f' ? 'gi56Border' : ''"
          class="burrPST"
          @click="positionClick('burr_f')"
        />
        <div :class="form.local56GI === 'pinf' ? 'gi56Border' : ''" class="pinPST" @click="positionClick('pinf')" />
        <div
          :class="form.local56GI === 'pinf2f' ? 'gi56Border' : ''"
          class="pinf2fPST"
          @click="positionClick('pinf2f')"
        />
        <div :class="form.local56GI === 'pins' ? 'gi56Border' : ''" class="pinsPST" @click="positionClick('pins')" />
      </div>
      <div v-show="form1.lineNo === 'SX'" class="arrow_box sxAll">
        <div :class="form.local === 'a' ? 'grnBg' : 'blkBg'" class="sxAClass">
          <div class="sxAImg" @click="positionClick('a')" />
        </div>
        <div :class="form.local === 'b' ? 'grnBg' : 'blkBg'" class="sxBClass">
          <div class="sxBImg" @click="positionClick('b')" />
        </div>
        <div :class="form.local === 'c' ? 'grnBg' : 'blkBg'" class="sxCClass">
          <div class="sxCImg" @click="positionClick('c')" />
        </div>
        <div :class="form.local === 'd' ? 'grnBg' : 'blkBg'" class="sxDClass">
          <div class="sxDImg" @click="positionClick('d')" />
        </div>
      </div>
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
        number: '0001',
        type: '',
        productionName: '',
        startDate: '',
        endDate: '',
        local: '',
        localSimC: '',
        local56GI: ''
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
      formatter: '',
      picUrl: undefined,
      picUrlA: require('../../../assets/img/sxA.png'),
      picUrlB: require('../../../assets/img/sxB.png'),
      picUrlC: require('../../../assets/img/sxC.png'),
      picUrlD: require('../../../assets/img/sxD.png'),
      picUrlG: require('../../../assets/img/56GI.png'),
      picUrlH: require('../../../assets/img/56GI2.png'),
      picUrlI: require('../../../assets/img/56GI3.png'),
      localResultSim: [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' }
      ],
      localResultSx: [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' },
        { value: 'd', label: 'D' }
      ],
      lineTypeResult: [
        { value: '0001', label: '1' },
        { value: '0002', label: '2' }
      ],
      TypeResult: [
        { value: 'LF', label: 'LF' },
        { value: 'check', label: '检查' }
      ],
      lineNoResult: [
        { value: 'SX', label: 'SX' },
        { value: 'SIM', label: 'SIM' },
        { value: '5GI', label: '5GI' },
        { value: '6GI', label: '6GI' }
      ],
      localResult: [],
      simClass: 'simABC',
      pstColor: '',
      localResultSIMC: [
        { value: 'c1', label: 'c1' },
        { value: 'c2', label: 'c2' },
        { value: 'c3', label: 'c3' },
        { value: 'c4', label: 'c4' },
        { value: 'c5', label: 'c5' },
        { value: 'c6', label: 'c6' },
        { value: 'c7', label: 'c7' },
        { value: 'c8', label: 'c8' },
        { value: 'c9', label: 'c9' },
        { value: 'c10', label: 'c10' },
        { value: 'c11', label: 'c11' },
        { value: 'c12', label: 'c12' },
        { value: 'c13', label: 'c13' },
        { value: 'c14', label: 'c14' },
        { value: 'c15', label: 'c15' },
        { value: 'c16', label: 'c16' },
        { value: 'c17', label: 'c17' },
        { value: 'c19', label: 'c19' },
        { value: 'c20', label: 'c20' },
        { value: 'c21', label: 'c21' },
        { value: 'c23', label: 'c23' },
        { value: 'c24', label: 'c24' },
        { value: 'c26', label: 'c26' },
        { value: 'c28', label: 'c28' },
        { value: 'c30', label: 'c30' },
        { value: 'c31', label: 'c31' },
        { value: 'c35', label: 'c35' },
        { value: 'c37', label: 'c37' },
        { value: 'c40', label: 'c40' }
      ],
      localResult56GI: [
        { value: 'pinf2f', label: '横筋间距' },
        { value: 'pinf', label: '正面弯曲' },
        { value: 'pins', label: '侧面弯曲' },
        { value: 'burr_f', label: '毛刺' }
      ],
      localResultGiPinf: [
        { value: 'pin_f1', label: '正面弯曲1' },
        { value: 'pin_f2', label: '正面弯曲2' },
        { value: 'pin_f3', label: '正面弯曲3' },
        { value: 'pin_f4', label: '正面弯曲4' },
        { value: 'pin_f5', label: '正面弯曲5' },
        { value: 'pin_f6', label: '正面弯曲6' }
      ],
      localResultGiPinf2f: [
        { value: 'pin_f1_f2', label: '横筋间距1_2' },
        { value: 'pin_f2_f3', label: '横筋间距2_3' },
        { value: 'pin_f3_f4', label: '横筋间距3_4' },
        { value: 'pin_f4_f5', label: '横筋间距4_5' },
        { value: 'pin_f5_f6', label: '横筋间距5_6' }
      ],
      localResultGiPins: [
        { value: 'pin_s1', label: '侧面弯曲1' },
        { value: 'pin_s2', label: '侧面弯曲2' },
        { value: 'pin_s3', label: '侧面弯曲3' },
        { value: 'pin_s4', label: '侧面弯曲4' },
        { value: 'pin_s5', label: '侧面弯曲5' },
        { value: 'pin_s6', label: '侧面弯曲6' }
      ],
      localResultGiBurr: [{ value: 'burr_f', label: '毛刺' }]
    }
  },
  mounted() {
    var now = new Date()
    var endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10)
    var startDate = endDate.slice(0, 8) + '01'
    this.form.startDate = startDate
    this.form.endDate = endDate
    this.dateTime = [startDate, endDate]
  },
  methods: {
    positionClick(pst) {
      if (this.form1.lineNo === 'SIM') {
        this.simClass = pst
        if (pst === 'simA') {
          this.form.local = 'a'
        } else if (pst === 'simB') {
          this.form.local = 'b'
        } else if (pst === 'simC') {
          this.form.local = 'c'
        }
      } else if (this.form1.lineNo === 'SX') {
        this.form.local = pst
      } else if (this.form1.lineNo === '5GI' || this.form1.lineNo === '6GI') {
        if (pst === '56GI') {
          if (this.form.local56GI === 'burr_f') {
            this.localResult = this.localResultGiBurr
          } else if (this.form.local56GI === 'pinf') {
            this.localResult = this.localResultGiPinf
          } else if (this.form.local56GI === 'pinf2f') {
            this.localResult = this.localResultGiPinf2f
          } else if (this.form.local56GI === 'pins') {
            this.localResult = this.localResultGiPins
          } else if (this.form.local56GI === '') {
            this.localResult = []
          }
          this.form.local = ''
        } else {
          if (pst === 'burr_f') {
            this.localResult = this.localResultGiBurr
          } else if (pst === 'pinf') {
            this.localResult = this.localResultGiPinf
          } else if (pst === 'pinf2f') {
            this.localResult = this.localResultGiPinf2f
          } else if (pst === 'pins') {
            this.localResult = this.localResultGiPins
          } else if (this.form.local56GI === '') {
            this.localResult = []
          }
          this.form.local56GI = pst
          this.form.local = this.localResult[0].value
        }
      }
      this.search()
    },
    finddetail() {
      // var param = this.$refs.ref.fdis()
      // this.query.id = param
      // eslint-disable-next-line no-undef
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
          this.simClass = 'simABC'
        } else if (this.form1.lineNo === '5GI') {
          this.localResult = []
          this.simClass = 'gi5Class'
        } else if (this.form1.lineNo === '6GI') {
          this.localResult = []
          this.simClass = 'gi6Class'
        }
      })
      this.form.productionName = ''
      this.form.local = ''
      this.series = []
      this.initChart()
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
        // 图片更新
        if (this.form.local !== '' && this.form.local !== null) {
          this.simClass = 'sim' + this.form.local.toUpperCase()
        } else {
          this.simClass = 'simABC'
        }
        this.pstColor = 'pstColor' + this.form.localSimC.toUpperCase() // c的针对应的位置颜色
      } else if (this.form1.lineNo === '5GI' || this.form1.lineNo === '5GI') {
        if (this.local56GI === '') {
          this.localResult = []
        }
      }
      this.form.startDate = this.dateTime[0]
      this.form.endDate = this.dateTime[1]
      this.form.lineNo = this.form1.lineNo
      var params = {}
      params.number = '0001'
      params.type = this.form1.type
      params.startDate = this.dateTime[0]
      params.endDate = this.dateTime[1]
      params.lineNo = this.form1.lineNo
      params.productionName = this.form.productionName
      if (this.form1.lineNo === 'SIM' && this.form.local === 'c') {
        params.local = this.form.localSimC
      } else {
        params.local = this.form.local
      }
      if (params.endDate === undefined || params.startDate === undefined || params.productionName === '') {
        return
      }
      if (this.form1.lineNo === '5GI' || this.form1.lineNo === '6GI') {
        if (this.form.local56GI !== '' && this.form.local === '') {
          return
        }
      }
      findSxNumber(params).then((res) => {
        this.data = res.data[0]
        this.series = res.data[1]
        // this.min = res.data[2].min
        this.initChart()
      })
    },
    initChart() {
      var unit = ''
      if (this.form.local === 'd') {
        unit = ' °'
      } else if (this.form.local !== null && this.form.local !== '') {
        unit = ' mm'
      }
      if (this.myChart != null) {
        this.myChart.dispose()
      }
      var chartDom = document.getElementById('main')
      this.myChart = echarts.init(chartDom)
      // var app = {};
      var option
      option = {
        color: ['#3CB371', '#00FFFF', '#ff0000', '#FF0000', '#1E90FF', '#FFA500', '#800000', '#1E90FF'],

        title: { text: '量测分离倾向管理图' + '  (单位:' + unit + ')' },
        toolbox: {
          show: false,
          feature: {
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        tooltip: { trigger: 'axis' },
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
            '1-1:C',
            '1-2:C',
            '2-1:C',
            '2-2:C',
            '1-1:D',
            '1-2:D',
            '2-1:D',
            '2-2:D',
            '上限',
            '下限',
            '1-1:C1',
            '1-2:C1',
            '2-1:C1',
            '2-2:C1',
            '1-1:C2',
            '1-2:C2',
            '2-1:C2',
            '2-2:C2',
            '1-1:C3',
            '1-2:C3',
            '2-1:C3',
            '2-2:C3',
            '1-1:C4',
            '1-2:C4',
            '2-1:C4',
            '2-2:C4',
            '1-1:C5',
            '1-2:C5',
            '2-1:C5',
            '2-2:C5',
            '1-1:C6',
            '1-2:C6',
            '2-1:C6',
            '2-2:C6',
            '1-1:C7',
            '1-2:C7',
            '2-1:C7',
            '2-2:C7',
            '1-1:C8',
            '1-2:C8',
            '2-1:C8',
            '2-2:C8',
            '1-1:C9',
            '1-2:C9',
            '2-1:C9',
            '2-2:C9',
            '1-1:C10',
            '1-2:C10',
            '2-1:C10',
            '2-2:C10',
            '1-1:C11',
            '1-2:C11',
            '2-1:C11',
            '2-2:C11',
            '1-1:C12',
            '1-2:C12',
            '2-1:C12',
            '2-2:C12',
            '1-1:C13',
            '1-2:C13',
            '2-1:C13',
            '2-2:C13',
            '1-1:C14',
            '1-2:C14',
            '2-1:C14',
            '2-2:C14',
            '1-1:C15',
            '1-2:C15',
            '2-1:C15',
            '2-2:C15',
            '1-1:C16',
            '1-2:C16',
            '2-1:C16',
            '2-2:C16',
            '1-1:C17',
            '1-2:C17',
            '2-1:C17',
            '2-2:C17',
            '1-1:C19',
            '1-2:C19',
            '2-1:C19',
            '2-2:C19',
            '1-1:C20',
            '1-2:C20',
            '2-1:C20',
            '2-2:C20',
            '1-1:C21',
            '1-2:C21',
            '2-1:C21',
            '2-2:C21',
            '1-1:C23',
            '1-2:C23',
            '2-1:C23',
            '2-2:C23',
            '1-1:C24',
            '1-2:C24',
            '2-1:C24',
            '2-2:C24',
            '1-1:C26',
            '1-2:C26',
            '2-1:C26',
            '2-2:C26',
            '1-1:C28',
            '1-2:C28',
            '2-1:C28',
            '2-2:C28',
            '1-1:C30',
            '1-2:C30',
            '2-1:C30',
            '2-2:C30',
            '1-1:C31',
            '1-2:C31',
            '2-1:C31',
            '2-2:C31',
            '1-1:C35',
            '1-2:C35',
            '2-1:C35',
            '2-2:C35',
            '1-1:C37',
            '1-2:C37',
            '2-1:C37',
            '2-2:C37',
            '1-1:C40',
            '1-2:C40',
            '2-1:C40',
            '2-2:C40',
            '上限',
            '下限',
            '1-毛刺',
            '2-毛刺',
            '3-毛刺',
            '4-毛刺',
            '5-毛刺',
            '1-1:1PIN',
            '2-1:1PIN',
            '3-1:1PIN',
            '4-1:1PIN',
            '5-1:1PIN',
            '1-1:2PIN',
            '2-1:2PIN',
            '3-1:2PIN',
            '4-1:2PIN',
            '5-1:2PIN',
            '1-1:3PIN',
            '2-1:3PIN',
            '3-1:3PIN',
            '4-1:3PIN',
            '5-1:3PIN',
            '1-1:4PIN',
            '2-1:4PIN',
            '3-1:4PIN',
            '4-1:4PIN',
            '5-1:4PIN',
            '1-1:5PIN',
            '2-1:5PIN',
            '3-1:5PIN',
            '4-1:5PIN',
            '5-1:5PIN',
            '1-1:6PIN',
            '2-1:6PIN',
            '3-1:6PIN',
            '4-1:6PIN',
            '5-1:6PIN',
            '1-1:1PIN-2PIN',
            '2-1:1PIN-2PIN',
            '3-1:1PIN-2PIN',
            '4-1:1PIN-2PIN',
            '5-1:1PIN-2PIN',
            '1-1:2PIN-3PIN',
            '2-1:2PIN-3PIN',
            '3-1:2PIN-3PIN',
            '4-1:2PIN-3PIN',
            '5-1:2PIN-3PIN',
            '1-1:3PIN-4PIN',
            '2-1:3PIN-4PIN',
            '3-1:3PIN-4PIN',
            '4-1:3PIN-4PIN',
            '5-1:3PIN-4PIN',
            '1-1:4PIN-5PIN',
            '2-1:4PIN-5PIN',
            '3-1:4PIN-5PIN',
            '4-1:4PIN-5PIN',
            '5-1:4PIN-5PIN',
            '1-1:5PIN-6PIN',
            '2-1:5PIN-6PIN',
            '3-1:5PIN-6PIN',
            '4-1:5PIN-6PIN',
            '5-1:5PIN-6PIN',
            '1-2:1PIN',
            '2-2:1PIN',
            '3-2:1PIN',
            '4-2:1PIN',
            '5-2:1PIN',
            '1-2:2PIN',
            '2-2:2PIN',
            '3-2:2PIN',
            '4-2:2PIN',
            '5-2:2PIN',
            '1-2:3PIN',
            '2-2:3PIN',
            '3-2:3PIN',
            '4-2:3PIN',
            '5-2:3PIN',
            '1-2:4PIN',
            '2-2:4PIN',
            '3-2:4PIN',
            '4-2:4PIN',
            '5-2:4PIN',
            '1-2:5PIN',
            '2-2:5PIN',
            '3-2:5PIN',
            '4-2:5PIN',
            '5-2:5PIN',
            '1-2:6PIN',
            '2-2:6PIN',
            '3-2:6PIN',
            '4-2:6PIN',
            '5-2:6PIN'
          ],
          top: '35px',
          textStyle: {
            fontSize: 20, // 设置legend字体大小 表格名称下一行
            color: '#000000'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          // bottom: '3%',
          top: '100px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.data,
          axisLine: {
            lineStyle: {
              type: 'arrow'
            }
          }
        },
        yAxis: {
          // type: 'value',
          // // min: this.min,
          // axisLabel: {
          // formatter: this.formatter, //4行
          // name: '单位:'+unit,
          //         nameTextStyle: {//字体样式
          //         fontSize: 16,//字体大小
          //         padding: 15 //距离坐标位置的距离
          //       },
          scale: true,
          type: 'value',
          splitNumber: 7,
          boundaryGap: [0.02, 0.02],
          // min: 'dataMin', // 最小值为数据最低线
          // min: this.min,
          axisLabel: {
            // show: true,
            // 内容格式器
            formatter: function(value, index) {
              return value.toFixed(2)
            },
            // formatter: this.formatter,
            splitArea: { show: true },
            textStyle: {
              color: '#',
              fontSize: 20,
              fontWeight: 800
            }
          }
          // max: (value) => {
          //   let num = 10 ** (value.max.toString().length - 2)
          //   return Math.ceil(value.max / num) * num + 3 * num
          // }
          // ↓
          // max: (value) => {
          //   return parseFloat(myMax).toFixed(2)
          // },
          // min: (value) => {
          //   var myMin = value.min - (value.max - value.min) * 0.2
          //   return parseFloat(myMin).toFixed(2)
          // }
        },
        series: this.series
      }
      if (this.form.productionName === '') {
        option.series = []
      }
      this.myChart.setOption(option)
      // if (option && typeof option === 'object') {
      //   myChart.setOption(option)
      // }56GIS.png
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
.simABC {
  background: url(../../../assets/img/sim_abc.png);
  background-repeat: no-repeat;
  background-size: 255px 282px;
  height: 290px;
  width: 260px;
  margin-top: -15%;
}
.simA {
  background: url(../../../assets/img/SIMA.jpg);
  background-repeat: no-repeat;
  background-size: 255px 282px;
  height: 290px;
  width: 260px;
  margin-top: -15%;
}
.simB {
  background: url(../../../assets/img/SIMB.jpg);
  background-repeat: no-repeat;
  background-size: 255px 282px;
  height: 290px;
  width: 260px;
  margin-top: -15%;
}
.simC {
  background: url(../../../assets/img/SIMC.jpg);
  background-repeat: no-repeat;
  background-size: 255px 282px;
  height: 290px;
  width: 260px;
  margin-top: -15%;
}
.simCDtl {
  background: url(../../../assets/img/c21.png);
  background-repeat: no-repeat;
  background-size: 255px 282px;
  height: 290px;
  width: 260px;
  position: absolute;
  left: 65%;
  top: 42%;
}
.gi5Class {
  background: url(../../../assets/img/LF_5GI.png);
  background-repeat: no-repeat;
  background-size: 60% 95%;
  height: 224px;
  width: 116px;
  margin-top: -15%;
  margin-left: 12.5%;
}
.gi6Class {
  background: url(../../../assets/img/LF_6GI.png);
  background-repeat: no-repeat;
  background-size: 60% 95%;
  height: 224px;
  width: 116px;
  margin-top: -15%;
  margin-left: 12.5%;
}
.giDtl {
  background: url(../../../assets/img/56GI_PST.png);
  background-repeat: no-repeat;
  background-size: 255px 282px;
  height: 290px;
  width: 260px;
  position: absolute;
  left: 65%;
  top: 300px;
}
.gi5Dtl {
  background: url(../../../assets/img/5GI_PST.png);
  background-repeat: no-repeat;
  background-size: 255px 282px;
  height: 290px;
  width: 260px;
  position: absolute;
  left: 65%;
  top: 300px;
}
.gi6Dtl {
  background: url(../../../assets/img/6GI_PST.png);
  background-repeat: no-repeat;
  background-size: 255px 282px;
  height: 290px;
  width: 260px;
  position: absolute;
  left: 65%;
  top: 300px;
}
.sxAll {
  height: 100%;
  width: 28%;
  position: relative;
  margin-top: -18%;
  margin-left: 0%;
}
.sxAClass {
  height: 174px;
  width: 220px;
  position: absolute;
}
.sxBClass {
  height: 174px;
  width: 220px;
  left: 260px;
  position: absolute;
}
.sxCClass {
  height: 156px;
  width: 256px;
  position: absolute;
  top: 200px;
}
.sxDClass {
  height: 70px;
  width: 260px;
  position: absolute;
  top: 243px;
  left: 260px;
}
.sxAImg {
  background: url(../../../assets/img/sxA.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 100%;
  width: 100%;
}
.sxBImg {
  background: url(../../../assets/img/sxB.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 100%;
  width: 100%;
}
.sxCImg {
  background: url(../../../assets/img/sxC.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 100%;
  width: 100%;
}
.sxDImg {
  background: url(../../../assets/img/sxD.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 100%;
  width: 100%;
}
.blkBg {
  background-color: #0b1d2c;
}
.grnBg {
  background-color: #43ca17;
}
.simAPST {
  width: 7%;
  height: 17%;
  position: absolute;
}
.simBPST {
  width: 7%;
  height: 17%;
  position: absolute;
  margin-left: 8%;
}
.simCPST {
  width: 10%;
  height: 15%;
  position: absolute;
  margin-top: 9%;
  margin-left: 2.5%;
}
.burrPST {
  width: 32%;
  height: 50%;
  position: absolute;
  left: 64%;
  top: 44%;
}
.pinPST {
  width: 40%;
  height: 40%;
  position: absolute;
  margin-left: 60%;
}
.pinf2fPST {
  width: 46%;
  height: 42%;
  position: absolute;
  margin-top: -2%;
  left: 6%;
}
.pinsPST {
  width: 40%;
  height: 50%;
  position: absolute;
  margin-left: 8%;
  margin-top: 50%;
}
.gi56Border {
  border: 5px solid #43ca17;
}
.simdtlText {
  top: 80%;
  width: 100%;
  height: 20%;
  position: absolute;
  text-align: center;
  line-height: 55px;
  color: #43ca17;
  font-size: xx-large;
}
.pstColorC1 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 12%;
  top: 73%;
  background-color: #43ca17;
}
.pstColorC2 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 16%;
  top: 73%;
  background-color: #43ca17;
}
.pstColorC3 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 20%;
  top: 73%;
  background-color: #43ca17;
}
.pstColorC4 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 24%;
  top: 73%;
  background-color: #43ca17;
}
.pstColorC5 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 28%;
  top: 73%;
  background-color: #43ca17;
}
.pstColorC6 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 31%;
  top: 73%;
  background-color: #43ca17;
}
.pstColorC7 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 35%;
  top: 73%;
  background-color: #43ca17;
}
.pstColorC8 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 39%;
  top: 73%;
  background-color: #43ca17;
}
.pstColorC9 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 43%;
  top: 73%;
  background-color: #43ca17;
}
.pstColorC10 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 46%;
  top: 73%;
  background-color: #43ca17;
}
.pstColorC11 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 50%;
  top: 73%;
  background-color: #43ca17;
}
.pstColorC12 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 54%;
  top: 73%;
  background-color: #43ca17;
}
.pstColorC13 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 58%;
  top: 73%;
  background-color: #43ca17;
}
.pstColorC14 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 62%;
  top: 73%;
  background-color: #43ca17;
}
.pstColorC15 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 65%;
  top: 73%;
  background-color: #43ca17;
}
.pstColorC16 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 69%;
  top: 73%;
  background-color: #43ca17;
}
.pstColorC17 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 73%;
  top: 73%;
  background-color: #43ca17;
}
.pstColorC19 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 80%;
  top: 73%;
  background-color: #43ca17;
}
.pstColorC20 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 84%;
  top: 73%;
  background-color: #43ca17;
}
.pstColorC21 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 84%;
  top: 12%;
  background-color: #43ca17;
}
.pstColorC23 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 77%;
  top: 12%;
  background-color: #43ca17;
}
.pstColorC24 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 72%;
  top: 12%;
  background-color: #43ca17;
}
.pstColorC26 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 65%;
  top: 12%;
  background-color: #43ca17;
}
.pstColorC28 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 57%;
  top: 12%;
  background-color: #43ca17;
}
.pstColorC30 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 50%;
  top: 12%;
  background-color: #43ca17;
}
.pstColorC31 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 46%;
  top: 12%;
  background-color: #43ca17;
}
.pstColorC35 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 31%;
  top: 12%;
  background-color: #43ca17;
}
.pstColorC37 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 24%;
  top: 12%;
  background-color: #43ca17;
}
.pstColorC40 {
  position: absolute;
  width: 3%;
  height: 9%;
  left: 12%;
  top: 12%;
  background-color: #43ca17;
}
</style>
