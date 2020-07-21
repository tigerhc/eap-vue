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
    <template v-for="(tempName, index) in otherTempsTitles">
      <el-button
        :key="tempName"
        type="primary"
        icon="el-icon-arrow-right"
        style="margin:5px;"
        @click="loadTempDataPart(tempName, index)"> {{ tempName.replace("PV","") }}
      </el-button>
    </template>
<!--   <ul>
      <li v-for="(item,index) in otherTempsTitles" >{{item}}</li>
    </ul>- -->
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
      otherTempsValue: [],
      list: [],
      source: [],
      chart: undefined
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
            this.otherTempsValue = data.results[0]
            const a = title.split(',')
            this.otherTempsTitles = a
            this.source = data.results
            this.initChart()
            console.log('this.otherTempsTitles', this.otherTempsTitles)
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
    initChart(lastName = '无') {
      this.chart = echarts.init(document.getElementById('tempChart'))
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
            name: '湿度现在值',
            type: 'bar',
            barGap: 0,
            label: {
              formatter: '{c}  {name|{a}}'
            }
            // barWidth: 10
          },
          {
            name: '湿度SET',
            type: 'bar',
            barGap: 0
            // barWidth: 10
          },
          {
            name: '湿度MIN',
            type: 'line',
            yAxisIndex: 1
          },
          {
            name: '湿度MAX',
            type: 'line',
            yAxisIndex: 1
          },
          {
            name: lastName,
            type: 'line',
            yAxisIndex: 1
          }
        ],

        dataset: {
          dimensions: ['create_date', 'temp_pv', 'temp_min', 'temp_sp', 'temp_max', 'otherValue'],
          source: this.source
        }
      }
      this.chart.setOption(option, true)
    },
    loadTempDataPart(name, index) {
      const { source } = this
      this.source = source.map(data => {
        var values = data.other_temps_value.split(',')
        return { ...data, otherValue: values[index] }
      })
      this.initChart(name)
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

  ul {
    margin: 0;
    padding: 0;
    height: 50px;
  }
  li {
    cursor: pointer;
    box-sizing: border-box;
    height: 50px;
    width: 150px;
    list-style: none;
    text-align: center;
    line-height: 50px;
    float: left;
    border-right:1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
</style>
<style>
</style>
