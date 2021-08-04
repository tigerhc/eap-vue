<template>
  <div class="tempImg">
    <!--高温室温-->
    <div v-if="imgUrl==='DM-RT' || imgUrl==='DM-HT'" class="HTRT" >
      <div v-if="imgUrl==='DM-HT'" :class="imgOption===0?'positionHT1':'positionHT1_p'" @click="positionClk(0)"/>
      <div v-if="imgUrl==='DM-HT'" :class="imgOption===1?'positionHT2':'positionHT2_p'" @click="positionClk(1)"/>
      <div v-if="imgUrl==='DM-HT'" :class="imgOption===2?'positionHT3':'positionHT3_p'" @click="positionClk(2)"/>
      <div v-if="imgUrl==='DM-HT'" :class="imgOption===3?'positionHT4':'positionHT4_p'" @click="positionClk(3)"/>
      <div v-if="imgUrl==='DM-HT'" :class="imgOption===4?'positionHT5':'positionHT5_p'" @click="positionClk(4)"/>
      <div v-if="imgUrl==='DM-HT'" :class="imgOption===5?'positionHT6':'positionHT6_p'" @click="positionClk(5)"/>
      <div v-if="imgUrl==='DM-HT'" :class="imgOption===6?'positionHT7':'positionHT7_p'" @click="positionClk(6)"/>
      <div v-if="imgUrl==='DM-HT'" :class="imgOption===7?'positionHT8':'positionHT8_p'" @click="positionClk(7)"/>
      <div v-if="imgUrl==='DM-HT'" :class="imgOption===8?'positionHT9':'positionHT9_p'" @click="positionClk(8)"/>
      <div v-if="imgUrl==='DM-HT'" :class="imgOption===9?'positionHT10':'positionHT10_p'" @click="positionClk(9)"/>
      <div v-if="imgUrl==='DM-HT'" :class="imgOption===10?'positionHT11':'positionHT11_p'" @click="positionClk(10)"/>
      <div v-if="imgUrl==='DM-HT'" :class="imgOption===11?'positionHT12':'positionHT12_p'" @click="positionClk(11)"/>
      <div v-if="imgUrl==='DM-RT'" :class="imgOption===0?'positionRT1':'positionRT1_p'" @click="positionClk(0)"/>
      <div v-if="imgUrl==='DM-RT'" :class="imgOption===1?'positionRT2':'positionRT2_p'" @click="positionClk(1)"/>
      <div v-if="imgUrl==='DM-RT'" :class="imgOption===2?'positionRT3':'positionRT3_p'" @click="positionClk(2)"/>
      <div v-if="imgUrl==='DM-RT'" :class="imgOption===3?'positionRT4':'positionRT4_p'" @click="positionClk(3)"/>
      <div v-if="imgUrl==='DM-RT'" :class="imgOption===4?'positionRT5':'positionRT5_p'" @click="positionClk(4)"/>
      <div v-if="imgUrl==='DM-RT'" :class="imgOption===5?'positionRT6':'positionRT6_p'" @click="positionClk(5)"/>
      <div v-if="imgUrl==='DM-RT'" :class="imgOption===6?'positionRT7':'positionRT7_p'" @click="positionClk(6)"/>
    </div>
    <div v-if="imgUrl==='DM-AT2'" class="AT" >
      <div :class="imgOption===0?'positionAT1':'positionAT1_p'" @click="positionClk(0)"/>
      <div :class="imgOption===1?'positionAT2':'positionAT2_p'" @click="positionClk(1)"/>
      <div :class="imgOption===2?'positionAT3':'positionAT3_p'" @click="positionClk(2)"/>
      <div :class="imgOption===3?'positionAT4':'positionAT4_p'" @click="positionClk(3)"/>
      <div :class="imgOption===4?'positionAT5':'positionAT5_p'" @click="positionClk(4)"/>
      <div :class="imgOption===5?'positionAT6':'positionAT6_p'" @click="positionClk(5)"/>
      <div :class="imgOption===6?'positionAT7':'positionAT7_p'" @click="positionClk(6)"/>
      <div :class="imgOption===7?'positionAT8':'positionAT8_p'" @click="positionClk(7)"/>
      <div :class="imgOption===8?'positionAT9':'positionAT9_p'" @click="positionClk(8)"/>
      <div :class="imgOption===9?'positionAT10':'positionAT10_p'" @click="positionClk(9)"/>
    </div>
    <div v-if="imgUrl==='DM-OVEN1'" class="OVEN1" />
    <div v-if="imgUrl==='DM-OVEN2'" class="OVEN2" />
    <div v-if="imgUrl==='DM-FREEZER3'" class="FREEZER3" />
    <div v-if="imgUrl==='DM-FREEZER2'" class="FREEZER2" />
    <div v-if="imgUrl==='DM-FREEZER1'" class="FREEZER1" />
    <div v-if="imgUrl==='DM-CLEAN-US1'" class="CLEAN_US" />
    <div v-if="imgUrl==='SMA-OVEN1'" class="SMA-OVEN1" />
    <div v-if="imgUrl==='SIM-OVEN1'" class="SIM-OVEN1" />
    <div v-if="imgUrl==='SIM-OVEN2'" class="SIM-OVEN2" />
    <div v-if="imgUrl==='SMA-FREEZER1'" class="SMA_FREEZER" />
    <div v-if="imgUrl==='SX-FREEZER1'" class="SX_FREEZER" />

    <div v-if="imgUrl==='DETAIL-AT2'" class="dtlImg-AT2" >
      <div class="dtl_title">详细位置:</div>
      <div :class="imgOption===0?'dtl_AT1':'dtl_AT1_p'" @click="positionClk(0)"/>
      <div :class="imgOption===1?'dtl_AT2':'dtl_AT2_p'" @click="positionClk(1)"/>
      <div :class="imgOption===2?'dtl_AT3':'dtl_AT3_p'" @click="positionClk(2)"/>
      <div :class="imgOption===3?'dtl_AT4':'dtl_AT4_p'" @click="positionClk(3)"/>
      <div :class="imgOption===4?'dtl_AT5':'dtl_AT5_p'" @click="positionClk(4)"/>
      <div :class="imgOption===5?'dtl_AT6':'dtl_AT6_p'" @click="positionClk(5)"/>
      <div :class="imgOption===6?'dtl_AT7':'dtl_AT7_p'" @click="positionClk(6)"/>
      <div :class="imgOption===7?'dtl_AT8':'dtl_AT8_p'" @click="positionClk(7)"/>
      <div :class="imgOption===8?'dtl_AT9':'dtl_AT9_p'" @click="positionClk(8)"/>
      <div :class="imgOption===9?'dtl_AT10':'dtl_AT10_p'" @click="positionClk(9)"/>
    </div>
    <!--详细图片-->
    <div v-if="imgUrl==='DETAIL-HT' || imgUrl==='DETAIL-RT'" class="dtlImg">
      <div class="dtl_title">放大区块:</div>
      <div v-show="imgUrl==='DETAIL-HT' && imgOption===0" class="dtl_HT1"/>
      <div v-show="imgUrl==='DETAIL-HT' && imgOption===1" class="dtl_HT2"/>
      <div v-show="imgUrl==='DETAIL-HT' && imgOption===2" class="dtl_HT3"/>
      <div v-show="imgUrl==='DETAIL-HT' && imgOption===3" class="dtl_HT4"/>
      <div v-show="imgUrl==='DETAIL-HT' && imgOption===4" class="dtl_HT5"/>
      <div v-show="imgUrl==='DETAIL-HT' && imgOption===5" class="dtl_HT6"/>
      <div v-show="imgUrl==='DETAIL-HT' && imgOption===6" class="dtl_HT7"/>
      <div v-show="imgUrl==='DETAIL-HT' && imgOption===7" class="dtl_HT8"/>
      <div v-show="imgUrl==='DETAIL-HT' && imgOption===8" class="dtl_HT9"/>
      <div v-show="imgUrl==='DETAIL-HT' && imgOption===9" class="dtl_HT10"/>
      <div v-show="imgUrl==='DETAIL-HT' && imgOption===10" class="dtl_HT10"/>
      <div v-show="imgUrl==='DETAIL-HT' && imgOption===11" class="dtl_RT1"/>
      <div v-show="imgUrl==='DETAIL-RT' && imgOption===0" class="dtl_RT1"/>
      <div v-show="imgUrl==='DETAIL-RT' && imgOption===1" class="dtl_RT2"/>
      <div v-show="imgUrl==='DETAIL-RT' && imgOption===2" class="dtl_RT2"/>
      <div v-show="imgUrl==='DETAIL-RT' && imgOption===3" class="dtl_RT4"/>
      <div v-show="imgUrl==='DETAIL-RT' && imgOption===4" class="dtl_RT4"/>
      <div v-show="imgUrl==='DETAIL-RT' && imgOption===5" class="dtl_RT6"/>
      <div v-show="imgUrl==='DETAIL-RT' && imgOption===6" class="dtl_RT7"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChipImg',
  props: {
    imgUrl: {
      type: String,
      default: function() {
        return ''
      }
    },
    imgOption: {
      type: Number,
      default: function() {
        return ''
      }
    },
    clickAble: {
      type: Boolean,
      default: function() {
        return false
      }
    }
  },
  methods: {
    positionClk(pname) {
      if (this.clickAble) {
        this.$emit('positionName', pname)
      }
    }
  }
}
</script>

<style scoped>
  .tempImg{width:100%;height:100%;background-repeat:no-repeat;background-size: 80% 80%;}
  .tempImg div{background-repeat:no-repeat;overflow: hidden;}
  .positionHT1{position: absolute;width:3%;height:4%;border:1px solid #50fc08;left:14%;top:45%;}
  .positionHT1_p{position: absolute;width:3%;height:4%;left:14%;top:45%;}
  .positionHT2{position: absolute;width:3%;height:4%;border:1px solid #50fc08;left:17%;top:45%;}
  .positionHT2_p{position: absolute;width:3%;height:4%;left:17%;top:45%;}
  .positionHT3{position: absolute;width:2.7%;height:4%;border:1px solid #50fc08;left:20%;top:45%;}
  .positionHT3_p{position: absolute;width:2.7%;height:4%;left:20%;top:45%;}
  .positionHT4{position: absolute;width:2.5%;height:4%;border:1px solid #50fc08;left:22.5%;top:45%;}
  .positionHT4_p{position: absolute;width:2.5%;height:4%;left:22.5%;top:45%;}
  .positionHT5{position: absolute;width:2.5%;height:4%;border:1px solid #50fc08;left:24.7%;top:45%;}
  .positionHT5_p{position: absolute;width:2.5%;height:4%;left:24.7%;top:45%;}
  .positionHT6{position: absolute;width:2.5%;height:4%;border:1px solid #50fc08;left:27%;top:45%;}
  .positionHT6_p{position: absolute;width:2.5%;height:4%;left:27%;top:45%;}
  .positionHT7{position: absolute;width:2.5%;height:4%;border:1px solid #50fc08;left:29.4%;top:45%;}
  .positionHT7_p{position: absolute;width:2.5%;height:4%;left:29.4%;top:45%;}
  .positionHT8{position: absolute;width:2.5%;height:4%;border:1px solid #50fc08;left:31.8%;top:45%;}
  .positionHT8_p{position: absolute;width:2.5%;height:4%;left:31.8%;top:45%;}
  .positionHT9{position: absolute;width:4.5%;height:4%;border:1px solid #50fc08;left:14.6%;top:64%;}
  .positionHT9_p{position: absolute;width:4.5%;height:4%;left:14.6%;top:64%;}
  .positionHT10{position: absolute;width:2.5%;height:4%;border:1px solid #50fc08;left:18.6%;top:37%;}
  .positionHT10_p{position: absolute;width:2.5%;height:4%;left:18.6%;top:37%;}
  .positionHT11{position: absolute;width:2.5%;height:4%;border:1px solid #50fc08;left:18.6%;top:35%;}
  .positionHT11_p{position: absolute;width:2.5%;height:4%;left:18.6%;top:35%;}
  .positionHT12{position: absolute;width:2.5%;height:4%;border:1px solid #50fc08;left:30.6%;top:39%;}
  .positionHT12_p{position: absolute;width:2.5%;height:4%;left:30.6%;top:39%;}

  .positionRT1{position: absolute;width:2.5%;height:4%;border:1px solid #50fc08;left:30.6%;top:37%;}
  .positionRT1_p{position: absolute;width:2.5%;height:4%;left:30.6%;top:37%;}
  .positionRT2{position: absolute;width:2.5%;height:2%;border:1px solid #50fc08;left:18.6%;top:28%;}
  .positionRT2_p{position: absolute;width:2.5%;height:2%;left:18.6%;top:28%;}
  .positionRT3{position: absolute;width:2.5%;height:2%;border:1px solid #50fc08;left:18.6%;top:31%;}
  .positionRT3_p{position: absolute;width:2.5%;height:2%;left:18.6%;top:31%;}
  .positionRT4{position: absolute;width:2.5%;height:2%;border:1px solid #50fc08;left:31%;top:31.6%;}
  .positionRT4_p{position: absolute;width:2.5%;height:2%;left:31%;top:31.6%;}
  .positionRT5{position: absolute;width:2.5%;height:2%;border:1px solid #50fc08;left:31%;top:34.6%;}
  .positionRT5_p{position: absolute;width:2.5%;height:2%;left:31%;top:34.6%;}
  .positionRT6{position: absolute;width:4.5%;height:4%;border:1px solid #50fc08;left:14.6%;top:72%;}
  .positionRT6_p{position: absolute;width:4.5%;height:4%;left:14.6%;top:72%;}
  .positionRT7{position: absolute;width:3.5%;height:8%;border:1px solid #50fc08;left:39.6%;top:35%;}
  .positionRT7_p{position: absolute;width:3.5%;height:8%;left:39.6%;top:35%;}

  .positionAT1{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:90%;top:25%;}
  .positionAT1_p{position: absolute;width:2%;height:8%;left:90%;top:25%;}
  .positionAT2{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:87.5%;top:15.5%;}
  .positionAT2_p{position: absolute;width:2%;height:8%;left:87.5%;top:15.5%;}
  .positionAT3{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:85.7%;top:25%;}
  .positionAT3_p{position: absolute;width:2%;height:8%;left:85.7%;top:25%;}
  .positionAT4{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:83%;top:15.5%;}
  .positionAT4_p{position: absolute;width:2%;height:8%;left:83%;top:15.5%;}
  .positionAT5{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:81.5%;top:25%;}
  .positionAT5_p{position: absolute;width:2%;height:8%;left:81.5%;top:25%;}
  .positionAT6{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:78.8%;top:15.5%;}
  .positionAT6_p{position: absolute;width:2%;height:8%;left:78.8%;top:15.5%;}
  .positionAT7{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:77%;top:25%;}
  .positionAT7_p{position: absolute;width:2%;height:8%;left:77%;top:25%;}
  .positionAT8{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:74.5%;top:15.5%;}
  .positionAT8_p{position: absolute;width:2%;height:8%;left:74.5%;top:15.5%;}
  .positionAT9{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:73%;top:25%;}
  .positionAT9_p{position: absolute;width:2%;height:8%;left:73%;top:25%;}
  .positionAT10{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:70.5%;top:15.5%;}
  .positionAT10_p{position: absolute;width:2%;height:8%;left:70.5%;top:15.5%;}
  .dtl_AT1{position: absolute;width:3%;height:17%;left:81%;top:60%;border:1px solid #50fc08;}
  .dtl_AT1_p{position: absolute;width:3%;height:17%;left:81%;top:60%;}
  .dtl_AT2{position: absolute;width:3%;height:16%;left:75%;top:38%;border:1px solid #50fc08;}
  .dtl_AT2_p{position: absolute;width:3%;height:16%;left:75%;top:38%;}
  .dtl_AT3{position: absolute;width:3%;height:16%;left:71%;top:60%;border:1px solid #50fc08;}
  .dtl_AT3_p{position: absolute;width:3%;height:16%;left:71%;top:60%;}
  .dtl_AT4{position: absolute;width:3%;height:16%;left:64%;top:38%;border:1px solid #50fc08;}
  .dtl_AT4_p{position: absolute;width:3%;height:16%;left:64%;top:38%;}
  .dtl_AT5{position: absolute;width:3%;height:16%;left:60%;top:60%;border:1px solid #50fc08;}
  .dtl_AT5_p{position: absolute;width:3%;height:16%;left:60%;top:60%;}
  .dtl_AT6{position: absolute;width:3%;height:16%;left:54%;top:38%;border:1px solid #50fc08;}
  .dtl_AT6_p{position: absolute;width:3%;height:16%;left:54%;top:38%;}
  .dtl_AT7{position: absolute;width:3%;height:16%;left:49.7%;top:60%;border:1px solid #50fc08;}
  .dtl_AT7_p{position: absolute;width:3%;height:16%;left:49.7%;top:60%;}
  .dtl_AT8{position: absolute;width:3%;height:16%;left:43.5%;top:38%;border:1px solid #50fc08;}
  .dtl_AT8_p{position: absolute;width:3%;height:16%;left:43.5%;top:38%;}
  .dtl_AT9{position: absolute;width:3%;height:16%;left:39%;top:60%;border:1px solid #50fc08;}
  .dtl_AT9_p{position: absolute;width:3%;height:16%;left:39%;top:60%;}
  .dtl_AT10{position: absolute;width:3%;height:16%;left:33%;top:38%;border:1px solid #50fc08;}
  .dtl_AT10_p{position: absolute;width:3%;height:16%;left:33%;top:38%;}
  /**背景图*/
  .HTRT{width:100%;height:100%;background:url(../../../assets/img/HTRT.png);background-repeat:no-repeat;background-size: 80% 80%;}
  .AT{width:100%;height:100%;background:url(../../../assets/img/AT.png);background-repeat:no-repeat;background-size: 100% 100%;}
  .OVEN1{width:100%;height:142%;background:url(../../../assets/img/APJ_OVEN1.jpg);background-repeat:no-repeat;background-size: 70% 100%;margin-top: 11%;}
  .OVEN2{width:100%;height:150%;background:url(../../../assets/img/APJ_OVEN2.jpg);background-repeat:no-repeat;background-size: 55% 95%;margin-top: 11%;}
  .FREEZER1{width:100%;height:150%;background:url(../../../assets/img/FREEZER1.jpg);background-repeat:no-repeat;background-size: 100% 72%;margin-top: 20%;margin-left: -15%;}
  .FREEZER2{width:100%;height:150%;background:url(../../../assets/img/FREEZER2.png);background-repeat:no-repeat;background-size: 84% 55%;margin-top: 25%;}
  .FREEZER3{width:100%;height:150%;background:url(../../../assets/img/FREEZER3.jpg);background-repeat:no-repeat;background-size: 276px 428px;margin-top: 11%;}
  .CLEAN_US{width:100%;height:150%;background:url(../../../assets/img/APJ_CLEAN_US.jpg);background-repeat:no-repeat;background-size: 70% 95%;margin-top: 11%;}
  .SMA-OVEN1{width:100%;height:200%;background:url(../../../assets/img/SMA_OVEN.png);background-repeat:no-repeat;background-size: 508px 396px;margin-top: 15%;}
  .SIM-OVEN1{width:100%;height:150%;background:url(../../../assets/img/SIM_OVEN1.png);background-repeat:no-repeat;background-size: 51% 95%;margin-top: 11%;margin-left:12%;}
  .SIM-OVEN2{width:100%;height:150%;background:url(../../../assets/img/SIM_OVEN2.png);background-repeat:no-repeat;background-size: 51% 95%;margin-top: 11%;margin-left:12%;}
  .SX_FREEZER{width:100%;height:150%;background:url(../../../assets/img/SX_FREEZER.jpg);background-repeat:no-repeat;background-size: 288px 419px;margin-top:11%;margin-left:10%;}
  .SMA_FREEZER{width:100%;height:150%;background:url(../../../assets/img/SMA_FREEZER.png);background-repeat:no-repeat;background-size: 275px 433px;margin-top:11%;margin-left:12%;}

  .dtl_HT1{width:100%;height:100%;background:url(../../../assets/img/HTRT_G1.png);background-repeat:no-repeat;background-size: 80% 80%;}
  .dtl_HT2{width:100%;height:100%;background:url(../../../assets/img/HTRT_G2.png);background-repeat:no-repeat;background-size: 80% 80%;}
  .dtl_HT3{width:100%;height:100%;background:url(../../../assets/img/HTRT_G3.png);background-repeat:no-repeat;background-size: 80% 80%;}
  .dtl_HT4{width:100%;height:100%;background:url(../../../assets/img/HTRT_G4.png);background-repeat:no-repeat;background-size: 80% 80%;}
  .dtl_HT5{width:100%;height:100%;background:url(../../../assets/img/HTRT_G5.png);background-repeat:no-repeat;background-size: 80% 80%;}
  .dtl_HT6{width:100%;height:100%;background:url(../../../assets/img/HTRT_G6.png);background-repeat:no-repeat;background-size: 80% 80%;}
  .dtl_HT7{width:100%;height:100%;background:url(../../../assets/img/HTRT_G7.png);background-repeat:no-repeat;background-size: 80% 80%;}
  .dtl_HT8{width:100%;height:100%;background:url(../../../assets/img/HTRT_G8.png);background-repeat:no-repeat;background-size: 80% 80%;}
  .dtl_HT9{width:100%;height:100%;background:url(../../../assets/img/HTRT_YR1.png);background-repeat:no-repeat;background-size: 80% 80%;}
  .dtl_HT10{width:100%;height:100%;background:url(../../../assets/img/HTRT_DCW.png);background-repeat:no-repeat;background-size: 80% 80%;}

  .dtl_RT1{width:100%;height:100%;background:url(../../../assets/img/HTRT_ACW.png);background-repeat:no-repeat;background-size: 80% 80%;}
  .dtl_RT2{width:100%;height:100%;background:url(../../../assets/img/HTRT_DCT.png);background-repeat:no-repeat;background-size: 80% 80%;}
  .dtl_RT4{width:100%;height:100%;background:url(../../../assets/img/HTRT_ACT.png);background-repeat:no-repeat;background-size: 80% 80%;}
  .dtl_RT6{width:100%;height:100%;background:url(../../../assets/img/HTRT_YR2.png);background-repeat:no-repeat;background-size: 80% 80%;}
  .dtl_RT7{width:100%;height:100%;background:url(../../../assets/img/HTRT_LQ.png);background-repeat:no-repeat;background-size: 80% 80%;}

  .dtlImg{width:80%;height:80%;margin-left: 10%;margin-top: 0px;}
  .dtlImg-AT2{width:80%;height:80%;background:url(../../../assets/img/AT_DTL.png);background-repeat:no-repeat;background-size: 100% 100%;margin-left: 10%;margin-top: 10%;}
  .dtl_title{position: absolute;margin-top:-7%;margin-left:-10%;font-size: large}
</style>
