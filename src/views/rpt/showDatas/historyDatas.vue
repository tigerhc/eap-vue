<template>
  <div class="hisDatas">
    <el-card>
      <div class="search">
        <div class="search-item">
          <label for="">设备：</label>
          <el-select v-model="eqpV" placeholder="请选择设备">
            <el-option v-for="item in eqpO" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </div>
        <div class="search-item">
          <label for="">传感器：</label>
          <el-select v-model="sensorV" placeholder="请选择传感器">
            <el-option v-for="item in sensorO" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </div>
        <div class="search-item">
          <label for="">示数类型：</label>
          <el-select v-model="indicationV" placeholder="请选择示数类型">
            <el-option v-for="item in indicationO" :key="item.value" :label="item.label" :value="item.value"/>
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
      <div id="myChart"/>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="总数据" name="first">
          <el-table :data="totalDatas" style="width: 100%">
            <el-table-column prop="eqp_id" label="设备编号"/>
            <el-table-column prop="collect_date" label="采集时间"/>
            <el-table-column prop="this_num" label="本次示数"/>
            <el-table-column prop="num_multiple" label="计数比"/>
            <el-table-column prop="num_type" label="示数类型"/>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="异常数据" name="second">
          <el-table :data="abnormalDatas" style="width: 100%">
            <el-table-column prop="eqp_id" label="设备编号"/>
            <el-table-column prop="collect_date" label="采集时间"/>
            <el-table-column prop="this_num" label="本次示数"/>
            <el-table-column prop="num_multiple" label="计数比"/>
            <el-table-column prop="num_type" label="示数类型"/>
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

          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '湿度',
          type: 'line',

          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '风速',
          type: 'line',
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: '电表（正向有功）',
          type: 'line',
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '电表（正向无功）',
          type: 'line',
          data: [130, 244, 156, 563, 312, 145, 134]
        }
      ]
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
      var myChart = echarts.init(chartDom)
      var option

      option = {
        title: {
          text: '折线图堆叠'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.chartO
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: this.datas
      }

      myChart.setOption(option)
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
