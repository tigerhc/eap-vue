<template>
  <div class="tempchar">
    <el-form ref="form" :model="form" :inline="true" :rules="formRules" class="form" label-width="90px" size="small">
      <el-row>
        <el-form-item label="设备号" prop="eqpId">
          <w-select-eqp :span="8" :str="form.eqpId" :multiple="false" :disabled="false" @input="onValueChange($event)"/>
        </el-form-item>
        <el-col :span="9">
          <el-form-item label="日期" prop="dateTime">
            <el-date-picker v-model="form.dateTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"/>
          </el-form-item>
        </el-col>
        <el-button type="primary" @click="serch">查询</el-button>
      </el-row>
    </el-form>

    <el-button
      v-for="tempName in otherTempsTitles"
      v-if="tempName.indexOf('PV') != -1"
      :key="tempName"
      type="primary"
      icon="el-icon-arrow-right"
      style="margin:5px;"
      @click="loadTempDataPart(tempName)"> {{ tempName.replace("PV","") }}
    </el-button>
    <div id="tempChart" style="width: 100%;height: 500px;overflow: hidden;"/>
  </div>
</template>
<script>
import { tempbytime } from '@/api/public'
import echarts from 'echarts'

export default {
  name: 'Tempchar',
  components: {},
  data() {
    return {
      form: {
        eqpId: undefined,
        dateTime: []
      },
      formRules: {
        eqpId: [{ required: true, message: '请选择设备！', trigger: 'change' }],
        dateTime: [{ required: true, message: '请选择时间！', trigger: 'change' }]
      },
      otherTempsTitles: [],
      list: [],
      source: []
    }
  },
  mounted() {
    var now = new Date()
    var endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10)
    var startDate = endDate.slice(0, 8) + '01'
    this.form.dateTime = [startDate, endDate]
  },
  created() {
  },
  methods: {
    onValueChange(name) {
      this.form.eqpId = name
    },
    serch() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          tempbytime(this.form.eqpId, {
            beginTime: this.form.dateTime[0],
            endTime: this.form.dateTime[1]
          }).then((res) => {
            const data = res.data
            var title = data.title
            this.otherTempsTitles = title.split(',')
            this.source = data.results
            this.initChart()
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
    initChart() {
      var chart = document.getElementById('tempChart')
      var tempChart = echarts.init(chart)
      const option = {
        // title: {
        //   text: 'SIM日产量分析'
        //
        //   // padding: [20, 20]
        // },
        color: ['#003366', '#FFA500', '#003366', '#FFA500'],
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
            // max: 60000,
            // interval: 6000,
            axisLabel: {
              formatter: '{value} K'
            }
          },
          {
            type: 'value',
            name: '完成率',
            min: 0,
            // max: 150,
            // interval: 5,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: 'MES产量',
            type: 'bar',
            barGap: 0,
            label: {
              formatter: '{c}  {name|{a}}'
            }
            // barWidth: 10
          },
          {
            name: '设备产量',
            type: 'bar',
            barGap: 0
            // barWidth: 10
          },
          {
            name: 'MES达标率',
            type: 'line',
            yAxisIndex: 1
          },
          {
            name: '设备达标率',
            type: 'line',
            yAxisIndex: 1
          }
        ],
        dataset: {
          dimensions: ['create_date', 'temp_pv', 'temp_min', 'temp_sp', 'temp_max'],
          source: this.source
        }
      }
      tempChart.setOption(option, true)
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
