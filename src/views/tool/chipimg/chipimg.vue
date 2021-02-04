<template>
	<div class="chipImg">
		<div v-show="imgUrl==='SX681'" class="sx681">
			<div v-show="imgOption==='SX681DI-1'" class="sx681DI1"/>
			<div v-show="imgOption==='SX681DI-2'" class="sx681DI2_a"/>
			<div v-show="imgOption==='SX681DI-2'" class="sx681DI2_b"/>
			<div v-show="imgOption==='SX681MOS-3'" class="sx681MOS3_a"/>
			<div v-show="imgOption==='SX681MOS-3'" class="sx681MOS3_b"/>
			<div v-show="imgOption==='SX681MOS-4'" class="sx681MOS4_a"/>
			<div v-show="imgOption==='SX681MOS-4'" class="sx681MOS4_b"/>
			<div v-show="imgOption==='SX681MOS-5'" class="sx681MOS5_a"/>
			<div v-show="imgOption==='SX681MOS-5'" class="sx681MOS5_b"/>
			<div v-show="imgOption==='SX681JP-6'" class="sx681MIC5_a"/>
			<div v-show="imgOption==='SX681JP-6'" class="sx681MIC5_b"/>
			<div v-show="imgOption==='SX681MIC-D-7'" class="sx681MIC7"/>
			<div v-show="imgOption==='SX681MIC-8'" class="sx681MIC8"/>
		</div>
		<div v-show="imgUrl==='SX680'" class="sx680">
			<div v-show="imgOption==='SX680DI-1' || imgOption==='SX680DI-2'" class="sx680DI1"/>
			<div v-show="imgOption==='SX680DI-1'||imgOption==='SX680DI-2'" class="sx680DI2_a"/>
			<div v-show="imgOption==='SX680DI-1'||imgOption==='SX680DI-2'" class="sx680DI2_b"/>
			<div v-show="imgOption==='SX680MOS-3'" class="sx680MOS3_a"/>
			<div v-show="imgOption==='SX680MOS-3'" class="sx680MOS3_b"/>
			<div v-show="imgOption==='SX680MOS-4'" class="sx680MOS4_a"/>
			<div v-show="imgOption==='SX680MOS-4'" class="sx680MOS4_b"/>
			<div v-show="imgOption==='SX680MOS-5'" class="sx680MOS5_a"/>
			<div v-show="imgOption==='SX680MOS-5'" class="sx680MOS5_b"/>
			<div v-show="imgOption==='SX680MIC-D-7'" class="sx680MIC6"/>
			<div v-show="imgOption==='SX680MIC-8'" class="sx680MIC7"/>
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
    }
  }
}
</script>

<style scoped>
	.chipImg{width:100%;height:100%;background-repeat:no-repeat;background-size: 100% 100%;}
	.chipImg div{position: absolute;background-repeat:no-repeat;background-size: 100% 100%;}
	/**背景图*/
	.sx680{width:100%;height:100%;background:url('../../../assets/img/SX680.png');background-repeat:no-repeat;background-size: 100% 100%;}
	.sx681{width:100%;height:100%;background:url('../../../assets/img/SX681.png');background-repeat:no-repeat;background-size: 100% 100%;}

	/**位置块*/
	.sx680DI1{width:5%;height:9%;top: 57.5%;left: 7.2%;background:url(../../../assets/img/DI.jpg);}
	.sx680DI2_a{width:5%;height:8%;top: 57.5%;left: 14.2%;background:url(../../../assets/img/DI.jpg);}
	.sx680DI2_b{width:5%;height:8%;top: 69.5%;left: 14.5%;background:url(../../../assets/img/DI.jpg);}
	.sx680MOS3_a{width:7.2%;height:14%;top: 31.5%;left: 17.5%;background:url(../../../assets/img/MOS90.jpg);}
	.sx680MOS3_b{width:7.4%;height:14%;top: 31.5%;left: 28%;background:url(../../../assets/img/MOS90.jpg);}
	.sx680MOS4_a{width:7.4%;height:14%;top: 31.5%;left: 38.5%;background:url(../../../assets/img/MOS90.jpg);}
	.sx680MOS4_b{width:7.2%;height:14%;top: 31.5%;left: 56.4%;background:url(../../../assets/img/MOS90.jpg);}
	.sx680MOS5_a{width:7.4%;height:14%;top: 31.5%;left: 67.5%;background:url(../../../assets/img/MOS90.jpg);}
	.sx680MOS5_b{width:7.4%;height:14%;top: 31.5%;left: 79%;background:url(../../../assets/img/MOS90.jpg);}
	.sx680MIC6{width:15.4%;height:18%;top: 57.5%;left: 25.5%;background:url(../../../assets/img/MIC6.jpg);}
	.sx680MIC7{width:11.1%;height:16%;top: 59.5%;left: 66%;background:url(../../../assets/img/680MIC7.jpg);}

	.sx681DI1{width:5.6%;height:10%;top: 53.5%;left: 85%;background:url(../../../assets/img/DI.jpg);transform:rotate(180deg);}
	.sx681DI2_a{width:5.6%;height:10%;top:43%;left:7%;background:url(../../../assets/img/DI.jpg);}
	.sx681DI2_b{width:5.6%;height:10%;top:58%;left:7%;background:url(../../../assets/img/DI.jpg);}
	.sx681MOS3_a{width:8.5%;height:18%;top: 15%;left: 73%;background:url(../../../assets/img/MOS90.jpg);}
	.sx681MOS3_b{width:9.8%;height:16%;top: 25.5%;left: 86%;background:url(../../../assets/img/MOS.jpg);}
	.sx681MOS4_a{width:8.2%;height:18%;top: 15%;left: 42.5%;background:url(../../../assets/img/MOS90.jpg);}
	.sx681MOS4_b{width:8.5%;height:18%;top: 15%;left: 55.5%;background:url(../../../assets/img/MOS90.jpg);}
	.sx681MOS5_a{width:9%;height:15%;top: 18%;left: 9%;background:url(../../../assets/img/MOS90.jpg);}
	.sx681MOS5_b{width:8.5%;height:18%;top: 15%;left: 30.5%;background:url(../../../assets/img/MOS90.jpg);}
	.sx681MIC5_a{width:15%;height:13%;top: 42%;left: 16%;background:url(../../../assets/img/MIC.jpg);}
	.sx681MIC5_b{width:15%;height:13%;top: 42%;left: 65.5%;background:url(../../../assets/img/MIC180.jpg);}
	.sx681MIC7{width:20.5%;height:21%;top: 42%;left: 39.5%;background:url(../../../assets/img/MIC7.jpg);}
	.sx681MIC8{width:16.5%;height:16%;top: 69%;left: 41.5%;background:url(../../../assets/img/MIC8.jpg);}
</style>
