<template>
  <w-form v-bind="formConf" :col="4" :model="model">
    <el-input v-model="model.manufacturerName" label="传感器厂家" />
    <el-input v-model="model.classCode" label="传感器类型" @blur="change" />
    <el-input v-model="model.parentType" label="传感器大类" />
    <el-input v-model="model.type" label="传感器小类" />
    <w-select-dic v-model="model.activeFlag" style="width: 100%" label="有效标志" dict="ACTIVE_FLAG" />
    <el-input v-model="model.paramCode" label="参数CODE" />
    <el-input v-model="model.paramName" label="参数名称" />
    <el-input v-model="model.setValue" label="设定值" />
    <el-input v-model="model.maxValue" label="最大值" />
    <el-input v-model="model.minValue" label="最小值" />
    <el-select v-model="model.numType" placeholder="请选择" label="示数类型">
      <el-option v-for="item in numTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>

    <!--todo 此属性需要占用两列该怎么没写-->
    <el-input v-model="model.smlPath" label="SML文件路径" col="24" />
    <el-input v-model="model.hostJavaClass" label="传感器对应的JAVA类" col="24" />
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
    <el-input v-model="model.updateByName" :disabled="true" label="更新人" />
    <el-input v-model="model.updateDate" :disabled="true" label="更新日期" />
  </w-form>
</template>
<script>
import dateFormat from '@/utils/dateformat'
import { fetchDict } from '@/api/sys/dict.js'
import request from '@/utils/request'

export default {
  name: 'EditDevice',
  data() {
    return {
      model: {
        parentType: '',
        type: '',
        manufacturerName: '',
        classCode: '',
        smlPath: '',
        hostJavaClass: '',
        iconPath: '',
        activeFlag: '',
        remarks: '',
        delFlag: 0,
        createByName: '',
        createDate: '',
        updateByName: '',
        updateDate: '',
        numType: ''
      },
      numTypeOptions: [],
      numtyeps: [],
      formConf: {
        url: '/fab/fabsensormodel/',
        title: {
          ADD: '新增传感器类型',
          EDIT: '修改传感器类型',
          VIEW: '查看传感器类型'
        },
        rules: {
          manufacturerName: [{ required: true, message: '传感器厂家必填', trigger: 'blur' }],
          classCode: [{ required: true, message: '传感器类型必填', trigger: 'blur' }],
          activeFlag: [{ required: true, message: '有效标志必选', trigger: 'change' }]
        },
        onLoadData: (m, type) => {
          console.info(m)
          if (m.officeIds) {
            m.officeIdsm.officeIds
          }
          return m
        },
        beforeSubmit: (params, type) => {
          const re = { ...params }
          if (re.officeId) {
            re.officeId = re.officeIds[re.officeIds.length - 1]
            re.officeIds = undefined
          }

          return re
        }
      }
    }
  },
  mounted() {
    this.model.updateByName = this.$store.getters.roles[0]
    this.model.createByName = this.$store.getters.roles[0]
    this.model.createDate = dateFormat(new Date())
    this.model.updateDate = dateFormat(new Date())
    fetchDict('NUM_TYPE').then((res) => {
      this.numtyeps = res.data
    })
  },
  methods: {
    onDisplayChange(e) {
      this.model.modelName = e
    },
    getNumType() {
      return request({
        url: `fab/sensornumtype/numTypeList/${this.model.classCode}`,
        methods: 'get'
      }).then((res) => {
        let options = []
        options = res.data.results
        this.numtyeps.forEach((item) => {
          options.forEach((it) => {
            if (item.value === it) {
              this.numTypeOptions.push(item)
            }
          })
        })
      })
    },
    change() {
      this.getNumType()
    }
  }
}
</script>
