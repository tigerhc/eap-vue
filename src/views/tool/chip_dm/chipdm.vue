<template>
	<div class="chipDm">
		<div v-if="eqpId.indexOf('IBGT')>-1">
			<div :style="{width:'56px',height:'8px',left:'80px'}" class="bg_pst"/>
			<div :style="{width:'88px',height:'216px',left:'64px',top:'8px'}" class="bg_pst"/>
			<div :style="{width:'120px',height:'200px',left:'48px',top:'16px'}" class="bg_pst"/>
			<div :style="{width:'136px',height:'184px',left:'40px',top:'24px'}" class="bg_pst"/>
			<div :style="{width:'152px',height:'168px',left:'32px',top:'32px'}" class="bg_pst"/>
			<div :style="{width:'168px',height:'152px',left:'24px',top:'40px'}" class="bg_pst"/>
			<div :style="{width:'184px',height:'136px',left:'16px',top:'48px'}" class="bg_pst"/>
			<div :style="{width:'200px',height:'104px',left:'8px',top:'64px'}" class="bg_pst"/>
			<div :style="{width:'100%',height:'64px',top:'80px'}" class="bg_pst"/>
			<div :style="{width:'40px',height:'8px',left:'88px',top:'224px'}" class="bg_pst"/>
			<div :style="{width:'8px',height:'8px',left:'208px',top:'144px'}" class="bg_pst"/>

			<div v-for="(item,index) in 14" :style="{top:index *16+8+'px'}" :key="eqpId+'R'+index" class="igbt_row_line"/>
			<div v-for="(item,index) in 13" :style="{left:index *16+8+'px'}" :key="eqpId+'C'+index" class="igbt_col_line"/>
		</div>

		<div v-if="eqpId.indexOf('FRD')>-1">
			<div :style="{width:'110px',height:'100%',left:'110px'}" class="bg_pst"/>
			<div :style="{width:'180px',height:'160px',left:'80px',top:'10px'}" class="bg_pst"/>
			<div :style="{width:'230px',height:'140px',left:'50px',top:'20px'}" class="bg_pst"/>
			<div :style="{width:'260px',height:'120px',left:'40px',top:'30px'}" class="bg_pst"/>
			<div :style="{width:'290px',height:'100px',left:'20px',top:'40px'}" class="bg_pst"/>
			<div :style="{width:'320px',height:'60px',left:'10px',top:'60px'}" class="bg_pst"/>
			<div :style="{width:'10px',height:'40px',top:'70px'}" class="bg_pst"/>
			<div :style="{width:'10px',height:'80px',left:'310px',top:'50px'}" class="bg_pst"/>

			<div v-for="(item,index) in 9" :style="{top:index *20+10+'px'}" :key="eqpId+'R'+index" class="frd_row_line"/>
			<div v-for="(item,index) in 16" :style="{left:index *20+10+'px'}" :key="eqpId+'C'+index" class="frd_col_line"/>
		</div>
	</div>
</template>

<style scoped>
	div{box-sizing:border-box;}
	.igbt_row_line{width:100%;height:8px;border-top:1px solid #5e5f5e;border-bottom:1px solid #5e5f5e;position:absolute;}
	.igbt_col_line{height:100%;width:8px;border-left:1px solid #5e5f5e;border-right:1px solid #5e5f5e;position:absolute}
	.frd_row_line{width:100%;height:10px;border-top:1px solid #5e5f5e;border-bottom:1px solid #5e5f5e;position:absolute;}
	.frd_col_line{height:100%;width:10px;border-left:1px solid #5e5f5e;border-right:1px solid #5e5f5e;position:absolute}

	.bg_pst{background-color:blue;position:absolute;}
</style>

<script>
export default {
  name: 'ChipImg',
  props: {
    eqpId: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  methods: {
  }
}
</script>

