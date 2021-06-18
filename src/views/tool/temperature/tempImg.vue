<template>
  <div class="tempImg">
    <!--高温室温-->
    <div v-show="imgUrl==='APJ-RT' || imgUrl==='APJ-HT'" class="HTRT" >
      <div v-show="imgOption===0 && imgUrl==='APJ-HT'" class="positionHT1" @click="positionClk(0)"/>
      <div v-show="imgOption===1 && imgUrl==='APJ-HT'" class="positionHT2" @click="positionClk(1)"/>
      <div v-show="imgOption===2 && imgUrl==='APJ-HT'" class="positionHT3" @click="positionClk(2)"/>
      <div v-show="imgOption===3 && imgUrl==='APJ-HT'" class="positionHT4" @click="positionClk(3)"/>
      <div v-show="imgOption===4 && imgUrl==='APJ-HT'" class="positionHT5" @click="positionClk(4)"/>
      <div v-show="imgOption===5 && imgUrl==='APJ-HT'" class="positionHT6" @click="positionClk(5)"/>
      <div v-show="imgOption===6 && imgUrl==='APJ-HT'" class="positionHT7" @click="positionClk(6)"/>
      <div v-show="imgOption===7 && imgUrl==='APJ-HT'" class="positionHT8" @click="positionClk(7)"/>
      <div v-show="imgOption===8 && imgUrl==='APJ-HT'" class="positionHT9" @click="positionClk(8)"/>
      <div v-show="imgOption===9 && imgUrl==='APJ-HT'" class="positionHT10" @click="positionClk(9)"/>
      <div v-show="imgOption===10 && imgUrl==='APJ-HT'" class="positionHT11" @click="positionClk(10)"/>
      <div v-show="imgOption===11 && imgUrl==='APJ-HT'" class="positionHT12" @click="positionClk(11)"/>
      <div v-show="imgOption===0 && imgUrl==='APJ-RT'" class="positionRT1" @click="positionClk(0)"/>
      <div v-show="imgOption===1 && imgUrl==='APJ-RT'" class="positionRT2" @click="positionClk(1)"/>
      <div v-show="imgOption===2 && imgUrl==='APJ-RT'" class="positionRT3" @click="positionClk(2)"/>
      <div v-show="imgOption===3 && imgUrl==='APJ-RT'" class="positionRT4" @click="positionClk(3)"/>
      <div v-show="imgOption===4 && imgUrl==='APJ-RT'" class="positionRT5" @click="positionClk(4)"/>
      <div v-show="imgOption===5 && imgUrl==='APJ-RT'" class="positionRT6" @click="positionClk(5)"/>
      <div v-show="imgOption===6 && imgUrl==='APJ-RT'" class="positionRT7" @click="positionClk(6)"/>
    </div>
    <div v-show="imgUrl==='APJ-AT2'" class="AT" >
      <div v-show="imgOption===0 && imgUrl==='APJ-AT2'" class="positionAT1" @click="positionClk(0)"/>
      <div v-show="imgOption===1 && imgUrl==='APJ-AT2'" class="positionAT2" @click="positionClk(1)"/>
      <div v-show="imgOption===2 && imgUrl==='APJ-AT2'" class="positionAT3" @click="positionClk(2)"/>
      <div v-show="imgOption===3 && imgUrl==='APJ-AT2'" class="positionAT4" @click="positionClk(3)"/>
      <div v-show="imgOption===4 && imgUrl==='APJ-AT2'" class="positionAT5" @click="positionClk(4)"/>
      <div v-show="imgOption===5 && imgUrl==='APJ-AT2'" class="positionAT6" @click="positionClk(5)"/>
      <div v-show="imgOption===6 && imgUrl==='APJ-AT2'" class="positionAT7" @click="positionClk(6)"/>
      <div v-show="imgOption===7 && imgUrl==='APJ-AT2'" class="positionAT8" @click="positionClk(7)"/>
      <div v-show="imgOption===8 && imgUrl==='APJ-AT2'" class="positionAT9" @click="positionClk(8)"/>
      <div v-show="imgOption===9 && imgUrl==='APJ-AT2'" class="positionAT10" @click="positionClk(9)"/>
    </div>
    <div v-show="imgUrl==='DETAIL-AT2'" class="dtlImg-AT2" >
      <div v-show="imgUrl==='DETAIL-AT2' && imgOption===0" class="dtl_AT1"/>
      <div v-show="imgUrl==='DETAIL-AT2' && imgOption===1" class="dtl_AT2"/>
      <div v-show="imgUrl==='DETAIL-AT2' && imgOption===2" class="dtl_AT3"/>
      <div v-show="imgUrl==='DETAIL-AT2' && imgOption===3" class="dtl_AT4"/>
      <div v-show="imgUrl==='DETAIL-AT2' && imgOption===4" class="dtl_AT5"/>
      <div v-show="imgUrl==='DETAIL-AT2' && imgOption===5" class="dtl_AT6"/>
      <div v-show="imgUrl==='DETAIL-AT2' && imgOption===6" class="dtl_AT7"/>
      <div v-show="imgUrl==='DETAIL-AT2' && imgOption===7" class="dtl_AT8"/>
      <div v-show="imgUrl==='DETAIL-AT2' && imgOption===8" class="dtl_AT9"/>
      <div v-show="imgUrl==='DETAIL-AT2' && imgOption===9" class="dtl_AT10"/>
    </div>
    <!--详细图片-->
    <div v-show="imgUrl==='DETAIL-HT' || imgUrl==='DETAIL-RT'" class="dtlImg">
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
  .tempImg{width:100%;height:100%;background-repeat:no-repeat;background-size: 100% 100%;}
  .tempImg div{background-repeat:no-repeat;background-size: 100% 100%;overflow: hidden;}
  .positionHT1{position: absolute;width:3%;height:4%;border:1px solid #50fc08;left:14%;top:45%;}
  .positionHT2{position: absolute;width:3%;height:4%;border:1px solid #50fc08;left:17%;top:45%;}
  .positionHT3{position: absolute;width:2.7%;height:4%;border:1px solid #50fc08;left:20%;top:45%;}
  .positionHT4{position: absolute;width:2.5%;height:4%;border:1px solid #50fc08;left:22.5%;top:45%;}
  .positionHT5{position: absolute;width:2.5%;height:4%;border:1px solid #50fc08;left:24.7%;top:45%;}
  .positionHT6{position: absolute;width:2.5%;height:4%;border:1px solid #50fc08;left:27%;top:45%;}
  .positionHT7{position: absolute;width:2.5%;height:4%;border:1px solid #50fc08;left:29.4%;top:45%;}
  .positionHT8{position: absolute;width:2.5%;height:4%;border:1px solid #50fc08;left:31.8%;top:45%;}
  .positionHT9{position: absolute;width:4.5%;height:4%;border:1px solid #50fc08;left:14.6%;top:64%;}
  .positionHT10{position: absolute;width:2.5%;height:4%;border:1px solid #50fc08;left:18.6%;top:37%;}
  .positionHT11{position: absolute;width:2.5%;height:4%;border:1px solid #50fc08;left:18.6%;top:35%;}
  .positionHT12{position: absolute;width:2.5%;height:4%;border:1px solid #50fc08;left:30.6%;top:39%;}

  .positionRT1{position: absolute;width:2.5%;height:4%;border:1px solid #50fc08;left:30.6%;top:37%;}
  .positionRT2{position: absolute;width:2.5%;height:2%;border:1px solid #50fc08;left:18.6%;top:28%;}
  .positionRT3{position: absolute;width:2.5%;height:2%;border:1px solid #50fc08;left:18.6%;top:31%;}
  .positionRT4{position: absolute;width:2.5%;height:2%;border:1px solid #50fc08;left:31%;top:31.6%;}
  .positionRT5{position: absolute;width:2.5%;height:2%;border:1px solid #50fc08;left:31%;top:34.6%;}
  .positionRT6{position: absolute;width:4.5%;height:4%;border:1px solid #50fc08;left:14.6%;top:72%;}
  .positionRT7{position: absolute;width:3.5%;height:8%;border:1px solid #50fc08;left:39.6%;top:35%;}

  .positionAT1{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:90%;top:25%;}
  .positionAT2{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:87.5%;top:15.5%;}
  .positionAT3{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:85.7%;top:25%;}
  .positionAT4{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:83%;top:15.5%;}
  .positionAT5{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:81.5%;top:25%;}
  .positionAT6{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:78.8%;top:15.5%;}
  .positionAT7{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:77%;top:25%;}
  .positionAT8{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:74.5%;top:15.5%;}
  .positionAT9{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:73%;top:25%;}
  .positionAT10{position: absolute;width:2%;height:8%;border:1px solid #50fc08;left:70.5%;top:15.5%;}
  .dtl_AT1{position: absolute;width:4%;height:20%;border:1px solid #50fc08;left:89%;top:54%;}
  .dtl_AT2{position: absolute;width:4%;height:20%;border:1px solid #50fc08;left:81%;top:26%;}
  .dtl_AT3{position: absolute;width:4%;height:20%;border:1px solid #50fc08;left:76%;top:54%;}
  .dtl_AT4{position: absolute;width:4%;height:20%;border:1px solid #50fc08;left:68%;top:26%;}
  .dtl_AT5{position: absolute;width:4%;height:20%;border:1px solid #50fc08;left:63%;top:54%;}
  .dtl_AT6{position: absolute;width:4%;height:20%;border:1px solid #50fc08;left:55%;top:26%;}
  .dtl_AT7{position: absolute;width:4%;height:20%;border:1px solid #50fc08;left:49.7%;top:54%;}
  .dtl_AT8{position: absolute;width:4%;height:20%;border:1px solid #50fc08;left:41.7%;top:26%;}
  .dtl_AT9{position: absolute;width:4%;height:20%;border:1px solid #50fc08;left:37%;top:54%;}
  .dtl_AT10{position: absolute;width:4%;height:20%;border:1px solid #50fc08;left:29%;top:26%;}
  /**背景图*/
  .HTRT{width:100%;height:100%;background:url(../../../assets/img/HTRT.png);background-repeat:no-repeat;background-size: 100% 100%;}
  .AT{width:100%;height:100%;background:url(../../../assets/img/AT.png);background-repeat:no-repeat;background-size: 100% 100%;}

  .dtl_HT1{width:100%;height:100%;background:url(../../../assets/img/HTRT_G1.png);background-repeat:no-repeat;background-size: 100% 100%;}
  .dtl_HT2{width:100%;height:100%;background:url(../../../assets/img/HTRT_G2.png);background-repeat:no-repeat;background-size: 100% 100%;}
  .dtl_HT3{width:100%;height:100%;background:url(../../../assets/img/HTRT_G3.png);background-repeat:no-repeat;background-size: 100% 100%;}
  .dtl_HT4{width:100%;height:100%;background:url(../../../assets/img/HTRT_G4.png);background-repeat:no-repeat;background-size: 100% 100%;}
  .dtl_HT5{width:100%;height:100%;background:url(../../../assets/img/HTRT_G5.png);background-repeat:no-repeat;background-size: 100% 100%;}
  .dtl_HT6{width:100%;height:100%;background:url(../../../assets/img/HTRT_G6.png);background-repeat:no-repeat;background-size: 100% 100%;}
  .dtl_HT7{width:100%;height:100%;background:url(../../../assets/img/HTRT_G7.png);background-repeat:no-repeat;background-size: 100% 100%;}
  .dtl_HT8{width:100%;height:100%;background:url(../../../assets/img/HTRT_G8.png);background-repeat:no-repeat;background-size: 100% 100%;}
  .dtl_HT9{width:100%;height:100%;background:url(../../../assets/img/HTRT_YR1.png);background-repeat:no-repeat;background-size: 100% 100%;}
  .dtl_HT10{width:100%;height:100%;background:url(../../../assets/img/HTRT_DCW.png);background-repeat:no-repeat;background-size: 100% 100%;}

  .dtl_RT1{width:100%;height:100%;background:url(../../../assets/img/HTRT_ACW.png);background-repeat:no-repeat;background-size: 100% 100%;}
  .dtl_RT2{width:100%;height:100%;background:url(../../../assets/img/HTRT_DCT.png);background-repeat:no-repeat;background-size: 100% 100%;}
  .dtl_RT4{width:100%;height:100%;background:url(../../../assets/img/HTRT_ACT.png);background-repeat:no-repeat;background-size: 100% 100%;}
  .dtl_RT6{width:100%;height:100%;background:url(../../../assets/img/HTRT_YR2.png);background-repeat:no-repeat;background-size: 100% 100%;}
  .dtl_RT7{width:100%;height:100%;background:url(../../../assets/img/HTRT_LQ.png);background-repeat:no-repeat;background-size: 100% 100%;}

  .dtlImg{width:100%;height:100%;}
  .dtlImg-AT2{width:100%;height:100%;background:url(../../../assets/img/AT_DTL.png);background-repeat:no-repeat;background-size: 100% 100%;}
</style>
