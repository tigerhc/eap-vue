<template>
  <div class="addDevice">
    <div class="header">
      新增设备类型
    </div>
    <el-form ref="addForm" :inline="true" :rules="rules" :model="addList" class="addForm" label-width="150px">
      <el-form-item label="设备厂家" prop="manufacturerName">
        <el-input v-model="addList.manufacturerName"/>
      </el-form-item>
      <el-form-item label="设备类型" prop="classCode">
        <el-input v-model="addList.classCode"/>
      </el-form-item>
      <el-form-item label="SML文件路径" prop="smlPath">
        <el-input v-model="addList.smlPath"/>
      </el-form-item>
      <el-form-item label="设备对应的JAVA类" prop="hostJavaClass">
        <el-input v-model="addList.hostJavaClass"/>
      </el-form-item>
      <el-form-item label="有效标志" prop="activeFlag">
        <el-select v-model="addList.activeFlag">
          <el-option label="无效" value="0"/>
          <el-option label="有效" value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="图片路径" prop="iconPath">
        <el-input v-model="addList.hostJavaClass"/>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input
          :autosize="{ minRows: 4}"
          v-model="addList.remarks"
          style="width:540px"
          type="textarea"
          placeholder="请输入内容"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="add-footer">
      <el-button @click="cancel">{{ $t('table.cancel') }}</el-button>
      <el-button type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
    </div>
  </div>
</template>
<script>
import { fetchDeviceList, addDevice, updateDevice, deleteDevice } from '@/api/sys/device'
export default {
  name: 'AddDevice',
  data() {
    return {
      addList: {
        manufacturerName: '',
        classCode: '',
        smlPath: '',
        hostJavaClass: '',
        activeFlag: '',
        hostJavaClass: '',
        remarks: '',
        delFlag: 0,
        projectId: '1'
      },
      viewObj: {},
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
    }
  },
  mounted() {
    console.log(this.$store.state.tagsView.visitedViews)
  },
  methods: {
    getView() {
      const List = this.$store.state.tagsView.visitedViews
      for (const item of List) {
        if (item.name == 'addDevice') {
          this.viewObj = item
        }
      }
    },
    createData() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          addDevice(this.addList).then((res) => {
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
        }
      })
    },
    cancel() {
      this.getView()
      this.$store.dispatch('delView', this.viewObj).then(({ visitedViews }) => {
        this.$router.push({ name: 'device' })
      })
    }
  }
}
</script>
<style lang="scss">
.addDevice{
    margin: 0 0 0 20px;
    .addForm {
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
