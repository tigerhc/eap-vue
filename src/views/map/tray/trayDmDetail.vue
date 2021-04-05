<template>
  <div class="app-container">
		<div class="igbt_chipdm_panel">
			<div class="igbt_dm_panel">
				<ChipDm eqp-id="IBGT"/>
				<div
v-for="(item,index) in igbt1.lightPst"
					:style="{top:item.dmX*8+'px',left:item.dmY*8+'px',width:'8px',height:'8px'}"
					:key="'i1'+item.dmX+'_'+item.dmY"
					class="lightPst"
					@click="showXy('X:'+item.dmX+',Y:'+item.dmY, index, 'igbt1')"/>
				<div class="dm_info_panel">
					<div class="dmIdDiv">{{ igbt1.dmId }}</div>
					<div class="dmPstDiv">{{ igbt1.content }}</div>
					<div class="dmTimeDiv">{{ igbt1.showTime }}</div>
				</div>
			</div>
			<div v-if="igbtIndex > 1" :style="{left:'250px'}" class="chip_dm_panel">
				<ChipDm eqp-id="IBGT"/>
				<div
v-for="(item,index) in igbt2.lightPst"
					:style="{top:item.dmX*8+'px',left:item.dmY*8+'px',width:'8px',height:'8px'}"
					:key="'i2'+item.dmX+'_'+item.dmY"
					class="lightPst"
					@click="showXy('X:'+item.dmX+',Y:'+item.dmY, index, 'igbt2')"/>
				<div class="dm_info_panel">
					<div class="dmIdDiv">{{ igbt2.dmId }}</div>
					<div class="dmPstDiv">{{ igbt2.content }}</div>
					<div class="dmTimeDiv">{{ igbt2.showTime }}</div>
				</div>
			</div>
			<div v-if="igbtIndex > 2" :style="{left:'500px'}" class="chip_dm_panel">
				<ChipDm eqp-id="IBGT"/>
				<div
v-for="(item,index) in igbt3.lightPst"
					:style="{top:item.dmX*8+'px',left:item.dmY*8+'px',width:'8px',height:'8px'}"
					:key="'i3'+item.dmX+'_'+item.dmY"
					class="lightPst"
					@click="showXy('X:'+item.dmX+',Y:'+item.dmY, index, 'igbt3')"/>
				<div class="dm_info_panel">
					<div class="dmIdDiv">{{ igbt3.dmId }}</div>
					<div class="dmPstDiv">{{ igbt3.content }}</div>
					<div class="dmTimeDiv">{{ igbt3.showTime }}</div>
				</div>
			</div>
			<div v-if="igbtIndex > 3" :style="{left:'750px'}" class="chip_dm_panel">
				<ChipDm eqp-id="IBGT"/>
				<div
v-for="(item,index) in igbt4.lightPst"
					:style="{top:item.dmX*8+'px',left:item.dmY*8+'px',width:'8px',height:'8px'}"
					:key="'i4'+item.dmX+'_'+item.dmY"
					class="lightPst"
					@click="showXy('X:'+item.dmX+',Y:'+item.dmY, index, 'igbt4')"/>
				<div class="dm_info_panel">
					<div class="dmIdDiv">{{ igbt4.dmId }}</div>
					<div class="dmPstDiv">{{ igbt4.content }}</div>
					<div class="dmTimeDiv">{{ igbt4.showTime }}</div>
				</div>
			</div>
			<div v-if="igbtIndex > 4" :style="{left:'1000px'}" class="chip_dm_panel">
				<ChipDm eqp-id="IBGT"/>
				<div
v-for="(item,index) in igbt5.lightPst"
					:style="{top:item.dmX*8+'px',left:item.dmY*8+'px',width:'8px',height:'8px'}"
					:key="'i5'+item.dmX+'_'+item.dmY"
					class="lightPst"
					@click="showXy('X:'+item.dmX+',Y:'+item.dmY, index, 'igbt5')"/>
				<div class="dm_info_panel">
					<div class="dmIdDiv">{{ igbt5.dmId }}</div>
					<div class="dmPstDiv">{{ igbt5.content }}</div>
					<div class="dmTimeDiv">{{ igbt5.showTime }}</div>
				</div>
			</div>
			<div v-if="igbtIndex > 5" :style="{left:'1250px'}" class="chip_dm_panel">
				<ChipDm eqp-id="IBGT"/>
				<div
v-for="(item,index) in igbt6.lightPst"
					:style="{top:item.dmX*8+'px',left:item.dmY*8+'px',width:'8px',height:'8px'}"
					:key="'i6'+item.dmX+'_'+item.dmY"
					class="lightPst"
					@click="showXy('X:'+item.dmX+',Y:'+item.dmY, index, 'igbt6')"/>
				<div class="dm_info_panel">
					<div class="dmIdDiv">{{ igbt6.dmId }}</div>
					<div class="dmPstDiv">{{ igbt6.content }}</div>
					<div class="dmTimeDiv">{{ igbt6.showTime }}</div>
				</div>
			</div>
		</div>
		<div class="frd_chipdm_panel">
			<div class="chip_dm_panel">
				<ChipDm eqp-id="FRD"/>
				<div
v-for="(item,index) in frd1.lightPst"
					:style="{top:item.dmX*10+'px',left:item.dmY*10+'px',width:'10px',height:'10px'}"
					:key="'f1'+item.dmX+'_'+item.dmY"
					class="lightPst"
					@click="showXy('X:'+item.dmX+',Y:'+item.dmY, index, 'frd1')"/>
				<div class="dm_info_panel">
					<div class="dmIdDiv">{{ frd1.dmId }}</div>
					<div class="dmPstDiv">{{ frd1.content }}</div>
					<div class="dmTimeDiv">{{ frd1.showTime }}</div>
				</div>
			</div>
			<div v-if="frdIndex > 1" :style="{left:'500px'}" class="chip_dm_panel">
				<ChipDm eqp-id="FRD"/>
				<div
v-for="(item,index) in frd2.lightPst"
					:style="{top:item.dmX*10+'px',left:item.dmY*10+'px',width:'10px',height:'10px'}"
					:key="'f2'+item.dmX+'_'+item.dmY"
					class="lightPst"
					@click="showXy('X:'+item.dmX+',Y:'+item.dmY, index, 'frd2')"/>
				<div class="dm_info_panel">
					<div class="dmIdDiv">{{ frd2.dmId }}</div>
					<div class="dmPstDiv">{{ frd2.content }}</div>
					<div class="dmTimeDiv">{{ frd2.showTime }}</div>
				</div>
			</div>
			<div v-if="frdIndex > 2" :style="{left:'500px'}" class="chip_dm_panel">
				<ChipDm eqp-id="FRD"/>
				<div
v-for="(item,index) in frd3.lightPst"
					:style="{top:item.dmX*10+'px',left:item.dmY*10+'px',width:'10px',height:'10px'}"
					:key="'f3'+item.dmX+'_'+item.dmY"
					class="lightPst"
					@click="showXy('X:'+item.dmX+',Y:'+item.dmY, index, 'frd3')"/>
				<div class="dm_info_panel">
					<div class="dmIdDiv">{{ frd3.dmId }}</div>
					<div class="dmPstDiv">{{ frd3.content }}</div>
					<div class="dmTimeDiv">{{ frd3.showTime }}</div>
				</div>
			</div>
			<div v-if="frdIndex > 3" :style="{left:'500px'}" class="chip_dm_panel">
				<ChipDm eqp-id="FRD"/>
				<div
v-for="(item,index) in frd4.lightPst"
					:style="{top:item.dmX*10+'px',left:item.dmY*10+'px',width:'10px',height:'10px'}"
					:key="'f4'+item.dmX+'_'+item.dmY"
					class="lightPst"
					@click="showXy('X:'+item.dmX+',Y:'+item.dmY, index, 'frd4')"/>
				<div class="dm_info_panel">
					<div class="dmIdDiv">{{ frd4.dmId }}</div>
					<div class="dmPstDiv">{{ frd4.content }}</div>
					<div class="dmTimeDiv">{{ frd4.showTime }}</div>
				</div>
			</div>
			<div v-if="frdIndex > 4" :style="{left:'500px'}" class="chip_dm_panel">
				<ChipDm eqp-id="FRD"/>
				<div
v-for="(item,index) in frd5.lightPst"
					:style="{top:item.dmX*10+'px',left:item.dmY*10+'px',width:'10px',height:'10px'}"
					:key="'f5'+item.dmX+'_'+item.dmY"
					class="lightPst"
					@click="showXy('X:'+item.dmX+',Y:'+item.dmY, index, 'frd5')"/>
				<div class="dm_info_panel">
					<div class="dmIdDiv">{{ frd5.dmId }}</div>
					<div class="dmPstDiv">{{ frd5.content }}</div>
					<div class="dmTimeDiv">{{ frd5.showTime }}</div>
				</div>
			</div>
			<div v-if="frdIndex > 5" :style="{left:'500px'}" class="chip_dm_panel">
				<ChipDm eqp-id="FRD"/>
				<div
v-for="(item,index) in frd6.lightPst"
					:style="{top:item.dmX*10+'px',left:item.dmY*10+'px',width:'10px',height:'10px'}"
					:key="'f6'+item.dmX+'_'+item.dmY"
					class="lightPst"
					@click="showXy('X:'+item.dmX+',Y:'+item.dmY, index, 'frd6')"/>
				<div class="dm_info_panel">
					<div class="dmIdDiv">{{ frd6.dmId }}</div>
					<div class="dmPstDiv">{{ frd6.content }}</div>
					<div class="dmTimeDiv">{{ frd6.showTime }}</div>
				</div>
			</div>
		</div>
  </div>
</template>

<style lang="scss">
	.igbt_chipdm_panel{width:100%; height:336px;position: relative;border:1px solid red;}
	.chip_dm_panel{width:334px;height:184px;border:1px solid #5e5f5e;position: absolute;top:100px;}

	.igbt_dm_panel{width:220px;height:234px;border:1px solid #5e5f5e;position: absolute;top:100px;}
	.frd_chipdm_panel{width:100%; height:285px;position: relative; border:1px solid red;}

	.lightPst{background-color:#03f957;position:absolute;border:1px solid #5e5f5e;}
	.dm_info_panel{width:220px;height:100px;position: absolute;top:-100px;}
	.dmIdDiv{position: absolute;width:100%;height:50px;border:1px solid #5e5f5e;text-align:center;line-height:50px;}
	.dmPstDiv{position: absolute;width:100%;height:25px;border:1px solid #5e5f5e;text-align:left;line-height:25px;top:50px;}
	.dmTimeDiv{position: absolute;width:100%;height:25px;border:1px solid #5e5f5e;text-align:left;line-height:25px;top:75px;}
</style>

<script>
import request from '@/utils/request'
import ChipDm from '@/views/tool/chip_dm/chipdm'
export default {
  name: 'TrayDmDetail',
  components: {
    ChipDm
  },
  data() {
    return {
      graph: null,
      dmList: [],
      igbt1: {},
      igbt2: {},
      igbt3: {},
      igbt4: {},
      igbt5: {},
      igbt6: {},
      frd1: {},
      frd2: {},
      frd3: {},
      frd4: {},
      frd5: {},
      frd6: {},
      igbtIndex: 0,
      frdIndex: 0
    }
  },
  mounted() {
    request({
      url: '/map/maptraychipmove/dmDetail',
      method: 'post',
      data: { chipId: this.$route.query.id }
    }).then((resp) => {
      var datas = resp.data.results
      for (var i = 0; i < datas.length; i++) {
        if (datas[i].eqpId.indexOf('IGBT') > -1) {
          switch (this.igbtIndex) {
            case 0:
              this.igbt1 = datas[i]; break
            case 1:
              this.igbt2 = datas[i]; break
            case 2:
              this.igbt3 = datas[i]; break
            case 3:
              this.igbt4 = datas[i]; break
            case 4:
              this.igbt5 = datas[i]; break
            case 5:
              this.igbt6 = datas[i]; break
          }
          this.igbtIndex = this.igbtIndex + 1
        } else {
          switch (this.frdIndex) {
            case 0:
              this.frd1 = datas[i]; break
            case 1:
              this.frd2 = datas[i]; break
            case 2:
              this.frd3 = datas[i]; break
            case 3:
              this.frd4 = datas[i]; break
            case 4:
              this.frd5 = datas[i]; break
            case 5:
              this.frd6 = datas[i]; break
          }
          this.frdIndex = this.frdIndex + 1
        }
      }
    })
  },
  beforeDestroy() {

  },
  methods: {
    getIgbtObj(index) {

    },
    showXy(content, index, flag) {
      switch (flag) {
        case 'igbt1':
          this.igbt1.content = content
          this.igbt1.showTime = this.igbt1.startTime.split(',')[index]
          break
        case 'igbt2':
          this.igbt2.content = content
          this.igbt2.showTime = this.igbt2.startTime.split(',')[index]
          break
        case 'igbt3':
          this.igbt3.content = content
          this.igbt3.showTime = this.igbt3.startTime.split(',')[index]
          break
        case 'igbt4':
          this.igbt4.content = content
          this.igbt4.showTime = this.igbt4.startTime.split(',')[index]
          break
        case 'igbt5':
          this.igbt5.content = content
          this.igbt5.showTime = this.igbt5.startTime.split(',')[index]
          break
        case 'igbt6':
          this.igbt6.content = content
          this.igbt6.showTime = this.igbt6.startTime.split(',')[index]
          break
        case 'frd1':
          this.frd1.content = content
          this.frd1.showTime = this.frd1.startTime.split(',')[index]
          break
        case 'frd2':
          this.frd2.content = content
          this.frd2.showTime = this.frd2.startTime.split(',')[index]
          break
        case 'frd3':
          this.frd3.content = content
          this.frd3.showTime = this.frd3.startTime.split(',')[index]
          break
        case 'frd4':
          this.frd4.content = content
          this.frd4.showTime = this.frd4.startTime.split(',')[index]
          break
        case 'frd5':
          this.frd5.content = content
          this.frd5.showTime = this.frd5.startTime.split(',')[index]
          break
        case 'frd6':
          this.frd6.content = content
          this.frd6.showTime = this.frd6.startTime.split(',')[index]
          break
      }
      this.$forceUpdate()// 强制刷新obj
    }
  }
}
</script>
