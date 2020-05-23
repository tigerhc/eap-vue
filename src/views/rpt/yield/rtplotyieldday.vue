<template>
  <div class="Rtplotyieldday">
    <el-form
      ref="form"
      :model="form"
      :inline="true"
      :rules="formRules"
      class="form"
      label-width="90px"
      size="small"
    >
      <el-row>
        <el-col :span="9">
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

        <el-button type="primary" @click="serch">查询</el-button>
      </el-row>
    </el-form>
    <div v-show="showFlag2" id="eqpsoee" style="width: 800px;height: 600px;overflow: hidden;"/>
  </div>
</template>
<script>
import { rtplotyieldday } from '@/api/public'
import echarts from 'echarts'
import WSelectEqp from '../../../components/eap-select-eqp/index'

export default {
  name: 'Rtplotyieldday',
  components: {
    WSelectEqp
  },
  data() {
    return {
      form: {
        dateTime: [],
        eqpId: ''
      },
      eqpNameList: [],
      list: [],
      list2: [],
      runlist: [],
      idlelist: [],
      downlist: [],
      showFlag: false,
      showFlag2: true,
      yAxis: [],
      formRules: {
        dateTime: [{ required: true, message: '请选择时间！', trigger: 'change' }]
      }
    }
  },
  mounted() {
    // var now = new Date();

    // var startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10);
    // alert(startDate)
    // this.form.dateTime[0] = startDate

  },
  created() {
    this.onValueChange()
  },
  methods: {
    serch() {
      // console('eqpNameList->' + this.eqpNameList)
      // SIM-DM1,SIM-DM2
      this.$refs['form'].validate((valid) => {
        if (valid) {
          rtplotyieldday({
            beginTime: this.form.dateTime[0],
            endTime: this.form.dateTime[1],
            eqpId: this.form.eqpId,
            lineNo: 'SIM'
          }).then((res) => {
            const data = res.data
            this.list = data.yield
            this.initChatrs2()
          })
        }
      })
    },
    onValueChange(data) {
      this.eqpNameList = data
      if (data == null || data === undefined || data.length <= 0) {
        this.form.eqpId = ''
      } else {
        this.form.eqpId = data.join(',')
      }
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
    getDiffDate(start, end) {
      var startTime = this.getDate(start)
      var endTime = this.getDate(end)
      var dateArr = []
      while ((endTime.getTime() - startTime.getTime()) > 0) {
        var year = startTime.getFullYear()
        var month = startTime.getMonth().toString().length === 1 ? '0' + (parseInt(startTime.getMonth().toString(), 10) + 1) : (startTime.getMonth() + 1)
        var day = startTime.getDate().toString().length === 1 ? '0' + startTime.getDate() : startTime.getDate()
        dateArr.push(year + '-' + month + '-' + day)
        startTime.setDate(startTime.getDate() + 1)
      }
      return dateArr
    },
    groupPieSeries() {
      this.runlist = []
      this.idlelist = []
      this.downlist = []
      this.yAxis = []
      for (let i = 0; i < this.list2.length; i++) {
        this.yAxis.push(this.list2[i].eqpId)
        this.runlist.push(this.list2[i].runTime)
        this.idlelist.push(this.list2[i].idleTime)
        this.downlist.push(this.list2[i].downTime)
      }
    },
    initChatrs2() {
      this.groupPieSeries()
      // var timelist = this.getDiffDate(this.form.dateTime[0], this.form.dateTime[1])
      var ec = document.getElementById('eqpsoee')
      var myChart = echarts.init(ec)
      const option = {
        title: {
          text: 'SIM日产量分析'

          // padding: [20, 20]
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
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
          data: ['MES产量', '设备产量', 'MES达标率', '设备达标率']
        },
        xAxis: [
          {
            type: 'category',
            data: [
              '0505',
              '0506',
              '0507',
              '0508',
              '0509',
              '0511',
              '0512',
              '0513',
              '0514',
              '0515',
              '0518',
              '0519',
              '0520'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '日产量',
            min: 0,
            max: 60000,
            interval: 6000,
            axisLabel: {
              formatter: '{value} K'
            }
          },
          {
            type: 'value',
            name: '完成率',
            min: 0,
            max: 150,
            interval: 5,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: 'MES产量',
            type: 'bar',
            barWidth: 10,
            data: [
              10400,
              4400,
              13090,
              13742,
              13034,
              26103,
              24103,
              24103,
              26740,
              26883,
              49421,
              44203,
              45342
            ]
          },
          {
            name: '设备产量',
            type: 'bar',
            barWidth: 10,
            data: [
              10435,
              4418,
              13117,
              13762,
              13108,
              26451,
              24451,
              24451,
              27398,
              27630,
              50639,
              46187,
              46187
            ]
          },
          {
            name: 'MES达标率',
            type: 'line',
            yAxisIndex: 1,
            data: [
              35.08,
              29.42,
              87.51,
              91.87,
              87.14,
              87.25,
              80.57,
              80.57,
              89.38,
              134.79,
              90.11,
              88.65,
              90.94
            ]
          },
          {
            name: '设备达标率',
            type: 'line',
            yAxisIndex: 1,
            data: [
              35.20,
              29.54,
              87.69,
              92.00,
              87.63,
              88.42,
              81.73,
              81.73,
              91.58,
              138.54,
              92.33,
              92.63,
              92.63
            ]
          }
        ]
      }
      myChart.setOption(option, true)
    }
  }
}
</script>
<style lang="scss" scoped>
  .Rtplotyieldday {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    .form {
      margin-top: 20px;
    }
  }
</style>
<style >
</style>
