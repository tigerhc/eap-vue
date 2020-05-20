<template>
  <div class="app-container calendar-list-container">
    <w-form :title="title" :col="3" :before-submit="beforeSubmit" :rules="rules" :on-load-data="onFormLoadData" :model="editList" url="/edc/edcamsrptdefine">
      <el-input v-model="editList.alarmId" label="报警名称" />
      <w-lookup
        v-model="editList.eqpModelId"
        :display.sync="editList.eqpModelName"
        idkey="id"
        displaykey="manufacturerName"
        label="设备型号名称"
        title="选择设备型号"
        module="views/fab/eqpmodel/eqpmodelLook"
      />
      <w-select-dic v-model="editList.alarmCode" style="width:100%" label="Alarm类型" dict="AMS_ALARM_TYPE" />
      <w-select-dic v-model="editList.activeFlag" style="width:100%" label="状态" dict="MONITOR_FLAG" />

      <el-row col="24" />
      <el-input v-model="editList.repeatCycle" label="周期" />
      <el-input v-model="editList.repeatNum" label="累计次数" />

      <el-row col="24" />
      <w-select-dic v-model="editList.actionCodes" style="width:100%" label="动作" dict="AMS_RPT_ACTION_CODE" multiple col="16" />
      <el-row col="24" />
      <el-input
        :autosize="{ minRows: 4}"
        v-model="editList.repeatAlarmDesc"
        style="width:540px"
        type="textarea"
        placeholder="请输入内容"
        label="描述"/>
      <el-row col="24" />
      <el-input v-model="editList.activeUserId" label="激活人" disabled />
      <el-input v-model="editList.activeDate" label="激活时间" disabled />
      <el-row col="24" />
      <el-input v-model="editList.inactiveUserId" label="停用人" disabled />
      <el-input v-model="editList.inactiveDate" label="停用时间" disabled />

      <el-input v-model="editList.createByName" label="制单人" disabled />
      <el-date-picker
        v-model="editList.createDate"
        label="制单时间"
        disabled
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetime"
        placeholder="选择日期"
        style="width:100%"
      />
      <el-row col="24" />
      <el-input v-model="editList.updateByName" label="修改人" disabled />
      <el-date-picker
        v-model="editList.updateDate"
        label="修改时间"
        disabled
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetime"
        placeholder="选择日期"
        style="width:100%"
      />
    </w-form>
    <div style="border-top:1px solid #ddd;padding:5px 0;margin:10px 0" />
    <w-edt-table v-slot="{row}" ref="language" v-bind="table" url="111">
      <w-table-col name="userName" label="用户" align="left" >
         <el-input v-model="table.model.userName" />
      </w-table-col>
      <w-table-col name="userEmail" label="邮箱" align="left" >
        <el-input v-model="table.model.userEmail" />
      </w-table-col>
    </w-edt-table>
  </div>
</template>

<script>
export default {
  name: 'AlarmsetAdd',
  data() {
    return {
      editFlag: true,
      editList: {
      },
      title: {
        ADD: '新增报警管控',
        EDIT: '修改报警管控',
        VIEW: '查看报警管控'
      },
      rules: {
        alarmId: [{ required: true, message: '报警名称必填', trigger: 'blur' }],
        alarmName: [{ required: true, message: '报警名称必填', trigger: 'blur' }],
        eqpModelId: [{ required: true, message: '设备类型必选', trigger: 'change' }],
        alarmCode: [{ required: true, message: 'Alarm类型必选', trigger: 'change' }],
        monitorFlag: [{ required: true, message: '状态必选', trigger: 'change' }]
      },
      table: {
        rules: {
          eqpId: [{ required: true, message: '设备号必填', trigger: 'blur' }],
          modelName: [{ required: true, message: '设备类型必填', trigger: ['blur', 'change'] }],
          activeFlag: [{ required: true, message: '有效标志必选', trigger: 'change' }]
        },
        model: {
          userEmail: ''
        },
        datas: []
      }
    }
  },
  methods: {
    onFormLoadData(data) {
      data.actionCodes = data.actionCode.split(',')
      this.table.datas = data.edcAmsRptDefineActEmailList
      // this.table.datas = data.edcAmsDefineI18nList
    },
    beforeSubmit(model) { // model 将被保存的表单模型
      model.actionCode = model.actionCodes.join(',')
      delete model['edcAmsRptDefineActEmailList'] // 删除原数据模型里的多语言数组
      const lang = this.$refs.language.tranformData('edcAmsRptDefineActEmailList') // 获取被转换格式的所有细表数据
      const re = { ...model, ...lang } // 合并细表数据
      return re // 返回新的数据模型
    }
  }
}
</script>
<style scoped>
.btn {
  text-align: center;
  margin-top: 20px;
}
</style>
