<template>
	<div class="chipImg">
		<div v-show="imgUrl==='SX680'" class="sx680">
			<div :class="imgOption==='SX680DI-1' || imgOption==='SX680DI-2'?'DI_act':'sxDI_bg'" class="sx680DI1_position small" @click="positionClk('DI-1')">DI-1/2</div>
			<div :class="imgOption==='SX680DI-1' || imgOption==='SX680DI-2'?'DI_act':'sxDI_bg'" class="sx680DI2_a_position small" @click="positionClk('DI-1')">DI-1/2</div>
			<div :class="imgOption==='SX680DI-1' || imgOption==='SX680DI-2'?'DI_act':'sxDI_bg'" class="sx680DI2_b_position small" @click="positionClk('DI-2')">DI-1/2</div>
			<div :class="imgOption==='SX680MOS-3'?'MOS_act':'sxMOS90_bg'" class="sx680MOS3_a_position small" @click="positionClk('MOS-3')">MOS-3</div>
			<div :class="imgOption==='SX680MOS-3'?'MOS_act':'sxMOS90_bg'" class="sx680MOS3_b_position small" @click="positionClk('MOS-3')">MOS-3</div>
			<div :class="imgOption==='SX680MOS-4'?'MOS_act':'sxMOS90_bg'" class="sx680MOS4_a_position small" @click="positionClk('MOS-4')">MOS-4</div>
			<div :class="imgOption==='SX680MOS-4'?'MOS_act':'sxMOS90_bg'" class="sx680MOS4_b_position small" @click="positionClk('MOS-4')">MOS-4</div>
			<div :class="imgOption==='SX680MOS-5'?'MOS_act':'sxMOS90_bg'" class="sx680MOS5_a_position small" @click="positionClk('MOS-5')">MOS-5</div>
			<div :class="imgOption==='SX680MOS-5'?'MOS_act':'sxMOS90_bg'" class="sx680MOS5_b_position small" @click="positionClk('MOS-5')">MOS-5</div>
			<div :class="imgOption==='SX680MIC-D-7'?'MIC_act':'sxMIC6_bg'" class="sx680MIC6_position small" @click="positionClk('MIC-D-7')">MIC-D-7</div>
			<div :class="imgOption==='SX680MIC-8'?'MIC_act':'sx680MIC7_bg'" class="sx680MIC7_position small" @click="positionClk('MIC-8')">MIC-8</div>
		</div>
		<div v-show="imgUrl==='SX681'" class="sx681">
			<div :class="imgOption==='SX681DI-1'?'DI_act':'sxDI_bg'" class="sx681DI1_position rotate180" @click="positionClk('DI-1')">
				<div class="small rotate180">DI-1</div>
			</div>
			<div :class="imgOption==='SX681DI-2'?'DI_act':'sxDI_bg'" class="sx681DI2_a_position small" @click="positionClk('DI-2')">DI-2</div>
			<div :class="imgOption==='SX681DI-2'?'DI_act':'sxDI_bg'" class="sx681DI2_b_position small" @click="positionClk('DI-2')">DI-2</div>
			<div :class="imgOption==='SX681MOS-3'?'MOS_act':'sxMOS90_bg'" class="sx681MOS3_a_position small" @click="positionClk('MOS-3')">MOS-3</div>
			<div :class="imgOption==='SX681MOS-3'?'MOS_act':'sxMOS_bg'" class="sx681MOS3_b_position small" @click="positionClk('MOS-3')">MOS-3</div>
			<div :class="imgOption==='SX681MOS-4'?'MOS_act':'sxMOS90_bg'" class="sx681MOS4_a_position small" @click="positionClk('MOS-4')">MOS-4</div>
			<div :class="imgOption==='SX681MOS-4'?'MOS_act':'sxMOS90_bg'" class="sx681MOS4_b_position small" @click="positionClk('MOS-4')">MOS-4</div>
			<div :class="imgOption==='SX681MOS-5'?'MOS_act':'sxMOS90_bg'" class="sx681MOS5_a_position small" @click="positionClk('MOS-5')">MOS-5</div>
			<div :class="imgOption==='SX681MOS-5'?'MOS_act':'sxMOS90_bg'" class="sx681MOS5_b_position small" @click="positionClk('MOS-5')">MOS-5</div>
			<div :class="imgOption==='SX681JP-6'?'MIC_act':'sxMIC_bg'" class="sx681MIC5_a_position small" @click="positionClk('JP-6')">JP-6</div>
			<div :class="imgOption==='SX681JP-6'?'MIC_act':'sxMIC_bg'" class="sx681MIC5_b_position rotate180" @click="positionClk('JP-6')">
				<div class="small rotate180">JP-6</div>
			</div>
			<div :class="imgOption==='SX681MIC-D-7'?'MIC_act':'sxMIC7_bg'" class="sx681MIC7_position small" @click="positionClk('MIC-D-7')">MIC-D-7</div>
			<div :class="imgOption==='SX681MIC-8'?'MIC_act':'sxMIC8_bg'" class="sx681MIC8_position small" @click="positionClk('MIC-8')">MIC-8</div>
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

	/**位置块文字的样式*/
	.small{font-size: small;text-align:center;line-height: 22px;font-weight: 900;}

	/**位置块 的位置*/
	.sx680DI1_position{width:5%;height:9%;top: 57.5%;left: 7.2%;}
	.sx680DI2_a_position{width:5%;height:8%;top: 57.5%;left: 14.2%;}
	.sx680DI2_b_position{width:5%;height:8%;top: 69.5%;left: 14.5%;}
	.sx680MOS3_a_position{width:7.2%;height:14%;top: 31.5%;left: 17.5%;}
	.sx680MOS3_b_position{width:7.4%;height:14%;top: 31.5%;left: 28%;}
	.sx680MOS4_a_position{width:7.4%;height:14%;top: 31.5%;left: 38.5%;}
	.sx680MOS4_b_position{width:7.2%;height:14%;top: 31.5%;left: 56.4%;}
	.sx680MOS5_a_position{width:7.4%;height:14%;top: 31.5%;left: 67.5%;}
	.sx680MOS5_b_position{width:7.4%;height:14%;top: 31.5%;left: 79%;}
	.sx680MIC6_position{width:15.4%;height:18%;top: 57.5%;left: 25.5%;}
	.sx680MIC7_position{width:11.1%;height:16%;top: 59.5%;left: 66%;}

	.sx681DI1_position{width:5.6%;height:10%;top: 53.5%;left: 85%;}
	.sx681DI2_a_position{width:5.6%;height:10%;top:43%;left:7%;}
	.sx681DI2_b_position{width:5.6%;height:10%;top:58%;left:7%;}
	.sx681MOS3_a_position{width:8.5%;height:18%;top: 15%;left: 73%;}
	.sx681MOS3_b_position{width:9.8%;height:16%;top: 25.5%;left: 86%;}
	.sx681MOS4_a_position{width:8.2%;height:18%;top: 15%;left: 42.5%;}
	.sx681MOS4_b_position{width:8.5%;height:18%;top: 15%;left: 55.5%;}
	.sx681MOS5_a_position{width:9%;height:15%;top: 18%;left: 9%;}
	.sx681MOS5_b_position{width:8.5%;height:18%;top: 15%;left: 30.5%;}
	.sx681MIC5_a_position{width:15%;height:13%;top: 42%;left: 16%;}
	.sx681MIC5_b_position{width:15%;height:13%;top: 42%;left: 65.5%;}
	.sx681MIC7_position{width:20.5%;height:21%;top: 42%;left: 39.5%;}
	.sx681MIC8_position{width:16.5%;height:16%;top: 69%;left: 41.5%;}

	/**位置块 的背景图片*/
	.sxDI_bg{background:url(../../../assets/img/DI.jpg);}
	.sxMOS90_bg{background:url(../../../assets/img/MOS90.jpg);}
	.sxMOS_bg{background:url(../../../assets/img/MOS.jpg);}
	.sxMIC_bg{background:url(../../../assets/img/MIC.jpg);}
	.sxMIC6_bg{background:url(../../../assets/img/MIC6.jpg);}
	.sxMIC7_bg{background:url(../../../assets/img/MIC7.jpg);}
	.sxMIC8_bg{background:url(../../../assets/img/MIC8.jpg);}
	.sx680MIC7_bg{background:url(../../../assets/img/680MIC7.jpg);}

	/**位置块 被选中的背景颜色*/
	.DI_act{background-color:#3cbf3c;}
	.MOS_act{background-color:#f71286;}
	.MIC_act{background-color:#08a9c3;}

	/**旋转角度,尽量不要转特殊角度，容易图片不清晰*/
	.rotate180{transform:rotate(180deg);}
	.rotate180 div{width:100%;height:100%;}
</style>
