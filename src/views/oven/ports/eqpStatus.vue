<template>

  <div class="Rtplotyieldday">
    <el-form ref="form" :model="form" :inline="true" class="form" label-width="90px" size="small">
      <el-row>
        <el-col :span="4">
          <el-form-item label="设备" prop="station_code">
            <el-select v-model="form.station_code" :multiple="true" filterable placeholder="请选择" >
              <el-option
                v-for="item in list3"
                :key="item.id"
                :label="item.id"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="日期" prop="dateTime">
            <el-date-picker v-model="form.dateTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
        <el-button type="primary" @click="serch">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <div id="eqpChart" style="width: 95%;height: 600px;overflow: hidden;"/>
  </div>
</template>
<script>
import echarts from 'echarts'
import { eqpStateTime } from '@/api/public'
import { eqpIdlist } from '@/api/oven/temperature'
export default {
  name: 'WTableButton',
  props: {},
  data: function() {
    return {
      list: [
        {
          id: 'T01',
          position: 'absolute',
          backgroundColor: 'limegreen',
          border: '4px,solid,green',
          fontSize: '25px',
          textAlign: 'center',
          lineHeight: '110px',
          height: '110px',
          width: '8.5%',
          top: '25.5%',
          left: '23.2%'
        }
      ],
      form: {
        lineNo: undefined,
        dateTime: [],
        station_code: [],
        value: []
      },
      noList: [{
        value: 'SIM-WB-3B',
        label: 'SIM-WB-3B'
      }],
      list2: [],
      list3: [],
      title: [],
      componentKey: 0
    }
  },
  mounted() {
  },
  created() {
    eqpIdlist().then((response) => {
      this.list3 = response.data.results
    })
  },
  methods: {
    serch() {
      var params = this.form.station_code.join(',')
      this.$refs['form'].validate((valid) => {
        if (valid) {
          eqpStateTime({
            startTime: this.form.dateTime[0],
            endTime: this.form.dateTime[1],
            eqpId: params
          }).then((res) => {
            const data = res.data
            this.list2 = data
            this.getviewbystation()
          })
        }
      })
    },
    find() {
      this.list[0]['backgroundColor'] = 'red'
    },
    forceRerender() {
      this.componentKey += 1
    },
    getviewbystation() {
      var myChart = echarts.init(document.getElementById('eqpChart'))
      var colors = ['#32CD32', '#B22222',	'#FFA500']
      var state = ['正常', '故障', '等待']

      var option = {
        color: colors,
        tooltip: {
          formatter: function(params) {
            return params.name + ':' + params.value[1] + '~' + params.value[2]
          }
        },
        legend: {
          data: state,
          bottom: '1%',
          selectedMode: false,
          textStyle: {
            color: '#000'
          }
        },
        grid: {// 绘图网格
          left: '3%',
          right: '3%',
          top: '1%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: { type: 'time', interval: 3600 * 12 * 1000, axisLabel: { formatter: function(value) { var date = new Date(value); return getzf(date.getHours()) + ':' + getzf(date.getMinutes()) + '\n' + (date.getMonth() + 1) + '-' + date.getDate() + ' '; function getzf(num) { if (parseInt(num) < 10) { num = '0' + num } return num } } }
        },
        yAxis: {
          data: this.form.station_code
        },
        series: [
          { name: state[0], type: 'bar', data: [] },
          { name: state[1], type: 'bar', data: [] },
          { name: state[2], type: 'bar', data: [] },
          {
            type: 'custom', renderItem: function(params, api) { // 开发者自定义的图形元素渲染逻辑，是通过书写 renderItem 函数实现的
              var categoryIndex = api.value(0)// 这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值。
              var start = api.coord([api.value(1), categoryIndex]) // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值。
              var end = api.coord([api.value(2), categoryIndex])
              var height = 60// 柱体宽度

              return {
                type: 'rect',
                shape: echarts.graphic.clipRectByRect({
                  x: start[0],
                  y: start[1] - height / 2,
                  width: end[0] - start[0],
                  height: height
                }, {
                  x: params.coordSys.x,
                  y: params.coordSys.y,
                  width: params.coordSys.width,
                  height: params.coordSys.height
                }),
                style: api.style()
              }
            },
            encode: {
              x: [1, 2],
              y: 0
            },
            data: this.list2
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
  .Rtplotyieldday {
    width: auto;
    height: auto;
    margin: 0 auto;

    .form {
      margin-top: 20px;
    }
  }
</style>
