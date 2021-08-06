<template>
  <div id="app">
    <div style="width: 50%; display: inline-block">
      <el-select v-model="selectEqpId" filterable style="width: 200px; margin-left: 20px" class="filter-item" clearable placeholder="请选择设备ID">
        <el-option
          v-for="item in eqpIdList"
          :key="item.id"
          :label="item.eqpId + '-' + item.modelName"
          :value="item.eqpId"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="queryEqp">{{ $t('table.search') }}</el-button>
    </div>
    <div class="statusLegend">
      <span class="runLabel">RUN: </span><el-button type="success" @click="findRunEqpt()" />
      <span class="downLabel">DOWN: </span><el-button type="danger" @click="findDownEqpt()" />
      <span class="idelLabel">IDEL: </span><el-button type="primary" @click="findIdelEqpt()" />
      <span class="stopLabel">STOP: </span><el-button type="warning" @click="findStopEqpt()" />
      <span class="setupLabel">SETUP: </span><el-button type="info" @click="findSetupEqpt()" />
    </div>
    <div id="eqp_list">
      <div v-for="item in eqpList" id="statusDiv" :key="item.eqpId" :class="item.status">
        <!--                <img :id="item.eqpId" src="@/assets/img/close.png" class="close_img" @click="tips(item.eqpId)">-->
        <span class="eqp_name">{{ item.eqpId }}</span>
        <span class="model">{{ item.modelName }}</span>
        <el-popover
          placement="right"
          width="200"
          trigger="hover">
          <div :class="item.status + 'connect'">
            <label class="connect_font connect_position">IP: </label>
            <span class="connect_font">{{ item.ip }}</span><br>
            <label class="connect_font connect_position">端口号: </label>
            <span class="connect_font">{{ item.port }}</span><br>
            <label class="connect_font connect_position">DEVICE: </label>
            <span class="connect_font">{{ item.deviceId }}</span><br>
            <label class="connect_font connect_position">WIP: </label>
            <span class="connect_font">{{ item.wip }}</span><br>
            <label class="connect_font connect_position">Recipe:</label>
            <span v-if="item.ppid">{{ item.ppid }}</span>
            <span v-else class="connect_font">无数据</span><br>
            <label class="connect_font connect_position">LotNo:</label>
            <span v-if="item.lotNo">{{ item.lotNo }}</span>
            <span v-else class="connect_font">无数据</span>
          </div>
          <div slot="reference" class="eqp_msg">
            <!--          <img src="@/assets/img/eqp.jpg" class="eqp_img" @click="openMessage(item.eqpId)">-->
            <img src="@/assets/img/eqpt.jpg" class="eqp_img" >
          </div>
        </el-popover>
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
      allEqpList: [
        {
          eqpId: '1',
          status: 'RUN',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5001',
          deviceId: '1',
          wip: '1',
          ppid: 'recipe01',
          lotNo: 'lotNo01'
        },
        {
          eqpId: '2',
          status: 'DOWN',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5002',
          deviceId: '2',
          wip: '2',
          ppid: 'recipe02',
          lotNo: 'lotNo02'
        },
        {
          eqpId: '3',
          status: 'IDEL',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5003',
          deviceId: '3',
          wip: '3',
          ppid: 'recipe03',
          lotNo: 'lotNo03'
        },
        {
          eqpId: '4',
          status: 'STOP',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5004',
          deviceId: '4',
          wip: '4',
          ppid: 'recipe04',
          lotNo: 'lotNo04'
        },
        {
          eqpId: '5',
          status: 'SETUP',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5005',
          deviceId: '5',
          wip: '5',
          ppid: 'recipe05',
          lotNo: 'lotNo05'
        },
        {
          eqpId: '6',
          status: 'RUN',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5001',
          deviceId: '6',
          wip: '1',
          ppid: 'recipe01',
          lotNo: 'lotNo01'
        },
        {
          eqpId: '7',
          status: 'DOWN',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5002',
          deviceId: '2',
          wip: '2',
          ppid: 'recipe02',
          lotNo: 'lotNo02'
        },
        {
          eqpId: '8',
          status: 'IDEL',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5003',
          deviceId: '3',
          wip: '3',
          ppid: 'recipe03',
          lotNo: 'lotNo03'
        },
        {
          eqpId: '9',
          status: 'STOP',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5004',
          deviceId: '4',
          wip: '4',
          ppid: 'recipe04',
          lotNo: 'lotNo04'
        },
        {
          eqpId: '10',
          status: 'SETUP',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5005',
          deviceId: '5',
          wip: '5',
          ppid: 'recipe05',
          lotNo: 'lotNo05'
        },
        {
          eqpId: '11',
          status: 'RUN',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5001',
          deviceId: '1',
          wip: '1',
          ppid: 'recipe01',
          lotNo: 'lotNo01'
        },
        {
          eqpId: '12',
          status: 'DOWN',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5002',
          deviceId: '2',
          wip: '2',
          ppid: 'recipe02',
          lotNo: 'lotNo02'
        },
        {
          eqpId: '13',
          status: 'IDEL',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5003',
          deviceId: '3',
          wip: '3',
          ppid: 'recipe03',
          lotNo: 'lotNo03'
        },
        {
          eqpId: '14',
          status: 'STOP',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5004',
          deviceId: '4',
          wip: '4',
          ppid: 'recipe04',
          lotNo: 'lotNo04'
        },
        {
          eqpId: '15',
          status: 'SETUP',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5005',
          deviceId: '5',
          wip: '5',
          ppid: 'recipe05',
          lotNo: 'lotNo05'
        },
        {
          eqpId: '16',
          status: 'RUN',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5001',
          deviceId: '1',
          wip: '1',
          ppid: 'recipe01',
          lotNo: 'lotNo01'
        },
        {
          eqpId: '17',
          status: 'DOWN',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5002',
          deviceId: '2',
          wip: '2',
          ppid: 'recipe02',
          lotNo: 'lotNo02'
        },
        {
          eqpId: '18',
          status: 'IDEL',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5003',
          deviceId: '3',
          wip: '3',
          ppid: 'recipe03',
          lotNo: 'lotNo03'
        },
        {
          eqpId: '19',
          status: 'STOP',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5004',
          deviceId: '4',
          wip: '4',
          ppid: 'recipe04',
          lotNo: 'lotNo04'
        },
        {
          eqpId: '20',
          status: 'SETUP',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5005',
          deviceId: '5',
          wip: '5',
          ppid: 'recipe05',
          lotNo: 'lotNo05'
        },
        {
          eqpId: '21',
          status: 'RUN',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5001',
          deviceId: '1',
          wip: '1',
          ppid: 'recipe01',
          lotNo: 'lotNo01'
        },
        {
          eqpId: '22',
          status: 'DOWN',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5002',
          deviceId: '2',
          wip: '2',
          ppid: 'recipe02',
          lotNo: 'lotNo02'
        },
        {
          eqpId: '23',
          status: 'IDEL',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5003',
          deviceId: '3',
          wip: '3',
          ppid: 'recipe03',
          lotNo: 'lotNo03'
        },
        {
          eqpId: '24',
          status: 'STOP',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5004',
          deviceId: '4',
          wip: '4',
          ppid: 'recipe04',
          lotNo: 'lotNo04'
        },
        {
          eqpId: '25',
          status: 'SETUP',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5005',
          deviceId: '5',
          wip: '5',
          ppid: 'recipe05',
          lotNo: 'lotNo05'
        },
        {
          eqpId: '26',
          status: 'RUN',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5001',
          deviceId: '1',
          wip: '1',
          ppid: 'recipe01',
          lotNo: 'lotNo01'
        },
        {
          eqpId: '27',
          status: 'DOWN',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5002',
          deviceId: '2',
          wip: '2',
          ppid: 'recipe02',
          lotNo: 'lotNo02'
        },
        {
          eqpId: '28',
          status: 'IDEL',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5003',
          deviceId: '3',
          wip: '3',
          ppid: 'recipe03',
          lotNo: 'lotNo03'
        },
        {
          eqpId: '29',
          status: 'STOP',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5004',
          deviceId: '4',
          wip: '4',
          ppid: 'recipe04',
          lotNo: 'lotNo04'
        },
        {
          eqpId: '30',
          status: 'SETUP',
          modelName: '测试',
          ip: '127.0.0.1',
          port: '5005',
          deviceId: '5',
          wip: '5',
          ppid: 'recipe05',
          lotNo: 'lotNo05'
        }
      ],
      eqpList: [],
      dialogVisible: false,
      searchEqpId: '',
      eqpIdList: [],
      selectEqpId: ''
    }
  },
  watch: {
    allEqpList: function() {
      return this.allEqpList
    },
    eqpList: function() {
      return this.eqpList
    }
  },
  created() {
    var _this = this
    _this.eqpList = _this.allEqpList
    _this.allEqpList.forEach(function(value) {
      var obj = {
        eqpId: value.eqpId,
        modelName: value.modelName
      }
      _this.eqpIdList.push(obj)
    })
    _this.iniWebscoketFunc()
    // _this.getEqptList()
  },
  methods: {
    getEqptList: function() {
      var _this = this
      request({
        url: this.url,
        method: 'get'
      }).then((response) => {
        _this.allEqpList = response.data
        _this.eqpList = response.data
        _this.allEqpList.forEach(function(value) {
          var obj = {
            eqpId: value.eqpId,
            modelName: value.modelName
          }
          _this.eqpIdList.push(obj)
        })
      })
    },
    iniWebscoketFunc: function() {
      var _this = this
      var socket
      var localUrl = window.location.hostname
      var pathName = location.pathname
      var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1)
      if (typeof WebSocket === 'undefined') {
        alert('您的浏览器不支持WebSocket')
        return
      }
      socket = new WebSocket('ws://' + localUrl + ':800' + projectName + '/ws/' + '1')

      socket.onopen = function() {}
      // 获得消息事件
      socket.onmessage = function(msg) {
        _this.webScoketOnMessage(msg.data)
      }
      // 关闭事件
      socket.onclose = function() {}
      // 发生了错误事件
      socket.onerror = function() {}
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
    },
    findRunEqpt: function() {
      var _this = this
      _this.eqpList = []
      _this.allEqpList.forEach(function(value) {
        if (value.status === 'RUN') {
          _this.eqpList.push(value)
        }
      })
    },
    findDownEqpt: function() {
      var _this = this
      _this.eqpList = []
      _this.allEqpList.forEach(function(value) {
        if (value.status === 'DOWN') {
          _this.eqpList.push(value)
        }
      })
    },
    findIdelEqpt: function() {
      var _this = this
      _this.eqpList = []
      _this.allEqpList.forEach(function(value) {
        if (value.status === 'IDEL') {
          _this.eqpList.push(value)
        }
      })
    },
    findStopEqpt: function() {
      var _this = this
      _this.eqpList = []
      _this.allEqpList.forEach(function(value) {
        if (value.status === 'STOP') {
          _this.eqpList.push(value)
        }
      })
    },
    findSetupEqpt: function() {
      var _this = this
      _this.eqpList = []
      _this.allEqpList.forEach(function(value) {
        if (value.status === 'SETUP') {
          _this.eqpList.push(value)
        }
      })
    },
    queryEqp: function() {
      var _this = this
      if (_this.selectEqpId === '') {
        _this.eqpList = _this.allEqpList
        return
      }
      _this.eqpList = []
      _this.allEqpList.forEach(function(value) {
        if (value.eqpId === _this.selectEqpId) {
          _this.eqpList.push(value)
        }
      })
    }
  }
}
</script>

<style scoped>
#app {
  /*width: 1430px;*/
  height: auto;
  margin: auto;
}
#eqp_list {
  font-size: 0;
}
.statusLegend {
  float: right;
  margin-right: 70px;
  font-size: 0;
}
.runLabel {
  color: #67c23a;
  display: inline-block;
  margin: 10px 5px 10px 20px;
  font-size: 15px;
  font-weight: bolder;
  text-align: right;
  vertical-align: middle;
}
.downLabel {
  color: #f56c6c;
  display: inline-block;
  margin: 10px 5px 10px 20px;
  font-size: 15px;
  font-weight: bolder;
  text-align: right;
  vertical-align: middle;
}
.idelLabel {
  color: #409eff;
  display: inline-block;
  margin: 10px 5px 10px 20px;
  font-size: 15px;
  font-weight: bolder;
  text-align: right;
  vertical-align: middle;
}
.stopLabel {
  color: #e6a23c;
  display: inline-block;
  margin: 10px 5px 10px 20px;
  font-size: 15px;
  font-weight: bolder;
  text-align: right;
  vertical-align: middle;
}
.setupLabel {
  color: #909399;
  display: inline-block;
  margin: 10px 5px 10px 20px;
  font-size: 15px;
  font-weight: bolder;
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
  cursor: pointer;
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
  width: 180px;
  height: 180px;
  margin-top: 10px;
  margin-left: 20px;
}
.RUN {
  background: #67c23a;
}
.DOWN {
  background: #f56c6c;
}
.IDEL {
  background: #409eff;
}
.STOP {
  background: #e6a23c;
}
.SETUP {
  background: #909399;
}
.eqp_msg {
  width: 170px;
  height: 133px;
  margin-left: 5px;
  background: white;
}
.eqp_name {
  width: 180px;
  display: block;
  font-size: 22px;
  color: white;
  text-align: center;
}
.model {
  margin: 0;
  width: 180px;
  display: block;
  font-size: 15px;
  color: white;
  text-align: center;
}
.eqp_img {
  float: left;
  width: 100%;
  height: 100%;
  /*cursor: pointer;*/
}
.RUNconnect {
  color: #67c23a;
}
.DOWNconnect {
  color: #f56c6c;
}
.IDELconnect {
  color: #409eff;
}
.STOPconnect {
  color: #e6a23c;
}
.SETUPconnect {
  color: #909399;
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
