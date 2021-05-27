<template>
  <div class="hisDatas">
    <el-card>
      <div class="search">
        <div class="search-item">
          <label for="">设备：</label>
          <el-select v-model="eqpV" placeholder="请选择设备">
            <el-option v-for="item in eqpO" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="search-item">
          <label for="">传感器：</label>
          <el-select v-model="sensorV" placeholder="请选择传感器">
            <el-option v-for="item in sensorO" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="search-item">
          <label for="">示数类型：</label>
          <el-select v-model="indicationV" placeholder="请选择示数类型" multiple>
            <el-option v-for="item in indicationO" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="search-item">
          <label for="">时间：</label>
          <el-date-picker
            v-model="timeV"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="getTimeV()"
          />
        </div>
        <div class="search-item">
          <el-button type="primary">查询</el-button>
        </div>
      </div>
      <div id="myChart" />
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="总数据" name="first">
          <el-table v-loading="isLoading" :data="totalDatas" style="width: 100%">
            <el-table-column prop="eqp_id" label="设备编号" />
            <el-table-column prop="collect_date" label="采集时间" />
            <el-table-column prop="this_num" label="本次示数" />
            <el-table-column prop="num_multiple" label="计数比" />
            <el-table-column prop="num_type" label="示数类型" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="异常数据" name="second">
          <el-table v-loading="abnormaLoading" :data="abnormalDatas" style="width: 100%">
            <el-table-column prop="eqp_id" label="设备编号" />
            <el-table-column prop="collect_date" label="采集时间" />
            <el-table-column prop="this_num" label="本次示数" />
            <el-table-column prop="num_multiple" label="计数比" />
            <el-table-column prop="num_type" label="示数类型" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { fetchDict } from '@/api/sys/dict.js'
export default {
  components: {},
  data() {
    return {
      isLoading: false,
      abnormaLoading: false,
      timeV: '', // 时间
      eqpV: '', // 设备
      sensorV: '', // 传感器
      indicationV: '', // 示数类型
      eqpO: [], // 设备数据源
      sensorO: [], // 传感器数据源
      indicationO: [], // 示数类型数据源
      surveyCharts: '',
      chartO: [],
      activeName: 'first',
      // 总数居源
      totalDatas: [],
      // 异常数据源
      abnormalDatas: [
        {
          eqp_id: '12314',
          collect_date: '2021-03-05 14:00:00',
          this_num: 'asdsa',
          num_multiple: '12',
          num_type: '温度'
        }
      ],
      datas: [
        {
          name: '温度',
          type: 'line',

          data: [36, 35, 40, 42, 50, 30, 35]
        },
        {
          name: '湿度',
          type: 'line',

          data: [30, 35, 40, 50, 46, 55, 60]
        },
        {
          name: '风速',
          type: 'line',
          data: [20, 30, 25, 36, 40, 37, 37]
        },
        {
          name: '电表（正向有功）',
          type: 'line',
          data: [50, 40, 55, 30, 35, 27, 39]
        },
        {
          name: '电表（正向无功）',
          type: 'line',
          data: [30, 45, 37, 50, 47, 29, 40]
        }
      ],
      color: ['#5470C6', '#91CC75', '#FCD887', '#EE6666', '#73C0DE']
    }
  },
  mounted() {
    this.getTimeV()
    // 获取示数类型数据源
    fetchDict('NUM_TYPE').then((response) => {
      this.indicationO = response.data
      this.indicationO.forEach((item) => {
        this.chartO.push(item.label)
      })
      this.chart()
    })
    console.log(this.datas[0])
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    getTimeV() {
      // console.log(this.timeV)
    },
    chart() {
      var chartDom = document.getElementById('myChart')
      var mycharts = echarts.init(chartDom)
      var option

      option = {
        yAxis: [
          {
            name: '温度',
            type: 'value',
            axisLine: {
              show: true,
              lineStyle: {
                color: this.color[0],
                width: 2
              }
            },
            axisLabel: {
              formatter: '{value}℃'
            },
            splitLine: {
              show: true, // 想要不显示网格线，改为false
              lineStyle: {
                // 设置网格为虚线
                type: 'dashed'
              }
            }
          },
          {
            name: '湿度',
            axisTick: {
              inside: true
            },
            axisLabel: {
              inside: true,
              formatter: '{value}%'
            },
            type: 'value',
            axisLine: {
              show: true,
              lineStyle: {
                color: this.color[1],
                width: 2
              }
            },
            splitLine: {
              show: false
            },
            // 设置坐标轴偏移位置
            offset: -1100
          },
          {
            name: '风速',
            axisTick: {
              inside: true
            },
            axisLabel: {
              inside: true,
              formatter: '{value}km/h'
            },
            type: 'value',
            axisLine: {
              show: true,
              lineStyle: {
                color: this.color[2],
                width: 2
              }
            },
            offset: -1170,
            splitLine: {
              show: false // 想要不显示网格线，改为false
            }
          },
          {
            name: '电表（正向有功）',
            type: 'value',
            axisLine: {
              show: true,
              lineStyle: {
                color: this.color[3],
                width: 2
              }
            },
            axisLabel: {
              formatter: '{value}KW'
            },
            splitLine: {
              show: false // 想要不显示网格线，改为false
            }
          },
          {
            name: '电表（正向无功）',
            type: 'value',
            offset: 100,
            axisLabel: {
              formatter: '{value}KW'
            },

            axisLine: {
              show: true,
              lineStyle: {
                color: this.color[4],
                width: 2
              }
            },
            splitLine: {
              show: false // 想要不显示网格线，改为false
            }
          }
        ],
        // 调整表格两边空白的区域
        grid: {
          y: '20%',
          // 左侧
          x: '20%',
          // 右侧
          x2: '20%'
        },
        xAxis: {
          // name: '时间',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          },
          splitArea: { show: true }
        },
        series: [
          {
            // 曲线数据配置
            data: this.datas[0].data,
            // 曲线名
            name: '温度',
            // 设置参数对应的y坐标轴的索引
            type: 'line',
            // 曲线平滑设置
            smooth: true
          },
          {
            data: this.datas[1].data,
            // 曲线名
            name: '湿度',
            // 设置所在曲线对应的y坐标轴的索引
            yAxisIndex: 1,
            type: 'line',
            // 曲线平滑设置
            smooth: true
          },
          {
            data: this.datas[2].data,
            name: '风速',
            // 设置参数对应的y坐标轴的索引
            yAxisIndex: 2,
            type: 'line',
            // 曲线平滑设置
            smooth: true
          },
          {
            data: this.datas[3].data,
            name: '电表（正向有功）',
            // 设置参数对应的y坐标轴的索引
            yAxisIndex: 3,
            type: 'line',
            // 曲线平滑设置
            smooth: true
          },
          {
            data: this.datas[4].data,
            name: '电表（正向无功）',
            // 设置参数对应的y坐标轴的索引
            yAxisIndex: 4,
            type: 'line',
            // 曲线平滑设置
            smooth: true
          }
        ],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.chartO
        },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        }
      }

      mycharts.showLoading({
        text: 'loading',
        color: '#c23531',
        textColor: '#000',
        maskColor: 'rgba(255, 255, 255, 0.2)',
        zlevel: 0
      })
      setTimeout(() => {
        // setOption前隐藏loading事件
        mycharts.hideLoading()
        mycharts.setOption(option)
      }, 1000)
    }
  }
}
</script>

<style  scoped>
.search {
  width: 100%;
  height: 50px;
  line-height: 50px;
}
.search-item {
  float: left;
  margin-left: 15px;
}
#myChart {
  width: 100%;
  height: 400px;
  /* border: 1px solid #000; */
  margin-top: 15px;
}

.el-tabs {
  margin-top: 15px;
}
</style>
