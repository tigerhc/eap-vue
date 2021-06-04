<template>
  <div class="app-container">
    <div v-if="dbcbLine.length>0" :style="{left:'1500px',width:450+250*(dbcbLine.length-1)+'px'}" class="line_panel">
      <div v-for="(item, index) in dbcbLine.length-1" :style="{left:200+(250*index)+'px'}" :key="'dbcb_'+index" class="arraw" />
      <div v-for="(item, index) in dbcbLine" :key="'db2_'+index" :style="{left:250*index+'px'}" class="eqp">
        <chipTray :eqp-id="item.eqpId" :start-time="item.startTimeStr" :tray-id="item.toTrayId" :x="item.toX" :y="item.toY"/>
      </div>
      <div :style="{left:'950px',height:'2800px'}" class="smt_panel">
        <div v-if="smt1.eqpId!==undefined" class="incloud"/>
        <div v-if="smt1.eqpId!==undefined" :style="{left:'50px', top:'1200px'}" class="eqp_single">
          <chipTray :eqp-id="smt1.eqpId" :start-time="smt1.startTimeStr" :tray-id="smt1.toTrayId"/>
        </div>
      </div>
    </div>
    <div v-if="igbtLine1.length>0" :style="{width:200+250*(igbtLine1.length-1)+'px'}" class="line_panel">
      <div v-for="(item, index) in igbtLine1.length-1" :style="{left:200+(250*index)+'px'}" :key="'igbt1_'+index" class="arraw" />
      <div v-for="(item, index) in igbtLine1" :key="'k1_'+index" :style="{left:250*index+'px'}" class="eqp">
        <chipTray :eqp-id="item.eqpId" :start-time="item.startTimeStr" :tray-id="item.toTrayId" :x="item.toX" :y="item.toY"/>
      </div>
    </div>
    <div v-if="igbtLine2.length>0" :style="{width:200+250*(igbtLine2.length-1)+'px'}" class="line_panel">
      <div v-for="(item, index) in igbtLine2.length-1" :style="{left:200+(250*index)+'px'}" :key="'igbt2_'+index" class="arraw" />
      <div v-for="(item, index) in igbtLine2" :key="'k2_'+index" :style="{left:250*index+'px'}" class="eqp">
        <chipTray :eqp-id="item.eqpId" :start-time="item.startTimeStr" :tray-id="item.toTrayId" :x="item.toX" :y="item.toY"/>
      </div>
    </div>
    <div v-if="igbtLine3.length>0" :style="{width:200+250*(igbtLine3.length-1)+'px'}" class="line_panel">
      <div v-for="(item, index) in igbtLine3.length-1" :style="{left:200+(250*index)+'px'}" :key="'igbt3_'+index" class="arraw" />
      <div v-for="(item, index) in igbtLine3" :key="'k3_'+index" :style="{left:250*index+'px'}" class="eqp">
        <chipTray :eqp-id="item.eqpId" :start-time="item.startTimeStr" :tray-id="item.toTrayId" :x="item.toX" :y="item.toY"/>
      </div>
    </div>
    <div v-if="igbtLine4.length>0" :style="{width:200+250*(igbtLine4.length-1)+'px'}" class="line_panel">
      <div v-for="(item, index) in igbtLine4.length-1" :style="{left:200+(250*index)+'px'}" :key="'igbt4_'+index" class="arraw" />
      <div v-for="(item, index) in igbtLine4" :key="'k4_'+index" :style="{left:250*index+'px'}" class="eqp">
        <chipTray :eqp-id="item.eqpId" :start-time="item.startTimeStr" :tray-id="item.toTrayId" :x="item.toX" :y="item.toY"/>
      </div>
    </div>
    <div v-if="igbtLine5.length>0" :style="{width:200+250*(igbtLine5.length-1)+'px'}" class="line_panel">
      <div v-for="(item, index) in igbtLine5.length-1" :style="{left:200+(250*index)+'px'}" :key="'igbt5_'+index" class="arraw" />
      <div v-for="(item, index) in igbtLine5" :key="'k5_'+index" :style="{left:250*index+'px'}" class="eqp">
        <chipTray :eqp-id="item.eqpId" :start-time="item.startTimeStr" :tray-id="item.toTrayId" :x="item.toX" :y="item.toY"/>
      </div>
    </div>
    <div v-if="igbtLine6.length>0" :style="{width:200+250*(igbtLine6.length-1)+'px'}" class="line_panel">
      <div v-for="(item, index) in igbtLine6.length-1" :style="{left:200+(250*index)+'px'}" :key="'igbt6_'+index" class="arraw" />
      <div v-for="(item, index) in igbtLine6" :key="'k6_'+index" :style="{left:250*index+'px'}" class="eqp">
        <chipTray :eqp-id="item.eqpId" :start-time="item.startTimeStr" :tray-id="item.toTrayId" :x="item.toX" :y="item.toY"/>
      </div>
    </div>

    <div v-if="frdLine1.length>0" :style="{left:'250px',width:450+250*(frdLine1.length-1)+'px'}" class="line_panel">
      <div v-for="(item, index) in frdLine1.length-1" :style="{left:200+(250*index)+'px'}" :key="'frd1_'+index" class="arraw" />
      <div v-for="(item, index) in frdLine1" :key="'k7_'+index" :style="{left:250*index+'px'}" class="eqp">
        <chipTray :eqp-id="item.eqpId" :start-time="item.startTimeStr" :tray-id="item.toTrayId" :x="item.toX" :y="item.toY"/>
      </div>

      <div :style="{left:'2450px',top:'-1600px',height:'4000px'}" class="smt_panel">
        <div class="incloud"/>
        <div :style="{left:'50px', top:'1800px'}" class="eqp_single">
          <chipTray :eqp-id="smt2.eqpId" :start-time="smt2.startTimeStr" :tray-id="smt2.toTrayId"/>
        </div>
      </div>
    </div>
    <div v-if="frdLine2.length>0" :style="{left:'250px',width:200+250*(frdLine2.length-1)+'px'}" class="line_panel">
      <div v-for="(item, index) in frdLine2.length-1" :style="{left:200+(250*index)+'px'}" :key="'frd2_'+index" class="arraw" />
      <div v-for="(item, index) in frdLine2" :key="'k8_'+index" :style="{left:250*index+'px'}" class="eqp">
        <chipTray :eqp-id="item.eqpId" :start-time="item.startTimeStr" :tray-id="item.toTrayId" :x="item.toX" :y="item.toY"/>
      </div>
    </div>
    <div v-if="frdLine3.length>0" :style="{left:'250px',width:200+250*(frdLine3.length-1)+'px'}" class="line_panel">
      <div v-for="(item, index) in frdLine3.length-1" :style="{left:200+(250*index)+'px'}" :key="'frd3_'+index" class="arraw" />
      <div v-for="(item, index) in frdLine3" :key="'k9_'+index" :style="{left:250*index+'px'}" class="eqp">
        <chipTray :eqp-id="item.eqpId" :start-time="item.startTimeStr" :tray-id="item.toTrayId" :x="item.toX" :y="item.toY"/>
      </div>
    </div>
    <div v-if="frdLine4.length>0" :style="{left:'250px',width:200+250*(frdLine4.length-1)+'px'}" class="line_panel">
      <div v-for="(item, index) in frdLine4.length-1" :style="{left:200+(250*index)+'px'}" :key="'frd4_'+index" class="arraw" />
      <div v-for="(item, index) in frdLine4" :key="'k10_'+index" :style="{left:250*index+'px'}" class="eqp">
        <chipTray :eqp-id="item.eqpId" :start-time="item.startTimeStr" :tray-id="item.toTrayId" :x="item.toX" :y="item.toY"/>
      </div>
    </div>
    <div v-if="frdLine5.length>0" :style="{left:'250px',width:200+250*(frdLine5.length-1)+'px'}" class="line_panel">
      <div v-for="(item, index) in frdLine5.length-1" :style="{left:200+(250*index)+'px'}" :key="'frd5_'+index" class="arraw" />
      <div v-for="(item, index) in frdLine5" :key="'k11_'+index" :style="{left:250*index+'px'}" class="eqp">
        <chipTray :eqp-id="item.eqpId" :start-time="item.startTimeStr" :tray-id="item.toTrayId" :x="item.toX" :y="item.toY"/>
      </div>
    </div>
    <div v-if="frdLine6.length>0" :style="{left:'250px',width:200+250*(frdLine6.length-1)+'px'}" class="line_panel">
      <div v-for="(item, index) in frdLine6.length-1" :style="{left:200+(250*index)+'px'}" :key="'frd6_'+index" class="arraw" />
      <div v-for="(item, index) in frdLine6" :key="'k12_'+index" :style="{left:250*index+'px'}" class="eqp">
        <chipTray :eqp-id="item.eqpId" :start-time="item.startTimeStr" :tray-id="item.toTrayId" :x="item.toX" :y="item.toY"/>
      </div>
    </div>
    <div v-if="dbctLine.length>0" :style="{left:'2250px',width:'3060px'}" class="line_panel">
      <div v-for="(item, index) in dbctLine.length-1" :style="{left:200+(250*index)+'px'}" :key="'dbct_'+index" class="arraw" />
      <div v-for="(item, index) in dbctLine" :key="'db1_'+index" :style="{left:250*index+'px'}" class="eqp">
        <chipTray :eqp-id="item.eqpId" :start-time="item.startTimeStr" :tray-id="item.toTrayId" :x="item.toX" :y="item.toY"/>
      </div>
    </div>
    <!--不缺上基板数据,向上偏移-->
    <div v-if="dbctLine.length>2" :style="{left:'2955px',top:'-2585px',height:'2500px',width:250+3060+250*(otherData.length-1)+'px'}" class="other_panel">
      <div class="incloud"/>
      <div v-for="(item, index) in otherData.length-1" :style="{left:250+(250*index)+'px'}" :key="'other_'+index" class="arraw" />
      <div :style="{left:'50px',top:'950px',width:200+250*(otherData.length-1)+'px'}" class="line_panel">
        <div v-for="(item, index) in otherData" :key="'db1_'+index" :style="{left:250*index+'px'}" class="eqp">
          <chipTray :eqp-id="item.eqpId" :start-time="item.startTimeStr" :tray-id="item.toTrayId"/>
        </div>
      </div>
    </div>
    <!--缺上基板数据,不向上偏移-->
    <div v-if="dbctLine.length ===0 && otherData.length>0" :style="{height:'250px',width:250+3060+250*(otherData.length-1)+'px'}" class="other_panel">
      <div v-for="(item, index) in otherData.length-1" :style="{left:250+(250*index)+'px'}" :key="'other_'+index" class="arraw" />
      <div :style="{left:'50px',width:200+250*(otherData.length-1)+'px'}" class="line_panel">
        <div v-for="(item, index) in otherData" :key="'db1_'+index" :style="{left:250*index+'px'}" class="eqp">
          <chipTray :eqp-id="item.eqpId" :start-time="item.startTimeStr" :tray-id="item.toTrayId"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  div{box-sizing: border-box;}
  .line_panel{height:400px;position: relative;}
  .app-container{overflow-y:scroll;overflow-x:scroll;width:100%;}
  .eqp{position: absolute;width:200px;height: 80%;overflow-y:hidden; }
  .eqp_single{position: absolute;width:200px;height: 320px;overflow-y:hidden;}
  .arraw{background:url(../../../assets/img/arraw.png);width:50px;height:20px;position: absolute;background-size: 100% 100%; top:45%;}
  .smt_panel{position: relative;width:250px;}
  .incloud{position: absolute;width:50px;height:100%;background:url(../../../assets/img/incloud.png);background-repeat: no-repeat;background-size: 100% 100%}
  .other_panel{position: relative;height: 200px;left:700px;}
</style>

<script>
// import G6 from '@antv/g6'
import request from '@/utils/request'
import chipTray from '@/views/tool/chip_2d/chip_tray'

export default {
  name: 'TrayChipMoveDetail',
  components: {
    chipTray
  },
  data() {
    return {
      igbtFrdList: [],
      hb1List: [],
      otherData: [],
      igbtLine1: [],
      igbtLine2: [],
      igbtLine3: [],
      igbtLine4: [],
      igbtLine5: [],
      igbtLine6: [],
      frdLine1: [],
      frdLine2: [],
      frdLine3: [],
      frdLine4: [],
      frdLine5: [],
      frdLine6: [],
      startIgbtData: [],
      startFrdData: [],
      dbctLine: [],
      dbcbLine: [],
      smt1: {},
      smt2: {}
    }
  },
  mounted() {
    this.loadChip()
  },
  methods: {
    loadChip() {
      request({
        url: '/map/maptraychipmove/moveDetail',
        method: 'post',
        data: { chipId: this.$route.query.id }
      }).then((resp) => {
        var dataList = resp.data.results
        if (dataList === null || dataList.length === 0) {
          alert('数据错误')
          return
        }
        for (var i = 0; i < dataList.length; i++) {
          if (dataList[i].eqpId === 'APJ-IGBT-3DAOI1') {
            this.startIgbtData.push(dataList[i])
          } else if (dataList[i].eqpId === 'APJ-FRD-3DAOI1') {
            this.startFrdData.push(dataList[i])
          } else if (dataList[i].eqpId.indexOf('IGBT') > 0 || dataList[i].eqpId.indexOf('FRD') > 0) {
            this.igbtFrdList.push(dataList[i])
          } else if (dataList[i].eqpId.indexOf('HB1') > 0 || dataList[i].eqpId.indexOf('VI1') > 0) {
            this.hb1List.push(dataList[i])
          } else if (dataList[i].eqpId.indexOf('DBCT') > 0) {
            this.dbctLine.push(dataList[i])
          } else if (dataList[i].eqpId.indexOf('DBCB') > 0 || dataList[i].eqpId.indexOf('HB2-SORT1') > 0) {
            this.dbcbLine.push(dataList[i])
          } else if (dataList[i].eqpId.indexOf('HB2-SMT1') > 0) {
            this.smt1 = dataList[i]
          } else if (dataList[i].eqpId.indexOf('HB2-SMT2') > 0) {
            this.smt2 = dataList[i]
          } else {
            if (dataList[i].toTrayId.indexOf('J00') === -1) {
              dataList[i].toTrayId = 'chip'
            }
            this.otherData.push(dataList[i])
          }
        }
        this.loadIgbtFrd()
      })
    },
    loadIgbtFrd() {
      if (this.igbtFrdList.length > 0) {
        if (this.startIgbtData.length > 0) {
          var lineIndex = 0
          var curObj = {}
          for (var i = 0; i < this.startIgbtData.length; i++) {
            // 开始节点
            lineIndex = lineIndex + 1
            this.lineArrAddObj(lineIndex, 'IGBT', this.startIgbtData[i])
            curObj = this.startIgbtData[i]
            // 寻找开始点后的点
            for (var j = 0; j < this.igbtFrdList.length; j++) {
              if (curObj.nextEqpId === this.igbtFrdList[j].eqpId &&
                ((curObj.toX === this.igbtFrdList[j].fromX && curObj.toY === this.igbtFrdList[j].fromY && curObj.toTrayId === this.igbtFrdList[j].fromTrayId) ||
                  (curObj.toX === this.igbtFrdList[j].toX && curObj.toY === this.igbtFrdList[j].toY && curObj.toTrayId === this.igbtFrdList[j].toTrayId))) {
                this.lineArrAddObj(lineIndex, 'IGBT', this.igbtFrdList[j])
                curObj = this.igbtFrdList[j]
              }
            }
            // 寻找HB1
            if (this.hb1List.length > 0) {
              for (var n = 0; n < this.hb1List.length; n++) {
                if (curObj.nextEqpId === this.hb1List[n].eqpId &&
                  ((curObj.toX === this.hb1List[n].fromX && curObj.toY === this.hb1List[n].fromY && curObj.toTrayId === this.hb1List[n].fromTrayId) ||
                    (curObj.toX === this.hb1List[n].toX && curObj.toY === this.hb1List[n].toY && curObj.toTrayId === this.hb1List[n].toTrayId))) {
                  this.lineArrAddObj(lineIndex, 'IGBT', this.hb1List[n])
                  curObj = this.hb1List[n]
                }
              }
            }
          }
        }
        if (this.startFrdData.length > 0) {
          var lineIndex3 = 0
          var curObj2 = {}
          for (var m = 0; m < this.startIgbtData.length; m++) {
            // 开始节点
            lineIndex3 = lineIndex3 + 1
            this.lineArrAddObj(lineIndex3, 'FRD', this.startFrdData[m])
            curObj2 = this.startFrdData[m]
            // 寻找开始点后的点
            for (var k = 0; k < this.igbtFrdList.length; k++) {
              if (curObj2.nextEqpId === this.igbtFrdList[k].eqpId &&
                ((curObj2.toX === this.igbtFrdList[k].fromX && curObj2.toY === this.igbtFrdList[k].fromY && curObj2.toTrayId === this.igbtFrdList[k].fromTrayId) ||
                  (curObj2.toX === this.igbtFrdList[k].toX && curObj2.toY === this.igbtFrdList[k].toY && curObj2.toTrayId === this.igbtFrdList[k].toTrayId))) {
                this.lineArrAddObj(lineIndex3, 'FRD', this.igbtFrdList[k])
                curObj2 = this.igbtFrdList[k]
              }
            }
            // 寻找HB1
            if (this.hb1List.length > 0) {
              for (var l = 0; l < this.hb1List.length; l++) {
                if (curObj2.nextEqpId === this.hb1List[l].eqpId &&
                  ((curObj2.toX === this.hb1List[l].fromX && curObj2.toY === this.hb1List[l].fromY && curObj2.toTrayId === this.hb1List[l].fromTrayId) ||
                    (curObj2.toX === this.hb1List[l].toX && curObj2.toY === this.hb1List[l].toY && curObj2.toTrayId === this.hb1List[l].toTrayId))) {
                  this.lineArrAddObj(lineIndex3, 'FRD', this.hb1List[l])
                  curObj2 = this.hb1List[l]
                }
              }
            }
          }
        }
      }
    },
    lineArrAddObj(lineIndex2, lineCode, dataItem) {
      if (lineCode === 'IGBT') {
        if (lineIndex2 === 1) {
          this.igbtLine1.push(dataItem)
        } else if (lineIndex2 === 2) {
          this.igbtLine2.push(dataItem)
        } else if (lineIndex2 === 3) {
          this.igbtLine3.push(dataItem)
        } else if (lineIndex2 === 4) {
          this.igbtLine4.push(dataItem)
        } else if (lineIndex2 === 5) {
          this.igbtLine5.push(dataItem)
        } else if (lineIndex2 === 6) {
          this.igbtLine6.push(dataItem)
        }
      } else {
        if (lineIndex2 === 1) {
          this.frdLine1.push(dataItem)
        } else if (lineIndex2 === 2) {
          this.frdLine2.push(dataItem)
        } else if (lineIndex2 === 3) {
          this.frdLine3.push(dataItem)
        } else if (lineIndex2 === 4) {
          this.frdLine4.push(dataItem)
        } else if (lineIndex2 === 5) {
          this.frdLine5.push(dataItem)
        } else if (lineIndex2 === 6) {
          this.frdLine6.push(dataItem)
        }
      }
    }
  }
}
</script>
