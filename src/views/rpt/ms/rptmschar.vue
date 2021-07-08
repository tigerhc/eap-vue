<template>
  <div class="rtpmschar">
    <el-form ref="form" :model="form" :inline="true" :rules="formRules" class="form" label-width="90px" size="small">
      <el-row>
        <el-form-item prop="eqpId">
          <w-select-eqp
            :str="form.eqpId"
            :multiple="false"
            :disabled="false"
            param="MS"
            @input="onValueChange($event)"
          />
        </el-form-item>
        <el-form-item prop="productionNo">
          <el-select v-model="form.productionNo" multiple filterable placeholder="请选择类型">
            <el-option v-for="item in noList" :key="item.id" :label="item.productionNo" :value="item.productionNo" />
          </el-select>
          <!--            <w-select :str="form.productionNo" :multiple="true" :disabled="false" @input="onNoChange($event)"/>-->
        </el-form-item>
        <el-form-item prop="dateTime">
          <el-date-picker
            v-model="form.dateTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-button type="primary" @click="serch">查询</el-button>
      </el-row>
    </el-form>
    <div class="model">
      <el-tabs v-model="editableTabsValue" type="card" @tab-click="handleClick">
        <el-tab-pane v-for="item in editableTabs" :key="item.title" :label="item.title" :name="item.title">
          <!--        {{ item.content }}-->
        </el-tab-pane>
      </el-tabs>
      <div id="yieldDayChart" style="width: 100%; height: 500px; overflow: hidden" />
    </div>
  </div>
</template>
<script>
import request from '@/utils/request'
import * as echarts from 'echarts'

export default {
  name: 'Rtpmschar',
  components: {},
  data() {
    return {
      editableTabsValue: 0,
      editableTabs: [],
      noList: [],
      form: {
        eqpId: undefined,
        productionNo: [],
        dateTime: []
      },
      formRules: {
        eqpId: [{ required: true, message: '请选择设备！', trigger: 'change' }],
        productionNo: [{ required: true, message: '请选择类型！', trigger: 'change' }],
        dateTime: [{ required: true, message: '请选择时间！', trigger: 'change' }]
      },
      list: [], // 数据格式 [{"name":"", "min":"", "max":"",  data :["xdata":[], "ydata": []]}]
      colors: ['#2db7f5', '#ff1815', '#c012c6']
    }
  },
  mounted() {
    var now = new Date()
    var endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10)
    var startDate = endDate.slice(0, 8) + '01'
    this.form.dateTime = [startDate, endDate]
  },
  created() {},
  methods: {
    handleClick(tab, event) {
      this.initChart(tab.index)
    },
    onNoChange(v) {
      this.form.productionNo = v
    },
    onValueChange(name) {
      this.form.eqpId = name
      request({
        url: 'ms/msmeasureconfig/listProByEqp/' + this.form.eqpId,
        method: 'get'
      }).then((response) => {
        const rs = response.data
        this.noList = rs || []
        // this.productionNo = rss.split(',')
      })
    },
    serch() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          request({
            url: 'ms/msmeasurerecord/rptmsrecordbytime/' + this.form.eqpId,
            method: 'get',
            params: {
              beginTime: this.form.dateTime[0],
              endTime: this.form.dateTime[1],
              productionNo: this.form.productionNo.join(',')
            }
          }).then((response) => {
            const results = response.data.results
            this.list = []
            this.editableTabs.splice(0, this.editableTabs.length)
            if (results && results.length > 0) {
              for (let i = 0; i < results.length; i++) {
                const heads = results[i].item_name
                const vs = results[i].item_value
                const head = heads.split(',')
                const rs = vs.split(',')
                const date = results[i].create_date
                if (i === 0) {
                  const min = results[i].limit_min
                  const max = results[i].limit_max
                  this.groupData(date, head, rs, min.split(','), max.split(','), 1)
                } else {
                  const min = results[i].limit_min
                  const max = results[i].limit_max
                  this.groupData(date, head, rs, min.split(','), max.split(','), 0)
                }
              }
            }
            console.log(results)
            console.log(this.list)
            if (this.list.length > 0) {
              this.initChart(0)
            }
          })
        }
      })
    },
    groupData(date, head, rs, min, max, flag) {
      for (let i = 0; i < head.length; i++) {
        const g = this.list.filter((h) => h.name === head[i])
        if (g.length <= 0) {
          const t = {}
          t.title = head[i]
          t.name = head[i]
          this.editableTabs.push(t)
          if (flag && i === 0) {
            this.editableTabsValue = head[0]
          }
          const g = {}
          g.min = min[i]
          g.max = max[i]
          g.name = head[i]
          g.xdata = []
          g.ydata = []
          g.xdata.push(date)
          g.ydata.push(rs[i])
          this.list.push(g)
        } else {
          g[0].xdata.push(date)
          g[0].ydata.push(rs[i])
        }
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
    initChart(index) {
      const item = this.list[index]
      var chart = document.getElementById('yieldDayChart')
      var yieldDayChart = echarts.init(chart)
      const option = {
        // title: {
        //   text: 'SIM日产量分析'
        //
        //   // padding: [20, 20]
        // },
        // color: ['#003366', '#FFA500', '#003366', '#FFA500'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        // title: {
        //   text: '未来一周气温变化',
        //   subtext: '纯属虚构'
        // },
        legend: {
          orient: 'vertical',
          x: 'right', // 可设定图例在左、右、居中
          y: 'center', // 可设定图例在上、下、居中
          data: [item.name, '上限(UCL)', '下限(LCL)']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: item.xdata
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: item.name,
            type: 'line',
            symbol: 'circle',
            symbolSize: 20,
            lineStyle: {
              color: 'green',
              width: 3
            },
            itemStyle: {
              borderWidth: 2,
              borderColor: 'yellow',
              color: 'blue'
            },
            data: item.ydata,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            }
          },
          {
            name: '上限(UCL)',
            type: 'line',
            markLine: {
              data: [
                {
                  name: '上限(UCL)',
                  yAxis: item.max
                }
              ]
            }
          },
          {
            name: '下限(LCL)',
            type: 'line',
            markLine: {
              data: [
                {
                  name: '下限(LCL)',
                  yAxis: item.min
                }
              ]
            }
          }
        ]
      }
      yieldDayChart.setOption(option, true)
    }
  }
}
</script>
<style lang="scss" scoped>
.rtpmschar {
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
