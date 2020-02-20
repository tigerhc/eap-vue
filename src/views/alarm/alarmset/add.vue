<template>
  <div class="app-container calendar-list-container">
    <el-form ref="modelForm" :inline="true" :model="addList" class="modelForm" label-width="90px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="报警名称" prop="alarmName">
            <el-input v-model="addList.alarmName" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="ALID" prop="alarmId">
            <el-input v-model="addList.alarmId" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备类型" prop="eqpModelId">
            <el-select
              v-model="addList.eqpModelId"
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
            <el-select v-model="addList.alarmCode" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in dictList('AMS_ALARM_TYPE')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="启用人" prop="updateByName">
            <el-input v-model="addList.updateByName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="启用时间" prop="updateDate">
            <el-date-picker
              v-model="addList.updateDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>-->
        <!-- <el-col :span="8">
          <el-form-item label="停用人" prop="alid">
            <el-input v-model="addList.alid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="制单人" prop="alid">
            <el-input v-model="addList.alid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="制单时间" prop="alid">
            <el-date-picker
              v-model="addList.hfrq"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>-->
        <el-col :span="8">
          <el-form-item label="状态" prop="monitorFlag">
            <el-select v-model="addList.monitorFlag" filterable clearable placeholder="请选择状态">
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
              <el-input v-model="row.alarmLanguage" />
            </template>
          </el-table-column>
          <el-table-column prop="alarmName" label="备注" align="center">
            <template slot-scope="{row}">
              <el-input v-model="row.alarmName" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div class="btn">
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { addDevice } from '@/api/alarm/alarmSet'
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
      list: [
        {
          alarmLanguage: '中文简体',
          alarmName: ''
        },
        {
          alarmLanguage: '中文简体',
          alarmName: ''
        },
        {
          alarmLanguage: '英文',
          alarmName: ''
        },
        {
          alarmLanguage: '韩文',
          alarmName: ''
        }
      ],
      total: null,
      listLoading: true,
      eqpModelNameList: [],
      id: '',
      addList: {
        monitorFlag: '',
        alarmId: '',
        eqpModelId: '',
        alarmCode: '',
        eqpModelName: '',
        alarmName: ''
      },
      ruleForm: {}
    }
  },
  mounted() {
    this.getDevice()
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
    save() {
      const { monitorFlag, alarmId, eqpModelId, alarmName, alarmCode, eqpModelName } = this.addList
      const parmas = {
        monitorFlag,
        alarmName,
        alarmId,
        eqpModelId,
        eqpModelName,
        alarmCode,
        _detail: JSON.stringify(this.list)
      }
      addDevice(parmas).then((res) => {
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
    },
    getView() {
      const List = this.$store.state.tagsView.visitedViews
      for (const item of List) {
        if (item.name === 'views/alarm/alarmset/add') {
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
      this.addList.eqpModelName = obj.classCode || ''
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
