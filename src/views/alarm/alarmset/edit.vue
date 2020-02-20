<template>
  <div class="app-container calendar-list-container">
    <el-form
      ref="modelForm"
      :inline="true"
      :rules="rules"
      :model="editList"
      class="modelForm"
      label-width="90px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="报警名称" prop="alarmName">
            <el-input :disabled="!editFlag" v-model="editList.alarmName" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备类型" prop="eqpModelId">
            <el-select
              :disabled="!editFlag"
              v-model="editList.eqpModelId"
              filterable
              clearable
              placeholder="请选择"
              @change="selectEqp"
            >
              <el-option
                v-for="item in eqpModelNameList"
                :key="item.id"
                :label="item.classCode"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Alarm类型" prop="alarmCode">
            <el-select
              :disabled="!editFlag"
              v-model="editList.alarmCode"
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
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="修改人" prop="updateByName">
            <el-input v-model="editList.updateByName" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="启用时间" prop="updateDate">
            <el-date-picker
              v-model="editList.updateDate"
              disabled
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="制单人" prop="createByName">
            <el-input v-model="editList.createByName" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="制单时间" prop="createDate">
            <el-date-picker
              v-model="editList.createDate"
              disabled
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="monitorFlag">
            <el-select
              :disabled="!editFlag"
              v-model="editList.monitorFlag"
              filterable
              clearable
              placeholder="请选择状态"
            >
              <el-option
                v-for="item in dictList('MONITOR_FLAG')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-form ref="ruleForm" :model="ruleForm" :inline="true" :label-position="'right'">
        <el-table :key="tableKey" :data="list" border fit>
          <el-table-column type="index" label="序号" width="50px" align="center" />
          <el-table-column width="200" prop="alarmLanguage" label="语言类型" align="center">
            <template slot-scope="{row}">
              <el-input v-model="row.alarmLanguage" disabled />
            </template>
          </el-table-column>
          <el-table-column prop="alarmName" label="备注" align="center">
            <template slot-scope="{row}">
              <el-input :disabled="!editFlag" v-model="row.alarmName" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div v-show="editFlag" class="btn">
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchDeteils, update } from '@/api/alarm/alarmSet'
import waves from '@/directive/waves' // 水波纹指令
import { fetchDeviceList } from '@/api/sys/device'
export default {
  name: 'AlarmsetAdd',
  directives: {
    waves
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
    getDevice() {
      const obj = {
        sort: 'updateDate',
        'page.pn': 1,
        'page.size': 999999,
        queryFields: 'id,manufacturerName,classCode,smlPath,hostJavaClass,activeFlag,iconPath,updateDate,'
      }
      fetchDeviceList(obj).then((response) => {
        this.eqpModelNameList = response.data.results
      })
    },
    getDeatails() {
      fetchDeteils(this.fromInfo.id).then((res) => {
        this.editList = res.data
        this.list = res.data.edcAmsRecordList
      })
    },
    save() {
      const { monitorFlag, eqpModelId, alarmName, alarmCode, eqpModelName, id } = this.editList
      const parmas = {
        monitorFlag,
        alarmName,
        eqpModelId,
        eqpModelName,
        alarmCode,
        id,
        _detail: JSON.stringify(this.list)
      }
      this.$refs['modelForm'].validate((valid) => {
        if (valid) {
          update(parmas).then((res) => {
            if (res.data.code === 0) {
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
        } else {
          return
        }
      })
    },
    getView() {
      const List = this.$store.state.tagsView.visitedViews
      for (const item of List) {
        if (item.name === 'views/alarm/alarmset/edit') {
          this.viewObj = item
        }
      }
    },
    cancel() {
      this.getView()
      this.$store.dispatch('delView', this.viewObj).then(({ visitedViews }) => {
        this.$router.push({ name: 'views/alarm/alarmset/index' })
      })
    },
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
