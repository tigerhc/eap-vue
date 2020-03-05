<template>
  <div class="app-container calendar-list-container">
    <w-form :col="3" :model="editList" url="/edc/edcamsdefine">
      <el-input :disabled="!editFlag" v-model="editList.alarmName" label="报警名称" />
        <el-select
          :disabled="!editFlag"
          v-model="editList.eqpModelId"
          label="设备类型"
          filterable
          clearable
          placeholder="请选择"
          @change="selectEqp"
        >
          <el-option v-for="item in eqpModelNameList" :key="item.id" :label="item.classCode" :value="item.id" />
        </el-select>

        <el-select
          :disabled="!editFlag"
          v-model="editList.alarmCode"
          label="Alarm类型"
          filterable
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in dictList('AMS_ALARM_TYPE')"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input v-model="editList.updateByName" label="修改人" disabled />
        <el-date-picker
          v-model="editList.updateDate"
          label="启用时间"
          disabled
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期"
        />
        <el-input v-model="editList.createByName" label="制单人" disabled />

        <el-date-picker
          v-model="editList.createDate"
          label="制单时间"
          disabled
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期"
        />
        <w-select-dic v-model="editList.monitorFlag" style="width:100%" label="状态" dict="MONITOR_FLAG" />
    </w-form>
    <div style="border-top:1px solid #ddd;padding:5px 0;margin:10px 0"/>
      <w-edt-table v-bind="table" url="/edc/edcamsdefine">
        <!--todo fixed属性导致当前列变为第一列-->
        <w-table-col
          name="alarmCode"
          required
          label="编码"
          sort
          fixed
          align="left"
          handler="view"
          query
          condition="like"
        >
        <el-input v-model="table.model.alarmCode" />
        </w-table-col>
        <w-table-col name="eqpModelName" label="设备类型" align="left" />
        <w-table-col name="alarmName" label="名称" align="left" />
        <w-table-col name="alarmCategory" label="种类" align="center" />
        <!--<w-table-col name="sortCode" label="排序号" sort/>-->
        <!-- todo filterable 属性-->
        <w-table-col
          name="modelId"
          label="设备型号"
          hidden
          query
          dict
          url="/fab/fabequipmentmodel/list"
          namekey="modelName"
          condition="eq"
          filterable
        />
        <w-table-col name="monitorFlag" label="监控标记" align="center" dict="MONITOR_FLAG" query condition="eq" />
        <!--todo date 点击查询后,时间控件值消失-->
        <!--<w-table-col name="updateDate" label="更新时间" width="200" align="center" sort="1" query querymode="date" condition="between"/>-->

        <!--hidden属性: 隐藏默认button url: 修改默认url 没有url,则默认调用属性name值的方法-->
        <w-table-toolbar name="add" url="views/ams/define/alarmdefineEdit" />
        <!--hidden属性: 隐藏默认button url: 修改默认url-->
        <!--<w-table-toolbar name="exportExcel" label="导出Excel" tip="你想干啥111？" icon="fa-download" type="success" />-->
        <w-table-button name="enable" label="启用" tip="确认启用报警？" icon="el-icon-close" />
        <w-table-button name="diable" label="停用" tip="确认停用报警？" icon="el-icon-close" />
      </w-edt-table>

  </div>
</template>

<script>
export default {
  name: 'AlarmsetAdd',
  directives: {
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: null,
      listLoading: true,
      eqpModelNameList: [],
      id: '',
      editFlag: true,
      editList: {
        monitorFlag: '',
        eqpModelId: '',
        alarmCode: '',
        eqpModelName: '',
        alarmName: ''
      },
      fromInfo: {},
      ruleForm: {},
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
        }
      }
    }
  },
  activated() {
    this.fromInfo = this.$route.query.item || {}
    this.editFlag = this.$route.query.editFlag
    this.getDevice()
    this.getDeatails()
  },
  methods: {
    // getDevice() {
    //   const obj = {
    //     sort: 'updateDate',
    //     'page.pn': 1,
    //     'page.size': 999999,
    //     queryFields: 'id,manufacturerName,classCode,smlPath,hostJavaClass,activeFlag,iconPath,updateDate,'
    //   }
    //   fetchDeviceList(obj).then((response) => {
    //     this.eqpModelNameList = response.data.results
    //   })
    // },
    // getDeatails() {
    //   fetchDeteils(this.fromInfo.id).then((res) => {
    //     this.editList = res.data
    //     this.list = res.data.edcAmsRecordList
    //   })
    // },
    // save() {
    //   const { monitorFlag, eqpModelId, alarmName, alarmCode, eqpModelName, id } = this.editList
    //   const parmas = {
    //     monitorFlag,
    //     alarmName,
    //     eqpModelId,
    //     eqpModelName,
    //     alarmCode,
    //     id,
    //     _detail: JSON.stringify(this.list)
    //   }
    //   this.$refs['modelForm'].validate((valid) => {
    //     if (valid) {
    //       update(parmas).then((res) => {
    //         if (res.data.code === 0) {
    //           this.cancel()
    //           this.$notify({
    //             title: '成功',
    //             message: '添加成功',
    //             type: 'success',
    //             duration: 2000
    //           })
    //         } else {
    //           this.$notify({
    //             title: '失败',
    //             message: '添加失败',
    //             type: 'error',
    //             duration: 2000
    //           })
    //         }
    //       })
    //     } else {
    //       return
    //     }
    //   })
    // },
    // getView() {
    //   const List = this.$store.state.tagsView.visitedViews
    //   for (const item of List) {
    //     if (item.name === 'views/alarm/alarmset/edit') {
    //       this.viewObj = item
    //     }
    //   }
    // },
    // cancel() {
    //   debugger
    //   this.getView()
    //   this.$store.dispatch('delView', this.viewObj).then(({ visitedViews }) => {
    //     this.$router.push({ name: 'views/alarm/alarmset/index' })
    //   })
    // },
    selectEqp(val) {
      let obj = {}
      obj = this.eqpModelNameList.find((item) => {
        return item.id === val
      })
      this.editList.eqpModelName = obj.classCode || ''
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
