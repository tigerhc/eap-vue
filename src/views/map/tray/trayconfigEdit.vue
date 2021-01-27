<template>
  <w-form v-bind="formConf" :col="3" :model="model">
    <el-input v-model="model.trayId" align="center" label="托盘编号" />
    <el-input v-model="model.trayRow" label="托盘行数" disabled/>
    <el-input v-model="model.trayCol" label="托盘列数" disabled/>
    <w-select-dic v-model="model.status" style="width:100%" label="有效标志" dict="ACTIVE_FLAG" />
    <el-input v-model="model.sortNo" label="排序号" />
		<el-select v-model="model.trayModel" label="托盘种类" @change="modelChange">
			<el-option
				v-for="item in modelOptions"
				:key="item.trayModel"
				:label="item.trayModel"
				:value="item.trayModel" />
		</el-select>
    <el-input v-model="model.trayDesc" col="24" label="托盘描述" />

    <el-input v-model="model.createByName" :disabled="true" label="创建人" />
    <el-input v-model="model.createDate" :disabled="true" label="创建日期" />
    <el-row col="24" />
    <el-input v-model="model.updateByName" :disabled="true" label="更新人" />
    <el-input v-model="model.updateDate" :disabled="true" label="更新日期" />
  </w-form>
</template>
<script>
import { getModels } from '@/api/map/monitor'
export default {
  name: 'TrayConfigEdit',
  data() {
    return {
      modelOptions: [],
      model: {
        trayId: '',
        trayRow: '',
        trayCol: '',
        trayDesc: '',
        trayModel: '',
        trayType: '',
        status: '',
        startTime: '',
        sortNo: 1
      },

      formConf: {
        url: '/map/maptrayconfig/',
        title: {
          ADD: '新增功能',
          EDIT: '修改功能',
          VIEW: '功能详情'
        },
        rules: {
          trayId: [{ required: true, message: '托盘编号必填', trigger: 'change' }],
          trayRow: [{ required: true, message: '托盘行数必填', trigger: 'change' }],
          trayCol: [{ required: true, message: '托盘列数必填', trigger: 'change' }],
          status: [{ required: true, message: '有效标志必选', trigger: 'change' }]
        }
      }
    }
  },
  created: function() {
    console.log('asdfafds')
    var _this = this
    getModels(this.chartParam).then(res => {
      if (res.data.models.length > 0) {
        _this.modelOptions = res.data.models
      }
    })
  },
  methods: {
    modelChange: function(option) {
      for (var i = 0; i < this.modelOptions.length; i++) {
        if (this.modelOptions[i].trayModel === option) {
          this.model.trayRow = this.modelOptions[i].trayRow
          this.model.trayCol = this.modelOptions[i].trayCol
          this.model.trayType = this.modelOptions[i].trayType
          break
        }
      }
    }
  }
}
</script>
