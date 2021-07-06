<template>
  <div class="tray_panel">
    <div :class="trayCode">
      <div class="info">
        <div class="eqpId">{{ eqpId }}</div>
        <div class="startTime">{{ startTime }}</div>
      </div>
      <div :class="trayIdFontColor" >{{ trayId }}</div>
    </div>
    <div v-if="trayId.indexOf('J0005') > -1" :style="{width:'6%',height:'3%',top:22+ (12 * y) +'%',left:5+(14 * x) +'%'}" class="frd_pstn"/>
    <div v-if="trayId.indexOf('J0004') > -1" :style="{width:'6%',height:'5%',top:21+ (12 * y) +'%',left:7+(13.5 * x) +'%'}" class="igbt_pstn"/>
    <div v-if="trayId.indexOf('J0006') > -1" :style="{width:'29%',height:'19%',top:5.5+ (22.5 * y) +'%',left:-29+(43 * x) +'%'}" class="dbc_pstn"/>
    <div v-if="trayId.indexOf('J0008') > -1 && eqpId.indexOf('IGBT-SORT2') === -1" :style="{width:'5%',height:'6%',top:25+ (8 * y) +'%',left:8.5+(6.5 * x) +'%'}" class="igbt_dm_pstn"/>
    <div v-if="trayId.indexOf('J0008') > -1 && eqpId.indexOf('IGBT-SORT2') > -1" :style="{width:'5%',height:'6%',top:25+ (8 * y) +'%',left:8.5+(6.5 * x) +'%'}" class="igbt_pstn"/>
    <div v-if="trayId.indexOf('J0009') > -1" :style="{width:'3%',height:'6.5%',top:23+ (8.4 * y) +'%',left:15.5+(4.5 * x) +'%'}" class="frd_pstn"/>
    <div v-if="trayId.indexOf('J0010') > -1" :style="{width:'9%',height:'6.5%',top:35+ (7.2 * y) +'%',left:-3.2+(10.7 * x) +'%'}" class="igbt_dm_pstn"/>
    <div v-if="trayId.indexOf('J0011') > -1" :style="{width:'8.5%',height:'4%',top:28.7+ (4.9 * y) +'%',left:2.1+(10.8 * x) +'%'}" class="frd_pstn"/><!--13,24-->
    <div v-if="trayId.indexOf('J0012') > -1 && eqpId.indexOf('HB2-SORT1') > -1" :style="{width:'37%',height:'38%',top:'41%',left:'32%'}" class="dbc_pstn"/>
    <div v-if="trayId.indexOf('J0012') > -1 && eqpId.indexOf('HB2-SMT1') > -1" :style="{width:'37%',height:'38%',top:'41%',left:'32%'}" class="smt1_pstn"/>
    <div v-if="trayId.indexOf('J0012') > -1 && eqpId.indexOf('HB2-SMT1') === -1 && eqpId.indexOf('HB2-SORT1') === -1" :style="{width:'37%',height:'38%',top:'41%',left:'32%'}" class="smt2_pstn"/>
    <div v-if="trayId.indexOf('J0014') > -1" :style="{width:'4.6%',height:'4%',top:25+ (6 * y) +'%',left:7+(10.6 * x) +'%'}" class="igbt_pstn"/>
    <div v-if="trayId.indexOf('J0015') > -1" :style="{width:'3%',height:'4%',top:24+ (6 * y) +'%',left:7+(9 * x) +'%'}" class="frd_pstn"/>
    <div v-if="trayId.indexOf('J0016') > -1" :style="{width:'22%',height:'13%',top:11+ (17 * y) +'%',left:-23+(42 * x) +'%'}" class="dbc_pstn"/>

  </div>
</template>

<style scoped>
  .J0004{background:url(../../../assets/img/J0004.png);width:100%;height:80%;position: absolute;background-size: 100% 100%; top:20%;}
  .J0005{background:url(../../../assets/img/J0005.png);width:100%;height:80%;position: absolute;background-size: 100% 100%; top:20%;}
  .J0006{background:url(../../../assets/img/J0006.png);width:100%;height:80%;position: absolute;background-size: 100% 100%; top:20%;}
  .J0008{background:url(../../../assets/img/J0008.png);width:100%;height:80%;position: absolute;background-size: 100% 100%; top:20%;}
  .J0009{background:url(../../../assets/img/J0009.png);width:100%;height:80%;position: absolute;background-size: 100% 100%; top:20%;}
  .J0010{background:url(../../../assets/img/J0010.png);width:100%;height:80%;position: absolute;background-size: 100% 100%; top:20%;}
  .J0011{background:url(../../../assets/img/J0011.png);width:100%;height:80%;position: absolute;background-size: 100% 100%; top:20%;}
  .J0012{background:url(../../../assets/img/J0012.png);width:100%;height:80%;position: absolute;background-size: 100% 100%; top:20%;}
  .J0014{background:url(../../../assets/img/J0014.jpg);width:100%;height:80%;position: absolute;background-size: 100% 100%; top:20%;}
  .J0015{background:url(../../../assets/img/J0015.jpg);width:100%;height:80%;position: absolute;background-size: 100% 100%; top:20%;}
  .J0016{background:url(../../../assets/img/J0016.jpg);width:100%;height:80%;position: absolute;background-size: 100% 100%; top:20%;}
  .J0017{background:url(../../../assets/img/J0017.png);width:100%;height:80%;position: absolute;background-size: 100% 100%; top:20%;}
  .J0018{background:url(../../../assets/img/J0018.png);width:100%;height:80%;position: absolute;background-size: 100% 100%; top:20%;}
  .chip{background:url(../../../assets/img/chip.png);width:100%;height:80%;position: absolute;background-size: 100% 100%; top:20%;}
  .igbt_pstn{position: absolute;border:1px solid greenyellow;background:url(../../../assets/img/igbt.png);background-size: 100% 100%;}
  .igbt_dm_pstn{position: absolute;border:1px solid greenyellow;background:url(../../../assets/img/igbt_dm.png);background-size: 100% 100%;}
  .frd_pstn{position: absolute;border:1px solid greenyellow;background:url(../../../assets/img/frd.png);background-size: 100% 100%;}
  .dbc_pstn{position: absolute;border:1px solid greenyellow;background:url(../../../assets/img/dbc.png);background-size: 100% 100%;}
  .smt1_pstn{position: absolute;border:1px solid greenyellow;background:url(../../../assets/img/smt1.png);background-size: 100% 100%;}
  .smt2_pstn{position: absolute;border:1px solid greenyellow;background:url(../../../assets/img/smt2.png);background-size: 100% 100%;}
  .tray_pstn{position: absolute;border:1px solid greenyellow;}

  .info{width:100%;height:20%;position: absolute;top:-20%;}
  .lightFont{width:36%;height:12%;position: absolute;top:88%;left:46%;}
  .blackFont{width:36%;height:12%;position: absolute;top:88%;left:46%;color:#00ff00}
  .info .eqpId{width:100%;height:60%;position: absolute;top:-10%;}
  .info .startTime{width:100%;height:50%;position: absolute;top:50%}
</style>

<script>
export default {
  name: 'ChipTray',
  props: {
    x: {
      type: Number,
      default: function() {
        return 0
      }
    },
    y: {
      type: Number,
      default: function() {
        return 0
      }
    },
    trayId: {
      type: String,
      default: function() {
        return ''
      }
    },
    startTime: {
      type: String,
      default: function() {
        return ''
      }
    },
    eqpId: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {
      trayCode: '',
      trayIdFontColor: ''
    }
  },
  mounted() {
    if (this.trayId.indexOf('J00') > -1) {
      this.trayCode = this.trayId.substr(0, 5)
    } else {
      this.trayCode = 'chip'
    }
    if (this.trayId.indexOf('J0014') > -1 || this.trayId.indexOf('J0015') > -1 || this.trayId.indexOf('J0016') > -1 || this.trayId.indexOf('J0008') > -1 || this.trayId.indexOf('J0012') > -1) {
      this.trayIdFontColor = 'blackFont'
    } else {
      this.trayIdFontColor = 'lightFont'
    }
  },
  methods: {
  }
}
</script>
