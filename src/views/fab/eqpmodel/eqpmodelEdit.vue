<template>
  <div class="editDevice">
    <div class="header">
      修改设备类型
    </div>
    <el-form ref="editForm" :inline="true" :rules="rules" :model="editList" class="editForm" label-width="150px">
      <el-form-item label="设备厂家" prop="manufacturerName">
        <el-input :disabled="!showFlag" v-model="editList.manufacturerName"/>
      </el-form-item>
      <el-form-item label="设备类型" prop="classCode">
        <el-input :disabled="!showFlag" v-model="editList.classCode"/>
      </el-form-item>
      <el-form-item label="SML文件路径" prop="smlPath">
        <el-input :disabled="!showFlag" v-model="editList.smlPath"/>
      </el-form-item>
      <el-form-item label="设备对应的JAVA类" prop="hostJavaClass">
        <el-input :disabled="!showFlag" v-model="editList.hostJavaClass"/>
      </el-form-item>
      <el-form-item label="有效标志" prop="activeFlag">
        <el-select :disabled="!showFlag" v-model="editList.activeFlag">
          <el-option label="无效" value="0"/>
          <el-option label="有效" value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="图片路径" prop="iconPath">
        <el-input :disabled="!showFlag" v-model="editList.hostJavaClass"/>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input
          :disabled="!showFlag"
          :autosize="{ minRows: 4}"
          v-model="editList.remarks"
          style="width:540px"
          type="textarea"
          placeholder="请输入内容"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="add-footer">
      <el-button @click="cancel">{{ $t('table.cancel') }}</el-button>
      <el-button v-if="showFlag" type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
    </div>
  </div>
</template>
<script>
import { fetchDeviceList, addDevice, updateDevice, deleteDevice, getDeteilsDevice } from '@/api/sys/device'
export default {
  name: 'editDevice',
  data() {
    return {
      editList: {},
      viewObj: {},
      id: '',
      showFlag:false,
      rules: {
        manufacturerName: [{ required: true, message: '设备厂家必填', trigger: 'blur' }],
        classCode: [{ required: true, message: '设备类型必填', trigger: 'blur' }],
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
    this.id = this.$route.query.id
    this.showFlag = this.$route.query.flag
    this.getDeteils()
  },
  methods: {
    getView() {
      const List = this.$store.state.tagsView.visitedViews
      for (const item of List) {
        if (item.name == 'editDevice') {
          this.viewObj = item
        }
      }
    },
    // 获取详情
    getDeteils() {
      getDeteilsDevice(this.id).then(res => {
        this.editList = res.data
      })
    },
    updateData() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          updateDevice(this.editList).then((res) => {
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
        }
      })
    },
    cancel() {
      this.getView()
      this.$store.dispatch('delView', this.viewObj).then(({ visitedViews }) => {
        this.$router.push({ name: 'views/fab/eqpmodel/eqpmodelList' })
      })
    }
  }
}
</script>
<style lang="scss">
.editDevice{
    margin: 0 0 0 20px;
    .editForm {
        .el-select {
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
</style>
