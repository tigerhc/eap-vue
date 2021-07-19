<template>
  <div id="app">
    <span class="title">设备列表</span>
    <div class="statusLegend">
      <label class="runLabel">RUN: </label><el-button type="success"/><br>
      <label class="downLabel">DOWN: </label><el-button type="danger"/><br>
      <label class="idelLabel">IDEL: </label><el-button type="primary"/><br>
      <label class="stopLabel">STOP: </label><el-button type="warning"/><br>
      <label class="setupLabel">SETUP: </label><el-button type="info"/>
    </div>
    <div id="eqp_list">
      <div v-for="item in eqpList" id="statusDiv" :key="item.eqpId" :class="item.status">
<!--        <img :id="item.eqpId" src="@/assets/img/close.png" class="close_img" @click="tips(item.eqpId)">-->
        <span class="eqp_name">{{ item.eqpId }}</span>
        <span class="model">{{ item.modelName }}</span>
        <div class="eqp_msg">
<!--          <img src="@/assets/img/eqp.jpg" class="eqp_img" @click="openMessage(item.eqpId)">-->
          <img src="@/assets/img/eqp.jpg" class="eqp_img">
          <div :class="item.status + 'connect'">
            <label class="connect_font connect_position">IP: </label>
            <span class="connect_font connect_position">{{ item.ip }}</span>
          </div>
          <div :class="item.status + 'connect'">
            <label class="connect_font connect_position">端口号: </label>
            <span class="connect_font">{{ item.port }}</span>
          </div>
          <div :class="item.status + 'connect'">
            <label class="connect_font connect_position">DEVICE: </label>
            <span class="connect_font">{{ item.deviceId }} </span>
          </div>
          <div :class="item.status + 'connect'">
            <label class="connect_font connect_position">WIP: </label>
            <span class="connect_font">{{ item.wip }}</span>
          </div>
          <div :class="item.status + 'connect'" class="recipe">
            <label class="connect_font connect_position">Recipe:</label>
            <span v-if="item.ppid">{{ item.ppid }}</span>
            <span v-else class="connect_font">无数据</span>
          </div>
          <div :class="item.status + 'connect'" class="lot">
            <label class="connect_font connect_position">LotNo:</label>
            <span v-if="item.lotNo">{{ item.lotNo }}</span>
            <span v-else class="connect_font">无数据</span>
          </div>
        </div>
      </div>
<!--      <el-popover-->
<!--        v-model="visible"-->
<!--        placement="top"-->
<!--        width="250">-->
<!--        <el-select v-model="selectEqp" clearable placeholder="请选择要添加的设备">-->
<!--          <el-option-->
<!--            v-for="item in allEqpList"-->
<!--            :key="item.value"-->
<!--            :label="item.label"-->
<!--            :value="item.value"-->
<!--            :disabled="item.disabled"/>-->
<!--        </el-select>-->
<!--        <div style="text-align: right; margin-top: 10px">-->
<!--          <el-button size="mini" type="text" text="取消" @click="visible = false"/>-->
<!--          <el-button type="primary" size="mini" text="确定" @click="addEqp()"/>-->
<!--        </div>-->
<!--        <div id="eqp_add" slot="reference">-->
<!--          <img src="@/assets/img/add.png" class="add">-->
<!--        </div>-->
<!--      </el-popover>-->
<!--      <el-dialog-->
<!--        :visible.sync="dialogVisible"-->
<!--        title="CIM Message 信息"-->
<!--        width="35%">-->
<!--        <el-input v-model="cimMessage" placeholder="发送至Touch Panel信息，仅支持数字字母部分特殊符号，不超过110个字符"/>-->
<!--        <span slot="footer" class="dialog-footer">-->
<!--                <el-button text="取消" @click="dialogVisible = false"/>-->
<!--                <el-button type="primary" text="确定" @click="sendMessage"/>-->
<!--            </span>-->
<!--      </el-dialog>-->
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'EapEqpt',
  props: {
    url: {
      type: String,
      default: '/fab/fabequipment/eqptList'
    }
  },
  data: function() {
    return {
      eqpList: [{
        eqpId: '1',
        status: 'RUN',
        modelName: '测试',
        ip: '127.0.0.1',
        port: '5001',
        deviceId: '1',
        wip: '1',
        ppid: 'recipe01',
        lotNo: 'lotNo01'
      }, {
        eqpId: '2',
        status: 'DOWN',
        modelName: '测试',
        ip: '127.0.0.1',
        port: '5002',
        deviceId: '2',
        wip: '2',
        ppid: 'recipe02',
        lotNo: 'lotNo02'
      }, {
        eqpId: '3',
        status: 'IDEL',
        modelName: '测试',
        ip: '127.0.0.1',
        port: '5003',
        deviceId: '3',
        wip: '3',
        ppid: 'recipe03',
        lotNo: 'lotNo03'
      }, {
        eqpId: '4',
        status: 'STOP',
        modelName: '测试',
        ip: '127.0.0.1',
        port: '5004',
        deviceId: '4',
        wip: '4',
        ppid: 'recipe04',
        lotNo: 'lotNo04'
      }, {
        eqpId: '5',
        status: 'SETUP',
        modelName: '测试',
        ip: '127.0.0.1',
        port: '5005',
        deviceId: '5',
        wip: '5',
        ppid: 'recipe05',
        lotNo: 'lotNo05'
      }],
      dialogVisible: false
    }
  },
  watch: {
    eqpList: function() {
      return this.eqpList
    }
  },
  created() {
    this.iniWebscoketFunc()
    // this.getEqptList()
  },
  methods: {
    getEqptList() {
      request({
        url: this.url,
        method: 'get'
      }).then(response => {
        this.eqpList = response.data
      })
    },
    iniWebscoketFunc: function() {
      var _this = this
      var socket
      var localUrl = window.location.hostname
      console.log(localUrl)
      var pathName = location.pathname
      var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1)
      if (typeof (WebSocket) === 'undefined') {
        alert('您的浏览器不支持WebSocket')
        return
      }
      socket = new WebSocket('ws://' + localUrl + ':800' + projectName + '/ws/' + '1')

      socket.onopen = function() {

      }
      // 获得消息事件
      socket.onmessage = function(msg) {
        _this.webScoketOnMessage(msg.data)
      }
      // 关闭事件
      socket.onclose = function() {

      }
      // 发生了错误事件
      socket.onerror = function() {

      }
    },
    webScoketOnMessage: function(data) {
      var message = JSON.parse(data)
      var action = message.msg_action.substr(0, 11)
      var msgData = JSON.parse(message.msg_info)
      switch (action) {
        case '1':
          this.loadFabEqptInfo(msgData)
          break
        default:
          break
      }
    },
    loadFabEqptInfo: function(data) {
      var _this = this
      var eqpId = data.eqpId
      var status = data.status
      var wip = data.wip
      var ppid = data.ppid
      var lotNo = data.lotNo
      var modelName = data.modelName
      for (var i = 0; i < _this.eqpList.length; i++) {
        if (_this.eqpList[i].eqpId === eqpId) {
          if (status) {
            _this.eqpList[i].status = status
          }
          if (wip) {
            _this.eqpList[i].wip = wip
          }
          if (ppid) {
            _this.eqpList[i].ppid = ppid
          }
          if (lotNo) {
            _this.eqpList[i].lotNo = lotNo
          }
          if (modelName) {
            _this.eqpList[i].modelName = modelName
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  #app {
    width: 1430px;
    height: auto;
    margin: auto;
  }
  #eqp_list {
    font-size: 0;
  }
  .statusLegend {
    float: right;
    font-size: 0;
    padding-top: 10px;
  }
  .runLabel {
    color: #67c23a;
    display: inline-block;
    margin: 10px 5px 10px 0;
    font-size: 15px;
    width: 60px;
    text-align: right;
    vertical-align: middle;
  }
  .downLabel {
    color: #f56c6c;
    display: inline-block;
    margin: 10px 5px 10px 0;
    font-size: 15px;
    width: 60px;
    text-align: right;
    vertical-align: middle;
  }
  .idelLabel {
    color: #409eff;
    display: inline-block;
    margin: 10px 5px 10px 0;
    font-size: 15px;
    width: 60px;
    text-align: right;
    vertical-align: middle;
  }
  .stopLabel {
    color: #e6a23c;
    display: inline-block;
    margin: 10px 5px 10px 0;
    font-size: 15px;
    width: 60px;
    text-align: right;
    vertical-align: middle;
  }
  .setupLabel {
    color: #909399;
    display: inline-block;
    margin: 10px 5px 10px 0;
    font-size: 15px;
    width: 60px;
    text-align: right;
    vertical-align: middle;
  }
  .title {
    display: block;
    font-size: 25px;
    padding-left: 10px;
  }
  .close_img {
    float: right;
    width: 25px;
    height: 25px;
    cursor: pointer
  }
  #eqp_add {
    display: inline-block;
    width: 240px;
    height: 235px;
    margin-top: 10px;
    margin-left: 10px;
    cursor: pointer;
    vertical-align: top;
    border: 5px solid #909399;
    border-radius: 2px;
  }
  .add {
    padding: 43px 45px;
  }
  #statusDiv {
    display: inline-block;
    width: 240px;
    height: 235px;
    margin-top: 10px;
    margin-left: 10px;
  }
  .RUN {
    background: #67c23a;
    /*background: #00a854;*/
  }
  .DOWN {
    background: #f56c6c;
    /*background: #c9302c;*/
  }
  .IDEL {
    background: #409eff;
    /*background: royalblue;*/
  }
  .STOP {
    background: #e6a23c;
    /*background: orange;*/
  }
  .SETUP {
    background: #909399;
    /*background: grey;*/
  }
  .eqp_msg {
    width: 230px;
    height: 188px;
    margin-left: 5px;
    background: white;
  }
  .eqp_name {
    display: block;
    font-size: 22px;
    color: white;
    text-align: center;
  }
  .model {
    display: block;
    font-size: 15px;
    color: white;
    text-align: center;
  }
  .eqp_img {
    float: left;
    width: 100px;
    height: 134px;
    /*cursor: pointer;*/
  }
  .RUNconnect {
    color: #67c23a;
    padding-top: 15px;
  }
  .DOWNconnect {
    color: #f56c6c;
    padding-top: 15px;
  }
  .IDELconnect {
    color: #409eff;
    padding-top: 15px;
  }
  .STOPconnect {
    color: #e6a23c;
    padding-top: 15px;
  }
  .SETUPconnect {
    color: #909399;
    padding-top: 15px;
  }
  .connect_position {
    /*padding-top: 5px;*/
    padding-left: 5px;
  }
  .connect_font {
    font-size: 15px;
  }
  .wip {
    margin-left: 5px;
    margin-top: 23px;
    font-size: 20px;
  }
  .recipe {
    padding-top: 8px;
    margin-left: 5px;
    font-size: 17px;
  }
  .lot {
    padding-top: 8px;
    margin-left: 5px;
    font-size: 17px;
  }
</style>
