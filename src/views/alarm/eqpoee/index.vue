<template>
  <div class="Eqpoee">
    <el-form ref="form" :model="form" :inline="true" :rules="formRules" class="form" label-width="90px" size="small">
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
        <el-col :span="8">
          <el-form-item label="设备号" prop="eqpId">
            <w-select-eqp :span="8" :str="form.eqpId" :disabled="false" @input="onValueChange($event)" />
          </el-form-item>
        </el-col>
        <el-button type="primary" @click="serch">查询</el-button>
      </el-row>
    </el-form>
    <alarm-cake
      v-if="showFlag"
      id="eqpoee"
      ref="AlarmCake"
      :begin-time="form.dateTime[0]"
      :end-time="form.dateTime[1]"
      :list="list"
    />
    <div v-show="showFlag2" id="eqpsoee" style="width: 1000px; height: 600px; overflow: hidden" />
  </div>
</template>
<script>
import AlarmCake from '@/components/Charts/alarmCake'
import { rpteqpstateday } from '@/api/public'
import * as echarts from 'echarts'
import WSelectEqp from '../../../components/eap-select-eqp/index'

export default {
  name: 'Eqpoee',
  components: {
    WSelectEqp,
    AlarmCake
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
      otherlist: [],
      showFlag: false,
      showFlag2: true,
      yAxis: [],
      formRules: {
        dateTime: [{ required: true, message: '请选择时间！', trigger: 'change' }],
        eqpId: [{ required: true, message: '请选择设备号！', trigger: 'change' }]
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
          rpteqpstateday({
            beginTime: this.form.dateTime[0],
            endTime: this.form.dateTime[1],
            eqpId: this.form.eqpId
          }).then((res) => {
            const data = res.data
            this.list = data.eqpOee
            this.list2 = data.eqpsOee
            if (this.list2 && this.list2.length > 1) {
              this.showFlag2 = true
              this.showFlag = false
              this.initChatrs2()
            } else {
              this.showFlag = true
              this.showFlag2 = false
            }
          })
        }
      })
    },
    onValueChange(data) {
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
      while (endTime.getTime() - startTime.getTime() > 0) {
        var year = startTime.getFullYear()
        var month =
          startTime.getMonth().toString().length === 1
            ? '0' + (parseInt(startTime.getMonth().toString(), 10) + 1)
            : startTime.getMonth() + 1
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
      this.otherlist = []
      for (let i = 0; i < this.list2.length; i++) {
        this.yAxis.push(this.list2[i].eqpId)
        this.runlist.push(this.list2[i].runTime)
        this.idlelist.push(this.list2[i].idleTime)
        this.downlist.push(this.list2[i].downTime)
        this.otherlist.push(this.list2[i].otherTime)
      }
    },
    initChatrs2() {
      this.groupPieSeries()
      // var timelist = this.getDiffDate(this.form.dateTime[0], this.form.dateTime[1])
      var ec = document.getElementById('eqpsoee')
      var myChart = echarts.init(ec)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['RUN', 'IDLE', 'DOWN', 'OTHER']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: this.yAxis
        },
        textStyle: {
          color: '#777AAA'
        },
        series: [
          {
            name: 'RUN',
            type: 'bar',
            stack: '总量',
            label: {
              show: true,
              position: 'inside'
            },
            itemStyle: {
              color: function(params) {
                return '#43ca17'
              }
            },
            data: this.runlist
          },
          {
            name: 'IDLE',
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              position: 'insideRight'
            },
            itemStyle: {
              color: function(params) {
                return '#FFFF00'
              }
            },
            data: this.idlelist
          },
          {
            name: 'DOWN',
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              position: 'insideRight'
            },
            itemStyle: {
              color: function(params) {
                return '#FF0000'
              }
            },
            data: this.downlist
          },
          {
            name: 'OTHER',
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              position: 'insideleft'
            },
            itemStyle: {
              color: function(params) {
                return '#808080'
              }
            },
            data: this.otherlist
          }
        ]
      }
      myChart.setOption(option, true)
    }
  }
}
</script>
<style lang="scss" scoped>
.Eqpoee {
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
