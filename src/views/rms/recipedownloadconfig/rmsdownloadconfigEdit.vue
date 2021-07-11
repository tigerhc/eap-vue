<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select v-model="listQuery.eqpModelName" filterable style="width: 200px;" class="filter-item" placeholder="请选择设备类型">
        <el-option
          v-for="item in eqpModelNameList"
          :key="item.id"
          :label="item.manufacturerName + '-' + item.classCode"
          :value="item.manufacturerName + '-' + item.classCode"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      element-loading-text="给我一点时间"
      border
      fit
      style="width: 100%">
      <el-table-column type="index" label="序号" width="60px" align="center"/>
      <el-table-column align="center" label="设备类型">
        <template slot-scope="scope">
          <span>{{ scope.row.eqpModelName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="优先下载">
        <template slot-scope="scope">
          <span>{{ formatter(scope.row.level1,'versionTypeList') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="其次下载">
        <template slot-scope="scope">
          <span>{{ formatter(scope.row.level2,'versionTypeList') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后下载">
        <template slot-scope="scope">
          <span>{{ formatter(scope.row.level3,'versionTypeList') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateDate }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" width="200px" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" title="编辑" size="mini" icon="el-icon-edit" circle @click="edit(scope.row.id,scope.row.level1,scope.row.level2,scope.row.level3)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogFormEdit" title="修改配置">
      <!--<el-form ref="dataModifyForm" :rules="modifyPasswordRules" :model="modifyPassword" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">-->
      <el-form ref="dataModifyForm" :model="params" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="优先下载" prop="eqpId">
          <el-select v-model="params.level1" clearable filterable style="width: 200px;" class="filter-item" placeholder="请选择程序版本">
            <el-option
              v-for="item in dictList.versionTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="其次下载" prop="recipeName">
          <el-select v-model="params.level2" clearable filterable style="width: 200px;" class="filter-item" placeholder="请选择程序版本">
            <el-option
              v-for="item in dictList.versionTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="最后下载" prop="recipeName">
          <el-select v-model="params.level3" clearable filterable style="width: 200px;" class="filter-item" placeholder="请选择程序版本">
            <el-option
              v-for="item in dictList.versionTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEdit = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="doEdit">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <div class="pagination-container">
      <el-pagination
        :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import { fetchList, update, fetchDict } from '@/api/public'
import { fetchDeviceList } from '@/api/fab/model'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'DownloadConfig',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      dialogFormEdit: false,
      params: {
        id: '',
        level1: '',
        level2: '',
        level3: ''
      },
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        versionType: undefined,
        eqpModelName: undefined
      },
      dictList: {
        versionTypeList: []
      },
      eqpModelNameList: [],
      tab: 'rms/rmsrecipedownloadconfig/'
    }
  },
  created() {
    this.getList()
    this.getDictValue()
  },
  methods: {
    formatter(value, type) {
      for (const item of this.dictList[type]) {
        if (item.value === value) {
          return item.label
        }
      }
    },
    getDictValue() {
      const typeList = ['RECIPE_VERSION_TYPE']
      const list = ['versionTypeList']
      for (let i = 0; i < typeList.length; i++) {
        this.getDictList(typeList[i], list[i])
      }
      // 获取设备类型
      this.getDevice()
    },
    getDevice() {
      const obj = {
        'sort': 'updateDate',
        'page.pn': 1,
        'page.size': 999999,
        'queryFields': 'id,manufacturerName,classCode,smlPath,hostJavaClass,activeFlag,iconPath,updateDate,'
      }
      fetchDeviceList(obj).then(response => {
        this.eqpModelNameList = response.data.results
      })
    },
    // 获取字典list
    getDictList(type, name) {
      fetchDict(type).then(response => {
        this.dictList[name] = response.data
      })
    },
    getList() {
      this.listLoading = true
      const params = this.changeParams(this.listQuery)
      fetchList(this.tab, params).then(response => {
        this.list = response.data.results
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 转换入参
    changeParams(obj) {
      const params = {
        'sort': 'updateDate',
        'page.pn': obj.page,
        'page.size': obj.limit,
        'query.eqpModelName||eq': obj.eqpModelName || '',
        'queryFields': 'id,eqpModelId,eqpModelName,level1,level2,level3,remarks,createBy,createDate,updateBy,updateDate,'
      }
      return params
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
      this.listQuery.eqpModelName = undefined
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    edit(id, level1, level2, level3) {
      this.params = {
        id: id,
        level1: level1,
        level2: level2,
        level3: level3
      }
      this.dialogFormEdit = true
    },
    doEdit() {
      if ((this.params.level1 === '' && (this.params.level2 !== '' || this.params.level3 !== '')) || (this.params.level2 === '' && this.params.level3 !== '')) {
        this.$notify({
          title: '失败',
          message: '请优先设置高优先级，不然后续优先级设置是无效的',
          type: 'error',
          duration: 2000
        })
      } else if (this.params.level1 !== '' && (this.params.level1 === this.params.level2 || this.params.level1 === this.params.level3)) {
        this.$notify({
          title: '失败',
          message: '请勿选择相同的程序版本,没有可不选',
          type: 'error',
          duration: 2000
        })
      } else if (this.params.level2 !== '' && this.params.level2 === this.params.level3) {
        this.$notify({
          title: '失败',
          message: '请勿选择相同的程序版本,没有可不选',
          type: 'error',
          duration: 2000
        })
      } else {
        update(this.tab, this.params).then((res) => {
          if (res.data.code === 0) {
            this.dialogFormEdit = false
            this.getList()
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
    }
  }
}
</script>
