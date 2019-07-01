<template>
  <div class="model">
    <div class="header">
      {{ textMap[modelType] }}
    </div>
    <el-form ref="modelForm" :inline="true" :rules="rules" :model="modelList" class="modelForm" label-width="150px">
      <el-form-item label="设备号" prop="eqpId">
        <el-input :disabled="!showFlag" v-model="modelList.eqpId"/>
      </el-form-item>
      <el-form-item class="dept" label="部门" prop="officeName">
        <el-cascader
          :disabled="!showFlag"
          v-model="modelList.officeIds"
          :options="options"
          :props="{ expandTrigger: 'hover',value:'id',label:'name' }"
          style="width:400px"
        />
      </el-form-item>
      <el-form-item label="BC号" prop="bcCode">
        <el-input :disabled="!showFlag" v-model="modelList.bcCode"/>
      </el-form-item>
      <el-form-item label="机台IP地址" prop="ip">
        <el-input :disabled="!showFlag" v-model="modelList.ip"/>
      </el-form-item>
      <el-form-item label="设备型号名称" prop="modelName">
        <el-input :disabled="!showFlag" v-model="modelList.modelName" style="wdith:185px" placeholder="单击选择设备类型" readonly>
          <i slot="suffix" class="el-input__icon el-icon-search" @click="selecton"/>
        </el-input>
      </el-form-item>
      <el-form-item label="位置号" prop="location">
        <el-input :disabled="!showFlag" v-model="modelList.location"/>
      </el-form-item>
      <el-form-item label="有效标志" prop="activeFlag">
        <el-select :disabled="!showFlag" v-model="modelList.activeFlag">
          <el-option label="无效" value="0"/>
          <el-option label="有效" value="1"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="add-footer">
      <el-button @click="cancel">返回</el-button>
      <el-button v-if="showFlag" type="primary" @click="operating">{{ $t('table.confirm') }}</el-button>
    </div>
    <select-device ref="selectDevice" @childByValue="childByValue"/>
  </div>
</template>
<script>
import { fetchOrganizationList } from '@/api/sys/organization'
import { fetchList, create, update, del, deteils, batchDelete } from '@/api/public'
import SelectDevice from './select/selectDevice'
export default {
  name: 'machineModel',
  components: { SelectDevice },
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
        projectId: '1'
      },
      textMap: {
        addModel: '新增设备',
        editModel: '修改设备'
      },
      modelType: '',
      viewObj: {},
      id: '',
      tab: '/fab/fabequipment/',
      options: [],
      showFlag:undefined,
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
    },
  },
  mounted() {
    this.modelType = this.$route.query.type
    fetchOrganizationList(this.listQuery).then(response => {
      this.options = response.data
    })
    if (this.modelType !== 'addModel') {
      this.id = this.$route.query.id
      this.showFlag = this.$route.query.flag
      this.getDeteils()
    }
  },
  methods: {
    getView() {
      const List = this.$store.state.tagsView.visitedViews
      for (const item of List) {
        if (item.name == 'machineModel') {
          this.viewObj = item
        }
      }
    },
    // 获取详情
    getDeteils() {
      deteils(this.tab, this.id).then(res => {
        this.modelList = res.data
        this.modelList.officeIds = this.modelList.officeIds.split(',')
      })
    },
    operating() {
      this.$refs['modelForm'].validate((valid) => {
        if (valid) {
          if (this.modelType == 'addModel') {
            this.add()
          } else {
            this.edit()
          }
        }
      })
    },
    // 新增
    add() {
      this.modelList.officeId = this.modelList.officeIds[this.modelList.officeIds.length - 1]
      this.modelList.officeIds = undefined
      create(this.tab, this.modelList).then((res) => {
        if (res.data.code == 0) {
          this.cancel()
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '添加失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    // 修改
    edit() {
      this.modelList.officeId = this.modelList.officeIds[this.modelList.officeIds.length - 1]
      this.modelList.officeIds = undefined
      update(this.tab, this.modelList).then((res) => {
        if (res.data.code == 0) {
          this.cancel()
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '修改失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    cancel() {
      this.getView()
      this.$store.dispatch('delView', this.viewObj).then(({ visitedViews }) => {
        this.$router.push({ name: 'machine' })
      })
    },
    selecton() {
      this.$refs.selectDevice.openDialog(true)
    },
    // 获取选择的值
    childByValue(val) {
      this.modelList.modelName = val
    }
  }
}
</script>
<style lang="scss">
.model{
    margin: 0 0 0 20px;
    .modelForm {
        .el-select {
            width: 185px;
        }
        .el-input__inner{
           width: 185px;
        }
    }
    .header {
        height: 50px;
        border-bottom: 1px solid #eee;
        padding: 13px 10px 1px 15px;
        font-size: 16px;
        margin-bottom: 20px;
    }
}
.dept{
  .el-input__inner{
           width: 400px!important;
        }
}
</style>
