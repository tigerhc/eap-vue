<template>
  <w-form v-bind="formConf" :col="3" :model="model">
    <el-input v-model="model.manufacturerName" label="设备厂家" />
    <el-input v-model="model.classCode" label="设备类型" />
    <w-select-dic v-model="model.activeFlag" style="width: 100%" label="有效标志" dict="ACTIVE_FLAG" />
    <!--todo 此属性需要占用两列该怎么没写-->
    <el-input v-model="model.smlPath" label="SML文件路径" col="24" />
    <el-input v-model="model.hostJavaClass" label="设备对应的JAVA类" col="24" />
    <el-input v-model="model.iconPath" label="图标路径" col="24" />

    <!--todo 显示异常,应该写法有问题,不需要写宽度,是否也可以写成占用几列 style="width:540px"-->
    <el-input
      v-model="model.remarks"
      :autosize="{ minRows: 4 }"
      col="24"
      label="备注"
      type="textarea"
      placeholder="请输入内容"
    />

    <el-input v-model="model.createByName" :disabled="true" label="创建人" />
    <el-input v-model="model.createDate" :disabled="true" label="创建日期" />
    <el-row col="24" />
    <el-input v-model="model.updateByName" :disabled="true" label="更新人" />
    <el-input v-model="model.updateDate" :disabled="true" label="更新日期" />

    <!--测试-->
    <!--<el-form-item label="活动时间">-->
    <!--<el-col :span="11">-->
    <!--<el-date-picker type="date" placeholder="选择日期" v-model="sizeForm.date1" style="width: 100%;"></el-date-picker>-->
    <!--</el-col>-->
    <!--<el-col class="line" :span="2">-</el-col>-->
    <!--<el-col :span="11">-->
    <!--<el-time-picker placeholder="选择时间" v-model="sizeForm.date2" style="width: 100%;"></el-time-picker>-->
    <!--</el-col>-->
    <!--</el-form-item>-->
  </w-form>
</template>
<script>
export default {
  name: 'EditDevice',
  data() {
    return {
      model: {
        manufacturerName: '',
        classCode: '',
        smlPath: '',
        hostJavaClass: '',
        iconPath: '',
        activeFlag: '',
        remarks: '',
        delFlag: 0
      },
      formConf: {
        url: '/fab/fabequipmentmodel/',
        title: {
          ADD: '新增设备类型',
          EDIT: '修改设备类型',
          VIEW: '查看设备类型'
        },
        rules: {
          manufacturerName: [{ required: true, message: '设备厂家必填', trigger: 'blur' }],
          classCode: [{ required: true, message: '设备类型必填', trigger: 'blur' }],
          activeFlag: [{ required: true, message: '有效标志必选', trigger: 'change' }]
        },
        onLoadData: (m, type) => {
          console.info(m)
          //        m.officeIds = m.officeIds.split(',')
          return m
        },
        beforeSubmit: (params, type) => {
          const re = { ...params }
          //        re.officeId = re.officeIds[re.officeIds.length - 1]
          //        re.officeIds = undefined
          return re
        }
      }
    }
  },
  mounted() {},
  methods: {
    onDisplayChange(e) {
      this.model.modelName = e
    }
  }
}
</script>
