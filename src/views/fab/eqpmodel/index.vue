<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="query.manufacturerName" style="width: 200px;" class="filter-item" placeholder="请输入设备厂家" @keyup.enter.native="handleFilter"/>
      <el-input v-model="query.classCode" style="width: 200px;" class="filter-item" placeholder="请输入设备类型" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
    </div>
    <eap-table ref="table" :table-conf="{border:true}" @select="handleSelectionChange">
      <el-table-column type="selection" width="36" />
      <el-table-column type="index" label="序号" width="50px" align="center"/>
      <el-table-column align="center" label="设备厂家">
        <template slot-scope="scope">
          <span class="textLink" @click="handleUpdate(scope.row,'deteils')">{{ scope.row.manufacturerName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备类型">
        <template slot-scope="scope">
          <span>{{ scope.row.classCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="有效标志">
        <template slot-scope="scope">
          <span v-if="scope.row.activeFlag == 1">有效</span>
          <span v-else>无效</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateDate }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </eap-table>
  </div>
</template>

<script>
import { fetchDeviceList, deleteDevice, batchDelete } from '@/api/sys/device'

export default {
  name: 'Eqpmodel',
  data() {
    return {
      multipleSelection: [], // 存放选中的值
      query: {
        manufacturerName: undefined,
        classCode: undefined,
        sort: 'updateDate'
      }
    }
  },
  methods: {
    /**
     * 按规范重写这个方法 queryParams 包含所有分页 以及 getParams 方法获取的 其他请求参数
     */
    getList(queryParams) {
      return fetchDeviceList(queryParams)
    },
    /**
     * 按规范重写这个方法 pageQuery 提供当前分页参数 其他参数拼装请取query
     */
    // 转换入参
    getParams(pageQuery) {
      const params = {
        'sort': 'updateDate',
        'page.pn': pageQuery.page,
        'page.size': pageQuery.limit,
        'query.manufacturerName||like': this.query.manufacturerName || '',
        'query.classCode||like': this.query.classCode || '',
        'queryFields': 'id,manufacturerName,classCode,smlPath,hostJavaClass,activeFlag,iconPath,updateDate,'
      }
      return params
    },
    /**
     * 刷新数据使用refs 调用eap-table组件的refresh 方法，参数是 页数 和 分页数
     */
    handleFilter() {
      this.$refs.table.refresh()
    },
    // 选中触发事件
    handleSelectionChange(row) {
      this.multipleSelection = row
    },
    handleDelete(row) {
      deleteDevice(row.id).then(() => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 批量删除
    batchDelete() {
      if (this.multipleSelection.length > 0) {
        this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const obj = {
            ids: ''
          }
          const ids = []
          for (const item of this.multipleSelection) {
            ids.push(item.id)
          }
          obj.ids = ids.join(',')
          batchDelete(obj).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        }).catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消删除',
            duration: 2000
          })
        })
      } else {
        this.$notify({
          showClose: true,
          message: '请选择至少一条数据删除',
          type: 'error',
          duration: 2000
        })
      }
    },
    handleCreate() {
      this.$router.push('/fab/addDevice')
    },
    handleUpdate(item, flag) {
      this.$router.push({
        name: 'views/fab/eqpmodel/addDevice',
        query: {
          id: item.id,
          flag: !flag
        }})
    }
  }
}
</script>
