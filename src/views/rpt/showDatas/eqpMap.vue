<template>
  <div class="app">
    <div class="head">
      <div class="head_left">
        <span class="head_left_time"><Date /></span>
        <span class="head_left_btn">设备监控</span>
      </div>
      <div class="head_center">
        <h1>IOT监控大屏</h1>
      </div>
      <div class="head_right">
        <span class="head_right_btn" @click="control()">控制台</span>
      </div>
    </div>
    <div class="container">
      <div class="container_left">
        <div class="container_left_search">
          <el-select slot="prepend" v-model="select" placeholder="请选择">
            <el-option label="餐厅名" value="1" />
            <el-option label="订单号" value="2" />
            <el-option label="用户电话" value="3" />
          </el-select>
          <el-input v-model="eqpName" placeholder="请输入设备名称" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" />
          </el-input>
        </div>
        <div class="container_left_show">
          <ul>
            <li v-for="(item, index) in arr" :key="index">
              <div class="title">{{ item.name }}</div>
              <div class="content">
                <el-tag v-if="item.flag" type="success">在线</el-tag>
                <el-tag v-else type="danger">离线</el-tag>
                <i>{{ item.content }}</i>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="container_center">
        <div class="container_center_t">
          <el-tabs v-model="activeName1" @tab-click="handleClick1">
            <el-tab-pane label="设备组态" name="eqpStatus">
              <img src="../../../assets/img/1111.png" alt="" >
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="container_center_b">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="设备信息" name="eqpInfo">设备信息</el-tab-pane>
            <el-tab-pane label="历史数据" name="hisData">历史数据</el-tab-pane>
            <el-tab-pane label="历史报警" name="hisWarning">历史报警</el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="container_right">
        <div class="container_right_t">
          <div class="realTimeData">
            <label for="">实时数据</label>
            <el-input v-model="realTimeData" placeholder="请输入变量名称" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
          </div>
          <div class="showData">
            <ul>
              <li v-for="(item, index) in realTimeDataList" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
        <div class="container_right_b">
          <div class="warningInfo">
            <p>报警信息</p>
            <div class="showData">
              <ul>
                <li v-for="(item, index) in warningInfoList" :key="index">
                  <i>设备：{{ item.a }}</i>
                  <i>从机：{{ item.b }}</i>
                  <i>变量：{{ item.c }}</i>
                  <i>内容：{{ item.d }}</i>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Date from '@/components/Date/index'
export default {
  components: {
    Date
  },
  data() {
    return {
      activeName1: 'eqpStatus',
      activeName: 'eqpInfo',
      select: '',
      eqpName: '',
      realTimeData: '',
      realTimeDataList: ['1', '2', '3', '4', '5', '6', '7', '8'],
      warningInfoList: [
        { a: '111', b: '222', c: '333', d: '4444' },
        { a: '111', b: '222', c: '333', d: '4444' },
        { a: '111', b: '222', c: '333', d: '4444' }
      ],

      arr: [
        { name: '1号区域', flag: true, content: 'B-02' },
        { name: '2号区域', flag: true, content: 'B-02' },
        { name: '3号区域', flag: true, content: 'B-02' },
        { name: '4号区域', flag: false, content: 'B-02' },
        { name: '5号区域', flag: true, content: 'B-02' },
        { name: '6号区域', flag: true, content: 'B-02' },
        { name: '7号区域', flag: false, content: 'B-02' },
        { name: '8号区域', flag: false, content: 'B-02' }
      ]
    }
  },
  mounted() {},

  methods: {
    control() {
      this.$router.push({ name: 'views/rpt/showDatas/quickOverview' })
    },
    handleClick1() {},
    handleClick() {}
  }
}
</script>

<style  scoped lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
/*修改滚动条样式*/
ul::-webkit-scrollbar {
  width: 3px;
  height: 10px;
  /**/
}
ul::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 2px;
}
ul::-webkit-scrollbar-thumb {
  background: #50d3fb;
  border-radius: 5px;
}

/deep/ .el-select {
  border: 0;
}
/deep/ .el-input {
  color: #50d3fb;
  border: 1px solid#065280;
  border-radius: 0px;
  text-align: center;
}
/deep/ .el-input__inner {
  border: none;
  background-color: #11234a;
  // box-shadow: 0px 0px 10px 1px #fff inset;
  color: #50d3fb;
  &::placeholder {
    color: #50d3fb;
  }
}

/deep/.el-input-group__append,
.el-input-group__prepend {
  border-radius: 0px;
  border: 0;
  background-color: #11234a;
  color: #50d3fb;
}

/deep/.el-tabs__item {
  width: 120px;
  height: 50px;
  color: #fff;
  background-image: url(../../../assets/img/eqpmap_btn4.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  text-align: center;
  line-height: 50px;
  padding: 0;
}
/deep/.el-tabs__item.is-active {
  background-image: url(../../../assets/img/eqpmap_btn3.png);
}

/deep/.el-tabs__active-bar {
  background-color: transparent;
}
/deep/.el-tabs__nav-wrap::after {
  position: static !important;
}
.app {
  width: 100%;
  height: 100vh;
  background-color: #050919;
  .head {
    width: 100%;
    height: 85px;
    background-image: url(../../../assets/img/eqpmap_head.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    .head_left {
      flex: 1.1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .head_left_time {
        width: 250px;
        height: 46px;
        display: block;
        color: #fff;
        font-size: 20px;
        text-align: center;
        line-height: 46px;
        background-image: url(../../../assets/img/eqpmap_btn5.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }

      .head_left_btn {
        display: block;
        width: 250px;
        height: 46px;
        cursor: pointer;
        background-image: url(../../../assets/img/eqpmap_btn1.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        color: #fff;
        font-size: 24px;
        text-align: center;
        line-height: 46px;
      }
    }

    .head_center {
      flex: 1;
      height: 100%;
      h1 {
        color: #4ea3f9;
        text-align: center;
        line-height: 75px;
        font-size: 36px;
      }
    }

    .head_right {
      height: 100%;
      flex: 1.1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .head_right_btn {
        display: block;
        width: 205px;
        height: 46px;
        cursor: pointer;
        background-image: url(../../../assets/img/eqpmap_btn2.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        color: #fff;
        font-size: 24px;
        text-align: center;
        line-height: 46px;
      }
      .head_right_btn:hover {
        background-image: url(../../../assets/img/eqpmap_btn9.png);
      }
    }
  }
  .container {
    width: 100%;
    height: calc(100vh - 85px - 20px - 20px);
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 20px 0;
    .container_left {
      height: 100%;
      width: 20%;
      background-image: url(../../../assets/img/eqpmap_r.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      padding: 15px;
      .container_left_search {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .el-select {
          width: 40%;
        }
        .el-input {
          width: 55%;
        }
      }
      .container_left_show {
        width: 100%;
        height: calc(100% - 38px);
        padding: 15px 0 0;
        ul {
          width: 100%;
          height: 100%;
          overflow: hidden;
          li {
            list-style: none;
            color: #fff;
            width: 100%;
            height: 80px;
            margin-bottom: 15px;
            background-color: #064e7d;
            padding: 10px 15px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-between;
            .content {
              display: flex;
              align-items: center;
              .el-tag {
                padding: 0 15px;
                margin: 0 20px;
              }
              i {
                color: #50d3fb;
                font-style: normal;
              }
            }
          }
        }
        ul:hover {
          overflow: auto;
        }
      }
    }

    .container_center {
      height: 100%;
      width: 56%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      .container_center_t {
        width: 100%;
        height: 65%;
        background-image: url(../../../assets/img/eqpmap_ct.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        padding: 15px;
        .el-tabs {
          width: 100%;
          height: 100%;
          .el-tab-pane {
            width: 100%;
            height: 100%;
            text-align: center;
            color: #fff;
            img {
              width: 85%;
            }
          }
        }
      }
      .container_center_b {
        width: 100%;
        height: 33%;
        background-image: url(../../../assets/img/eqpmap_cb.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        padding: 15px;
        .el-tabs {
          .el-tab-pane {
            color: #fff;
          }
        }
      }
    }

    .container_right {
      height: 100%;
      width: 20%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      .container_right_t {
        width: 100%;
        height: 65%;
        background-image: url(../../../assets/img/eqpmap_lt.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        padding: 15px;
        .realTimeData {
          display: flex;
          align-items: center;
          justify-content: space-around;
          label {
            width: 30%;
            color: #fff;
            font-weight: normal;
            font-size: 20px;
          }
          .el-input {
            width: 65%;
          }
        }
        .showData {
          width: 100%;
          height: calc(100% - 38px);
          padding: 15px 0 0;
          ul {
            width: 100%;
            height: 100%;
            overflow: hidden;
            li {
              list-style: none;
              color: #fff;
              width: 100%;
              height: 80px;
              margin-bottom: 15px;
              padding: 10px 15px;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: space-between;
            }
            li:hover {
              background-color: #064e7d;
            }
          }
          ul:hover {
            overflow: auto;
          }
        }
      }
      .container_right_b {
        width: 100%;
        height: 33%;
        background-image: url(../../../assets/img/eqpmap_lb.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        padding: 15px;
        .warningInfo {
          width: 100%;
          height: 100%;
          color: #fff;
          p {
            font-size: 20px;
          }

          .showData {
            width: 100%;
            height: calc(100% - 23px);
            padding: 15px 0 0;
            ul {
              width: 100%;
              height: 100%;
              overflow: hidden;
              li {
                list-style: none;
                color: #fff;
                width: 100%;
                height: 150px;
                margin-bottom: 15px;
                padding: 10px 15px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: space-around;
                border-bottom: 1px solid #193d7c;
                box-shadow: 0 -5px 15px #193d7c inset;
                i {
                  font-style: normal;
                }
              }
            }
            ul:hover {
              overflow: auto;
            }
          }
        }
      }
    }
  }
}
</style>
