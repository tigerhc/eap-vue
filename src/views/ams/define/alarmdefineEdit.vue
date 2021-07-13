<template>
  <div class="app-container calendar-list-container">
    <w-form
      :title="title"
      :col="3"
      :before-submit="beforeSubmit"
      :on-load-data="onFormLoadData"
      :model="editList"
      url="/edc/edcamsdefine"
    >
      <el-input v-model="editList.alarmName" label="报警名称" />
      <w-lookup
        v-model="editList.eqpModelId"
        :display.sync="editList.eqpModelName"
        idkey="id"
        displaykey="manufacturerName"
        label="设备型号名称"
        title="选择设备型号"
        module="views/fab/eqpmodel/eqpmodelLook"
      />
      <w-select-dic v-model="editList.alarmCode" style="width: 100%" label="Alarm类型" dict="AMS_ALARM_TYPE" />
      <w-select-dic v-model="editList.monitorFlag" style="width: 100%" label="状态" dict="MONITOR_FLAG" />
      <el-input v-model="editList.updateByName" label="修改人" disabled />
      <el-date-picker
        v-model="editList.updateDate"
        label="启用时间"
        disabled
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetime"
        placeholder="选择日期"
        style="width: 100%"
      />
      <el-input v-model="editList.createByName" label="制单人" disabled />
      <el-date-picker
        v-model="editList.createDate"
        label="制单时间"
        disabled
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetime"
        placeholder="选择日期"
        style="width: 100%"
      />
      <w-select-dic v-model="editList.monitorFlag" style="width: 100%" label="监控标记" dict="MONITOR_FLAG" />
    </w-form>
    <div style="border-top: 1px solid #ddd; padding: 5px 0; margin: 10px 0" />
    <w-edt-table v-slot="{ row }" ref="language" v-bind="table" url="/edc/edcamsdefine">
      <!--todo fixed属性导致当前列变为第一列-->
      <w-table-col name="alarmLanguage" required label="语言类型" dict="I18N_CODE" sort fixed align="left">
        <!-- <el-input v-model="table.model.alarmLanguage" /> -->
        <w-select-dic v-model="table.model.alarmLanguage" style="width: 100%" label="状态" dict="I18N_CODE" />
      </w-table-col>
      <w-table-col name="alarmName" label="名称" align="left">
        <el-input v-model="table.model.alarmName" />
      </w-table-col>
      <!-- <w-table-col
        name="modelId"
        label="设备型号"
        query
        dict
        url="/fab/fabequipmentmodel/list"
        namekey="modelName"
        condition="eq"
        filterable
      />
      <w-table-col name="monitorFlag" label="监控标记" align="center" dict="MONITOR_FLAG" query condition="eq" /> -->
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
        monitorFlag: '',
        eqpModelId: '',
        alarmCode: '',
        eqpModelName: '',
        alarmName: ''
      },
      title: {
        ADD: '新增报警定义',
        EDIT: '修改报警定义',
        VIEW: '查看报警定义'
      },
      rules: {
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
          alarmCode: ''
        },
        datas: []
      }
    }
  },
  methods: {
    onFormLoadData(data) {
      this.table.datas = data.edcAmsDefineI18nList
    },
    beforeSubmit(model) {
      // model 将被保存的表单模型
      delete model['edcAmsDefineI18nList'] // 删除原数据模型里的多语言数组
      const lang = this.$refs.language.tranformData('edcAmsDefineI18nList') // 获取被转换格式的所有细表数据
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
