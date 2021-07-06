<template>
  <el-row v-if="dataList.length > 0" :gutter="20" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="documentation" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ dataList[0].name }}</div>
          <div class="card-panel-num">{{ dataList[0].number }}</div>
          <!--{{dataList[0].number}}-->
          <!--<count-to :start-val="0" :end-val="dataList[0].number" :duration="3000" class="card-panel-num"/>-->
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="example" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ dataList[1].name }}</div>
          <count-to :start-val="0" :end-val="dataList[1].number" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="nested" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ dataList[2].name }}</div>
          <count-to :start-val="0" :end-val="dataList[2].number" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper2 icon-shopping">
          <!--<svg-icon icon-class="dashboard" class-name="card-panel-icon" />-->
          <img v-if="dataList[3].number >= 60" src="./1.jpg" class-name="card-panel-icon" >
          <img v-if="dataList[3].number < 60" src="./2.jpg" class-name="card-panel-icon" >
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ dataList[3].name }}%</div>
          <count-to :start-val="0" :end-val="dataList[3].number" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { fetchHeader } from '@/api/dashboard/dashboard.js'
export default {
  components: {
    CountTo
  },
  data() {
    return {
      dataList: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      fetchHeader().then((res) => {
        this.dataList = res.data
      })
    },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    // position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3;
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3;
    }
    .card-panel-icon-wrapper {
      width: 40%;
      height: 70%;
      display: flex;
      align-items: center;
      justify-content: center;
      // float: left;
      // margin: 14px 0 0 14px;
      // padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon-wrapper2 {
      float: left;
      margin: 4px 0 0 4px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      // float: left;
      font-size: 48px;
    }
    .card-panel-description {
      width: 60%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      // float: right;
      font-weight: bold;
      // margin: 16px;
      // margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
        display: inherit;
        text-align: center;
      }
    }
  }
}
</style>
