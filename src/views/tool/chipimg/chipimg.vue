<template>
	<div class="chipImg">
		<!--SX-->
		<div v-show="imgUrl==='SX680'" class="sx680">
			<div :class="imgOption==='SX680DI-1' || imgOption==='SX680DI-2'?'DI_act':'sxDI_bg'" class="sx680DI1_position smaller" @click="positionClk('DI-1')">DI-1/2</div>
			<div :class="imgOption==='SX680DI-1' || imgOption==='SX680DI-2'?'DI_act':'sxDI_bg'" class="sx680DI2_a_position smaller" @click="positionClk('DI-1')">DI-1/2</div>
			<div :class="imgOption==='SX680DI-1' || imgOption==='SX680DI-2'?'DI_act':'sxDI_bg'" class="sx680DI2_b_position smaller" @click="positionClk('DI-2')">DI-1/2</div>
			<div :class="imgOption==='SX680MOS-3'?'MOS_act':'sxMOS90_bg'" class="sx680MOS3_a_position smaller" @click="positionClk('MOS-3')">MOS-3</div>
			<div :class="imgOption==='SX680MOS-3'?'MOS_act':'sxMOS90_bg'" class="sx680MOS3_b_position smaller" @click="positionClk('MOS-3')">MOS-3</div>
			<div :class="imgOption==='SX680MOS-4'?'MOS_act':'sxMOS90_bg'" class="sx680MOS4_a_position smaller" @click="positionClk('MOS-4')">MOS-4</div>
			<div :class="imgOption==='SX680MOS-4'?'MOS_act':'sxMOS90_bg'" class="sx680MOS4_b_position smaller" @click="positionClk('MOS-4')">MOS-4</div>
			<div :class="imgOption==='SX680MOS-5'?'MOS_act':'sxMOS90_bg'" class="sx680MOS5_a_position smaller" @click="positionClk('MOS-5')">MOS-5</div>
			<div :class="imgOption==='SX680MOS-5'?'MOS_act':'sxMOS90_bg'" class="sx680MOS5_b_position smaller" @click="positionClk('MOS-5')">MOS-5</div>
			<div :class="imgOption==='SX680MIC-D-7'?'MIC_act':'sxMIC6_bg'" class="sx680MIC6_position smaller" @click="positionClk('MIC-D-7')">MIC-D-7</div>
			<div :class="imgOption==='SX680MIC-8'?'MIC_act':'sx680MIC7_bg'" class="sx680MIC7_position smaller" @click="positionClk('MIC-8')">MIC-8</div>
		</div>
		<div v-show="imgUrl==='SX681'" class="sx681">
			<div :class="imgOption==='SX681DI-1'?'DI_act':'sxDI180_bg'" class="sx681DI1_position smaller" @click="positionClk('DI-1')">DI-1</div>
			<div :class="imgOption==='SX681DI-2'?'DI_act':'sxDI_bg'" class="sx681DI2_a_position smaller" @click="positionClk('DI-2')">DI-2</div>
			<div :class="imgOption==='SX681DI-2'?'DI_act':'sxDI_bg'" class="sx681DI2_b_position smaller" @click="positionClk('DI-2')">DI-2</div>
			<div :class="imgOption==='SX681MOS-3'?'MOS_act':'sxMOS90_bg'" class="sx681MOS3_a_position smaller" @click="positionClk('MOS-3')">MOS-3</div>
			<div :class="imgOption==='SX681MOS-3'?'MOS_act':'sxMOS_bg'" class="sx681MOS3_b_position smaller" @click="positionClk('MOS-3')">MOS-3</div>
			<div :class="imgOption==='SX681MOS-4'?'MOS_act':'sxMOS90_bg'" class="sx681MOS4_a_position smaller" @click="positionClk('MOS-4')">MOS-4</div>
			<div :class="imgOption==='SX681MOS-4'?'MOS_act':'sxMOS90_bg'" class="sx681MOS4_b_position smaller" @click="positionClk('MOS-4')">MOS-4</div>
			<div :class="imgOption==='SX681MOS-5'?'MOS_act':'sxMOS90_bg'" class="sx681MOS5_a_position smaller" @click="positionClk('MOS-5')">MOS-5</div>
			<div :class="imgOption==='SX681MOS-5'?'MOS_act':'sxMOS90_bg'" class="sx681MOS5_b_position smaller" @click="positionClk('MOS-5')">MOS-5</div>
			<div :class="imgOption==='SX681JP-6'?'MIC_act':'sxMIC_bg'" class="sx681MIC5_a_position smaller" @click="positionClk('JP-6')">JP-6</div>
			<div :class="imgOption==='SX681JP-6'?'MIC_act':'sxMIC180_bg'" class="sx681MIC5_b_position smaller" @click="positionClk('JP-6')">JP-6</div>
			<div :class="imgOption==='SX681MIC-D-7'?'MIC_act':'sxMIC7_bg'" class="sx681MIC7_position smaller" @click="positionClk('MIC-D-7')">MIC-D-7</div>
			<div :class="imgOption==='SX681MIC-8'?'MIC_act':'sxMIC8_bg'" class="sx681MIC8_position smaller" @click="positionClk('MIC-8')">MIC-8</div>
		</div>

		<!--SIM-->
		<div v-show="imgUrl==='SIM'" class="sim">
			<div :class="imgOption==='SIMDI-1'?'DI_act':'simDI_bg'" class="simDI1_position smaller" @click="positionClk('DI-1')">DI-1</div>
			<div :class="imgOption==='SIMDI-2'?'DI_act':'simDI_bg'" class="simDI2_a_position smaller" @click="positionClk('DI-2')">DI-2</div>
			<div :class="imgOption==='SIMDI-2'?'DI_act':'simDI_bg'" class="simDI2_b_position smaller" @click="positionClk('DI-2')">DI-2</div>
			<div :class="imgOption==='SIMMOS-5'?'MOS_act':'simMOS_bg'" class="simMOS3_a_position smaller" @click="positionClk('MOS-5')">MOS-5</div>
			<div :class="imgOption==='SIMMOS-5'?'MOS_act':'simMOS_bg'" class="simMOS3_b_position smaller" @click="positionClk('MOS-5')">MOS-5</div>
			<div :class="imgOption==='SIMMOS-4'?'sim_mos4_act':'simMOS4_bg'" class="simMOS4_a_position smaller" @click="positionClk('MOS-4')">MOS-4</div>
			<div :class="imgOption==='SIMMOS-4'?'MOS_act':'simMOS_bg'" class="simMOS4_b_position smaller" @click="positionClk('MOS-4')">MOS-4</div>
			<div :class="imgOption==='SIMMOS-3'?'MOS_act':'simMOS_bg'" class="simMOS5_a_position smaller" @click="positionClk('MOS-3')">MOS-3</div>
			<div :class="imgOption==='SIMMOS-3'?'MOS_act':'simMOS_bg'" class="simMOS5_b_position smaller" @click="positionClk('MOS-3')">MOS-3</div>
			<div :class="imgOption==='SIMMIC-D-6'?'MIC_act':'sxMIC6_bg'" class="simMIC6_position smaller" @click="positionClk('MIC-D-6')">MIC-D-6</div>
			<div :class="imgOption==='SIMMIC-7'?'MIC_act':'simMIC7_bg'" class="simMIC7_position smaller" @click="positionClk('MIC-7')">MIC-7</div>
		</div>

		<!--5GI-->
		<div v-show="imgUrl.indexOf('GI5')>-1" class="gi5">
			<!--MIC 透明展示 2860-->
			<div v-show="imgUrl.indexOf('opacity')>-1 && imgUrl.indexOf('GI5_2860')>-1" :class="imgOption.indexOf('MIC')>-1?'MIC_act':'gi5MIC_2860'" class="gi5mic_2860_position smaller opacity">MIC</div>
			<!--MIC 不透明展示 2860/28645-->
			<div v-show="imgUrl.indexOf('opacity')<0 && imgUrl.indexOf('GI5_2860')>-1" :class="imgOption.indexOf('MIC')>-1?'MIC_act':'gi5MIC_2860'" class="gi5mic_2860_position smaller" @click="positionClk('MIC')">MIC</div>

			<!--MIC 透明展示 28645-->
			<div v-show="imgUrl.indexOf('opacity')>-1 && imgUrl.indexOf('GI5_28645')>-1" :class="imgOption.indexOf('MIC')>-1?'MIC_act':'gi5MIC_2860'" class="gi5_mic_position smaller opacity">MIC</div>
			<!--MIC 不透明展示 2860/28645-->
			<div v-show="imgUrl.indexOf('opacity')<0 && imgUrl.indexOf('GI5_28645')>-1" :class="imgOption.indexOf('MIC')>-1?'MIC_act':'gi5MIC_2860'" class="gi5_mic_position smaller" @click="positionClk('MIC')">MIC</div>

			<!--MIC 透明展示 2866-->
			<div v-show="imgUrl.indexOf('opacity')>-1 && imgUrl.indexOf('GI5_2866')>-1" :class="imgOption.indexOf('MIC')>-1?'MIC_act':'gi5MIC_2860'" class="gi5_2866_position smaller opacity">MIC</div>
			<!--MIC 不透明展示 2866-->
			<div v-show="imgUrl.indexOf('opacity')<0 && imgUrl.indexOf('GI5_2866')>-1" :class="imgOption.indexOf('MIC')>-1?'MIC_act':'gi5MIC_2860'" class="gi5_2866_position smaller" @click="positionClk('MIC')">MIC</div>
			<!--IGBT 展示 2860-->
			<div v-show="imgUrl.indexOf('GI5_2860')>-1" :class="imgOption.indexOf('IGBT')>-1?'MIC_act':'gi5IGBT_2860'" class="gi5_igbt_position smaller" @click="positionClk('IGBT')">IGBT</div>
			<!--IGBT 展示 28645/2866-->
			<div v-show="imgUrl.indexOf('GI5_2860')<0" :class="imgOption.indexOf('IGBT')>-1?'MIC_act':'gi5IGBT_28645'" class="gi5_igbt_position smaller" @click="positionClk('IGBT')">IGBT</div>
		</div>

		<!--6GI-->
		<div v-show="imgUrl.indexOf('GI6')>-1" class="gi6">
			<!--IGBT 展示-->
			<div :class="imgOption.indexOf('opacityIGBT')>-1?'MIC_act':'gi5IGBT_bg'" class="gi6_igbt_position smaller" @click="positionClk('IGBT')">IGBT</div>
			<!--MIC 透明展示-->
			<div v-show="imgUrl.indexOf('opacity')>-1" :class="imgOption==='GI6MIC'?'MIC_act':'sxMIC6_bg'" class="gi6_mic_position smaller opacity">MIC</div>
			<!--MIC 不透明展示-->
			<div v-show="imgUrl.indexOf('opacity')<0" :class="imgOption==='GI6MIC'?'MIC_act':'sxMIC6_bg'" class="gi6_mic_position smaller" @click="positionClk('MIC')">MIC</div>
			<!--DIOD 透明展示-->
			<div v-show="imgUrl.indexOf('opacity')>-1" :class="imgOption==='GI6DIOD'?'MIC_act':'gi5DIOD_bg'" class="gi6_diod_position smaller opacity">DIOD</div>
			<!--DIOD 不透明展示-->
			<div v-show="imgUrl.indexOf('opacity')<0" :class="imgOption==='GI6DIOD'?'MIC_act':'gi5DIOD_bg'" class="gi6_diod_position smaller" @click="positionClk('DIOD')">DIOD</div>
			<!--C 透明展示-->
			<div v-show="imgUrl.indexOf('opacity')>-1" :class="imgOption==='GI6C'?'MIC_act':'gi5C_bg'" class="gi6_c_position smaller opacity">C</div>
			<!--C 不透明展示-->
			<div v-show="imgUrl.indexOf('opacity')<0" :class="imgOption==='GI6C'?'MIC_act':'gi5C_bg'" class="gi6_c_position smaller" @click="positionClk('C')">C</div>
		</div>

		<!--SMA-->
		<div v-show="imgUrl==='SMA'" class="sma">
			<div :class="imgOption==='SMADI-1'?'DI_act':'DI270_bg'" class="smaDI1_a_position smaller" @click="positionClk('DI-1')">DI-1</div>
			<div :class="imgOption==='SMADI-1'?'DI_act':'simDI_bg'" class="smaDI1_b_position smaller" @click="positionClk('DI-1')">DI-1</div>
			<div :class="imgOption==='SMADI-1'?'DI_act':'sxDI180_bg'" class="smaDI1_c_position smaller" @click="positionClk('DI-1')">DI-1</div>
			<div :class="imgOption==='SMAMIC-D-3'?'MIC_act':'gi5MIC_bg'" class="smaMIC3_position smaller" @click="positionClk('MIC-D-3')">MIC-D-3</div>
			<div :class="imgOption==='SMAMOS-3-4'?'MOS_act':'smaMOS_bg'" class="smaMOS4_a_position smaller" @click="positionClk('MOS-3-4')">MOS-3-4</div>
			<div :class="imgOption==='SMAMOS-3-4'?'MOS_act':'smaMOS_bg'" class="smaMOS4_b_position smaller" @click="positionClk('MOS-3-4')">MOS-3-4</div>
			<div :class="imgOption==='SMAMOS-3-4'?'MOS_act':'smaMOS_bg'" class="smaMOS4_c_position smaller" @click="positionClk('MOS-3-4')">MOS-3-4</div>
			<div :class="imgOption==='SMAMOS-2'?'MOS_act':'smaMOS_bg'" class="smaMOS2_a_position smaller" @click="positionClk('MOS-2')">MOS-2</div>
			<div :class="imgOption==='SMAMOS-2'?'MOS_act':'smaMOS_bg'" class="smaMOS2_b_position smaller" @click="positionClk('MOS-2')">MOS-2</div>
			<div :class="imgOption==='SMAMOS-2'?'MOS_act':'smaMOS_bg'" class="smaMOS2_c_position smaller" @click="positionClk('MOS-2')">MOS-2</div>
			<div :class="imgOption==='SMAMIC-5'?'MIC_act':'simMIC7_bg'" class="smaMIC5_position smaller" @click="positionClk('MIC-5')">MIC-5</div>
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
      type: String,
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
	.chipImg{width:100%;height:100%;background-repeat:no-repeat;background-size: 100% 100%;}
	.chipImg div{position: absolute;background-repeat:no-repeat;background-size: 100% 100%;overflow: hidden;}

	/**背景图*/
	.sx680{width:100%;height:100%;background:url(../../../assets/img/SX680.png);background-repeat:no-repeat;background-size: 100% 100%;}
	.sx681{width:100%;height:100%;background:url(../../../assets/img/SX681.png);background-repeat:no-repeat;background-size: 100% 100%;}
	.sim{width:100%;height:100%;background:url(../../../assets/img/SIM.png);background-repeat:no-repeat;background-size: 100% 100%;}
	.gi5{width:100%;height:100%;background:url(../../../assets/img/5GI.png);background-repeat:no-repeat;background-size: 100% 100%;}
	.gi6{width:100%;height:100%;background:url(../../../assets/img/6GI.png);background-repeat:no-repeat;background-size: 100% 100%;}
	.sma{width:100%;height:100%;background:url(../../../assets/img/SMA.png);background-repeat:no-repeat;background-size: 100% 100%;}

	/**位置块文字的样式*/
	.smaller{text-align:center;line-height: 22px;font-weight: 900;font-size:10px;display:block;-webkit-transform:scale(0.7);}

	/**位置块 的位置*/
	.sx680DI1_position{width:8.3%;height:12.6%;top: 55.6%;left: 7%;}
	.sx680DI2_a_position{width:8.3%;height:12%;top: 55.5%;left: 14.2%;}
	.sx680DI2_b_position{width:8.3%;height:12%;top: 67.5%;left: 15%;}
	.sx680MOS3_a_position{width:11%;height:20%;top: 28.5%;left: 18%;padding-top: 15px;}
	.sx680MOS3_b_position{width:11%;height:20%;top: 28.5%;left: 29.5%;padding-top: 15px;}
	.sx680MOS4_a_position{width:11%;height:20%;top: 28.5%;left: 41%;padding-top: 15px;}
	.sx680MOS4_b_position{width:11%;height:20%;top: 28.5%;left: 60.6%;padding-top: 15px;}
	.sx680MOS5_a_position{width:11%;height:20%;top: 28.5%;left: 73%;padding-top: 15px;}
	.sx680MOS5_b_position{width:11%;height:20%;top: 28.5%;left: 86%;padding-top: 15px;}
	.sx680MIC6_position{width:23.4%;height:25%;top: 54.5%;left: 25%;padding-top: 20px;}
	.sx680MIC7_position{width:17.1%;height:21%;top: 57.5%;left: 70.5%;padding-top: 15px;}

	.sx681DI1_position{width:7.6%;height:14%;top: 51.5%;left: 84%;padding-top: 6px;}
	.sx681DI2_a_position{width:8.5%;height:15%;top:41%;left:5.5%;padding-top: 6px;}
	.sx681DI2_b_position{width:8.5%;height:15%;top:55%;left:5.5%;padding-top: 6px;}
	.sx681MOS3_a_position{width:11.5%;height:24%;top: 12%;left: 71.5%;padding-top: 15px;}
	.sx681MOS3_b_position{width:13.8%;height:22%;top: 21.5%;left: 84%;padding-top: 15px;}
	.sx681MOS4_a_position{width:11.8%;height:24%;top: 12%;left: 40.5%;padding-top: 15px;}
	.sx681MOS4_b_position{width:11.5%;height:24%;top: 12%;left: 54%;padding-top: 15px;}
	.sx681MOS5_a_position{width:13.5%;height:21%;top: 15%;left: 7%;padding-top: 15px;}
	.sx681MOS5_b_position{width:11.5%;height:24%;top: 12%;left: 29%;padding-top: 15px;}
	.sx681MIC5_a_position{width:21%;height:17%;top: 40%;left: 13%;padding-top: 11px;}
	.sx681MIC5_b_position{width:21%;height:17%;top: 40%;left: 62.5%;padding-top: 11px;}
	.sx681MIC7_position{width:29.5%;height:30%;top: 37%;left: 35%;padding-top: 20px;}
	.sx681MIC8_position{width:23.5%;height:23%;top: 66%;left: 38%;padding-top: 15px;}

	.simDI1_position{width:6.6%;height:12%;top: 29%;left: 69.8%;}
	.simDI2_a_position{width:6.6%;height:12%;top: 34%;left: 74.8%;}
	.simDI2_b_position{width:6.6%;height:12%;top: 36%;left: 79.8%;}
	.simMOS3_a_position{width:10%;height:25%;top: 51%;left: 16.8%;padding-top: 20px;}
	.simMOS3_b_position{width:10%;height:25%;top: 51%;left: 25%;padding-top: 20px;}
	.simMOS4_a_position{width:13%;height:28%;top: 29%;left: 33.3%;padding-top: 20px;}
	.simMOS4_b_position{width:10%;height:25%;top: 51%;left: 51%;padding-top: 20px;}
	.simMOS5_a_position{width:10%;height:25%;top: 51%;left: 58.4%;padding-top: 20px;}
	.simMOS5_b_position{width:10%;height:25%;top: 51%;left: 66%;padding-top: 20px;}
	.simMIC6_position{width:12%;height:22%;top: 24%;left: 58.5%;padding-top: 18px;}
	.simMIC7_position{width:12%;height:22%;top: 24%;left: 21.5%;padding-top: 18px;}
	.gi5_igbt_position{width:64%;height:30%;top: 26%;left: 34%;padding-top: 45px;}
	.gi5_mic_position{width:84%;height:25%;top: 60%;left: -4.4%;padding-top: 40px;}
	.gi5mic_2860_position{width:96%;height:25%;top: 60%;left: -10.4%;padding-top: 40px;}
	.gi6_igbt_position{width:71%;height:29%;top: 27.8%;left: 24.6%;padding-top: 46px;}
	.gi6_mic_position{width:29%;height:32%;top: 56.8%;left: 46.4%;padding-top: 45px;}
	.gi6_diod_position{width:32%;height:11%;top: 59.5%;left: 16%;padding-top: 8px;}
	.gi6_c_position{width:28%;height:10%;top: 73.5%;left: 16.6%;padding-top: 8px;color:white}
	.gi5_igbtselect{width:64%;height:30%;top: 26%;left: 34%;border:1px solid red;}
	.gi5KD_mic_position{width:84%;height:25%;top: 60%;left: -4.4%;padding-top: 40px;opacity: 0.6;}
	.gi5_2866_position{width:75%;height:25%;top: 60%;left: -0.4%;padding-top: 40px;}

	.smaDI1_a_position{width:6%;height:15%;top: 24%;left: 9.6%;}
	.smaDI1_b_position{width:6%;height:15%;top: 39%;left: 9.6%;}
	.smaDI1_c_position{width:6%;height:15%;top: 53.5%;left: 9.6%;}
	.smaMIC3_position{width:11%;height:44%;top: 25%;left: 18.6%;padding-top: 36px;}/**writing-mode: vertical-rl;padding-right: 14px;*/
	.smaMOS4_a_position{width:13.2%;height:19%;top: 20%;left: 32.4%;padding-top: 15px;}
	.smaMOS4_b_position{width:13.2%;height:19%;top: 35%;left: 32.4%;padding-top: 15px;}
	.smaMOS4_c_position{width:13.2%;height:19%;top: 50%;left: 32.4%;padding-top: 15px;}
	.smaMOS2_a_position{width:12.2%;height:19%;top: 26%;left: 55.4%;padding-top: 15px;}
	.smaMOS2_b_position{width:12.2%;height:19%;top: 50%;left: 55.4%;padding-top: 15px;}
	.smaMOS2_c_position{width:12.2%;height:19%;top: 21%;left: 72.2%;padding-top: 15px;}
	.smaMIC5_position{width:9.2%;height:24%;top: 46%;left: 72.2%;padding-top: 15px;}

	/**位置块 的背景图片*/
	.sxDI_bg{background:url(../../../assets/img/DI.png);}
	.sxDI180_bg{background:url(../../../assets/img/DI180.png);}
	.sxMOS90_bg{background:url(../../../assets/img/MOS90.jpg);}
	.sxMOS_bg{background:url(../../../assets/img/MOS.jpg);}
	.sxMIC_bg{background:url(../../../assets/img/MIC.jpg);}
	.sxMIC180_bg{background:url(../../../assets/img/MIC180.jpg);}
	.sxMIC6_bg{background:url(../../../assets/img/MIC6.jpg);}
	.sxMIC7_bg{background:url(../../../assets/img/MIC7.jpg);}
	.sxMIC8_bg{background:url(../../../assets/img/MIC8.jpg);}
	.sx680MIC7_bg{background:url(../../../assets/img/680MIC7.jpg);}
	.simMOS_bg{background:url(../../../assets/img/SIM_MOS.png);}
	.simMOS4_bg{background:url(../../../assets/img/SIM_MOS4_a.png);}
	.simMIC7_bg{background:url(../../../assets/img/SIM_MIC7.png);}
	.simDI_bg{background:url(../../../assets/img/DI90.png);}
	.gi5MIC_bg{background:url(../../../assets/img/5GI_MIC.jpg);}
	.gi5IGBT_bg{background:url(../../../assets/img/5GI_IGBT.png);}
	.gi5DIOD_bg{background:url(../../../assets/img/DIOD.png);}
	.gi5C_bg{background:url(../../../assets/img/5GI_C.png);}
	.smaMOS_bg{background:url(../../../assets/img/SMA_MOS.png);}
	.DI270_bg{background:url(../../../assets/img/DI270.png);}
	.gi5IGBT_2860{background:url(../../../assets/img/5GI_2860IGBT.png);}
	.gi5IGBT_28645{background:url(../../../assets/img/5GI_28645.png);}
	.gi5MIC_2860{background:url(../../../assets/img/5GI_2860MIC.png);}

	/**位置块 被选中的背景颜色*/
	.DI_act{background-color:#3cbf3c;}
	.MOS_act{background-color:#f71286;}
	.MIC_act{background-color:#08a9c3;}
	.sim_mos4_act{background:url(../../../assets/img/SIM_MOS4_act.png);}

	/**旋转角度,尽量不要转特殊角度，容易图片不清晰*/
	.rotate180{transform:rotate(180deg);}
	.rotate180 div{width:100%;height:100%;}

	/**透明度*/
	.opacity{opacity:0.3;}
</style>
