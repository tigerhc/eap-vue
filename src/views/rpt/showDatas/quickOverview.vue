<template>
  <div class="overviews">
    <el-card>
      <div slot="header" class="clearfix">
        <el-popover placement="bottom" width="300" trigger="click">
          <el-input v-model="projectName" placeholder="请输入项目名称" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" />
          </el-input>
          <el-radio-group v-model="radioValue" @change="getRadioValue">
            <el-radio v-for="(item, index) in radioDatas" :label="item.label" :key="index">{{ item.value }}</el-radio>
          </el-radio-group>
          <h3 slot="reference">{{ title }}<i class="el-icon-caret-bottom" /></h3>
        </el-popover>
      </div>

      <div class="content">
        <el-card>
          <div class="icon" style="background-color: #01e0ee; cursor: pointer" @click="eqpStatus()">
            <i class="el-icon-setting" />
          </div>
          <div class="num">
            <span>6</span>
            <p>设备数</p>
          </div>
          <el-button @click="manageEqp()">管理设备</el-button>
        </el-card>
        <el-card>
          <div class="icon" style="background-color: #5df220">
            <i class="el-icon-news" />
          </div>
          <div class="num">
            <span>6</span>
            <p>设备模板数</p>
          </div>
          <el-button @click="manageModel()">管理模板</el-button>
        </el-card>
        <el-card>
          <div class="icon" style="background-color: #fa957d">
            <i class="el-icon-bell" />
          </div>
          <div class="num">
            <span>6</span>
            <p>报警总数</p>
          </div>
          <el-button @click="viewAlarms()">查看警报</el-button>
        </el-card>
        <el-card>
          <div class="icon" style="background-color: #b67ceb">
            <i class="el-icon-user" />
          </div>
          <div class="num">
            <span>6</span>
            <p>工单数</p>
          </div>
          <el-button @click="manageOrders()">管理工单</el-button>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
// import x from ''
export default {
  components: {},
  data() {
    return {
      title: '所有项目',
      projectName: '',
      radioValue: '所有项目',
      radioDatas: [
        {
          label: '所有项目',
          value: '所有项目'
        },
        {
          label: '智慧工厂',
          value: '智慧工厂'
        },
        {
          label: '智慧电站',
          value: '智慧电站'
        }
      ]
    }
  },
  methods: {
    getRadioValue(v) {
      this.title = this.radioValue
    },
    eqpStatus() {
      this.$router.push({ name: 'views/fab/status/eqpstatusList' })
    },
    manageEqp() {
      this.$router.push({ name: 'views/fab/eqp/fabequipmentList' })
    },
    manageModel() {
      this.$router.push({ name: 'views/fab/eqp/fabeqpTemplate' })
    },
    viewAlarms() {
      this.$router.push({ name: 'views/alarm/log/index' })
    },
    manageOrders() {
      this.$router.push({ name: 'views/order/orderManage/overviewOrder' })
    }
  }
}
</script>

<style  scoped lang='scss'>
h3 {
  width: 100px;
  margin: 0;
  margin-left: 20px;
}
.overviews {
  width: 100%;
  padding: 15px 4% 0;
}

.el-radio-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 15px;
  .el-radio {
    margin: 0;
    padding: 0 0 10px;
  }
}
.content {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .el-card {
    width: 23%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    .icon {
      width: 94px;
      height: 84px;
      border-radius: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      i {
        font-size: 55px;
        color: #fff;
      }
    }

    .num {
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      span {
        color: #0b1d2c;
        font-size: 26px;
        line-height: 37px;
        font-family: Helvetica Neue;
        font-weight: 700;
      }
      p {
        margin: 0;
        font-size: 14px;
        line-height: 20px;
        color: #666;
      }
    }
  }
}
</style>
