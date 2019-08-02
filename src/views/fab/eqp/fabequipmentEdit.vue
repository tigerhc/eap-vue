<template>
  <eap-form :title="textMap" :rules="rules" :col="3" :model="modelList" url="/fab/fabequipment/">
    <el-input v-model="modelList.eqpId" label="设备号" />
    <eap-select-dept v-model="modelList.officeIds" label="部门" />
    <el-input v-model="modelList.bcCode" label="BC号" />
    <el-input v-model="modelList.ip" label="机台IP地址" />
    <eap-select-device v-model="modelList.modelName" label="设备型号名称" />
    <el-input v-model="modelList.location" label="位置号" />
    <eap-select-dic v-model="modelList.activeFlag" style="width:100%" label="有效标志" dict="ACTIVE_FLAG" />
  </eap-form>
</template>
<script>
export default {
  name: 'MachineModel',
  data() {
    return {
      modelList: {
        eqpId: '',
        officeIds: [],
        bcCode: '',
        ip: '',
        modelName: '',
        location: '',
        activeFlag: '',
        delFlag: 0,
        officeId: '',
        projectId: '2'
      },
      textMap: {
        addModel: '新增设备',
        editModel: '修改设备'
      },
      viewObj: {},
      tab: '/fab/fabequipment/',
      rules: {
        eqpId: [{ required: true, message: '设备号必填', trigger: 'blur' }],
        modelName: [{ required: true, message: '设备类型必填', trigger: ['blur', 'change'] }],
        activeFlag: [{ required: true, message: '有效标志必选', trigger: 'change' }]
      }
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  methods: {
    getView() {
      const List = this.$store.state.tagsView.visitedViews
      for (const item of List) {
        if (item.name === 'machineModel') {
          this.viewObj = item
        }
      }
    },
    // 获取详情结果处理
    detail(m) {
      m.officeIds = m.officeIds.split(',')
      return m
    },
    // 新增  用于处理参数 返回的值将作为api 请求参数
    add() {
      const re = { ...this.modelList }
      re.officeId = re.officeIds[re.officeIds.length - 1]
      re.officeIds = undefined
      return re
    },
    // 修改
    edit() {
      const re = { ...this.modelList }
      re.officeId = re.officeIds[re.officeIds.length - 1]
      re.officeIds = undefined
      return re
    },
    cancel() {
      this.getView()
      this.$store.dispatch('delView', this.viewObj).then(({ visitedViews }) => {
        this.$router.push({ name: 'views/fab/eqp/fabequipmentList' })
      })
    }
  }
}
</script>
