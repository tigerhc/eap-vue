<template>
  <div class="app-container calendar-list-container">
    <el-card class="searchModule">
      <div class="MenuTreeTitle">
        <div class="left">组织架构</div>
        <div class="right">
          <i class="el-icon-refresh" @click="getOrginData" />
        </div>
      </div>
      <el-tree
        :data="treeData"
        :default-expand-all="true"
        :highlight-current="true"
        :props="Props"
        style="height: 520px; overflow: auto"
        @node-click="handleNodeClick"
      />
    </el-card>
    <div class="contentModule">
      <div class="filter-container">
        <el-input
          v-model="listQuery.realname"
          style="width: 200px"
          class="filter-item"
          placeholder="请输入姓名"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.username"
          style="width: 200px"
          class="filter-item"
          placeholder="请输入用户名"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.phone"
          style="width: 200px"
          class="filter-item"
          placeholder="请输入手机号码"
          @keyup.enter.native="handleFilter"
        />
        <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">{{
          $t('table.search')
        }}</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
        <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">{{
          $t('table.export')
        }}</el-button>
      </div>

      <el-table
        v-loading="listLoading"
        :key="tableKey"
        :data="list"
        element-loading-text="给我一点时间"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column width="150" align="center" label="姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.realname }}</span>
          </template>
        </el-table-column>
        <el-table-column width="120" label="用户名">
          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column width="120" align="center" label="联系电话">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column width="160" align="center" label="邮箱">
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.actions')" align="center">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)">{{ $t('table.delete') }}</el-button> -->
            <el-button size="mini" type="primary" @click="toAssignRoles(scope.row)">设置角色</el-button>
            <!-- <el-button size="mini" type="text" @click="handleModifyPassword(scope.row)">重置密码</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          :current-page.sync="listQuery.page"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="listQuery.limit"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item class="dept" label="部门" prop="orgids">
          <el-cascader v-model="temp.orgids" :options="treeData" :props="Props" />
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="temp.realname" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="手机号码" prop="realname">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item v-if="temp.id == undefined" label="初始密码" prop="password">
          <el-input v-model="temp.password" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus == 'create'" type="primary" @click="createData">{{
          $t('table.confirm')
        }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogFormPasswordVisible" title="修改密码">
      <el-form
        ref="dataModifyForm"
        :rules="modifyPasswordRules"
        :model="modifyPassword"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="初始密码" prop="password">
          <el-input v-model="modifyPassword.password" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormPasswordVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="postModifyPassword">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogFormRolesVisible" title="设置角色" width="55%">
      <el-transfer
        :filterable="true"
        :props="{ key: 'id', label: 'name' }"
        :titles="['可选角色', '已有角色']"
        :button-texts="['撤回', '设置']"
        :format="{ noChecked: '${total}', hasChecked: '${checked}/${total}' }"
        v-model="userRoleIds"
        :data="roleList"
        @change="handleChangeRoles"
      />
    </el-dialog>
  </div>
</template>

<script>
// import { fetchOrganizationList } from '@/api/sys/organization'
// import { fetchList, createUser, deleteUser, updateUser, modifyPassword, exportUser } from '@/api/sys/user'
// import { fetchRoleList } from '@/api/sys/role'
// import { fetchUserRoleIds, insertByUserId, deleteByUserId } from '@/api/sys/userRole'
// import waves from '@/directive/waves' // 水波纹指令
// import { getDictList } from '@/utils/dict'

import { fetchOrganizationList } from '@/api/sys/organization'
import { fetchList, createUser, deleteUser, updateUser, modifyPassword, exportUser } from '@/api/sys/user'
import { fetchRoleList } from '@/api/sys/role'
import { fetchUserRoleIds, insertByUserId, deleteByUserId } from '@/api/sys/userRole'
import waves from '@/directive/waves' // 水波纹指令
import { getDictList } from '@/utils/dict'

export default {
  name: 'SysUserList',
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      treeData: [],
      sexOptions: getDictList('sex'),
      showReviewer: false,
      temp: {
        id: undefined,
        realname: '',
        username: '',
        email: '',
        password: '',
        orgids: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '创建用户'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        realname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        orgids: [{ required: true, message: '请选择组织', trigger: 'change' }]
      },
      downloadLoading: false,
      dialogFormRolesVisible: false,
      roleList: [],
      userRoleIds: [],
      selectCurentUserId: null,
      orgid: '',
      modifyPassword: {
        id: undefined,
        password: undefined
      },
      Props: {
        value: 'id',
        label: 'name'
      },
      dialogFormPasswordVisible: false,
      modifyPasswordRules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getUsableRoleList()
    this.getOrginData()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.orgid = this.orgid
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getUsableRoleList() {
      fetchRoleList().then((response) => {
        this.roleList = response.data
        console.log(this.roleList)
      })
    },
    getUserRoleIds(userId) {
      fetchUserRoleIds(userId).then((response) => {
        this.userRoleIds = response.data
        console.log(this.userRoleIds)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        realname: '',
        username: '',
        email: '',
        password: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.orgid = this.temp.orgids[this.temp.orgids.length - 1]
          createUser(this.temp).then((response) => {
            if (response.data.code === 0) {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.msg,
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: response.data.msg,
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUser(tempData).then((response) => {
            if (response.data.code === 0) {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: response.data.msg,
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: response.data.msg,
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleModifyPassword(row) {
      this.modifyPassword.id = row.id // copy obj
      this.dialogFormPasswordVisible = true
      this.$nextTick(() => {
        this.$refs['dataModifyForm'].clearValidate()
      })
    },
    postModifyPassword() {
      this.$refs['dataModifyForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.modifyPassword)
          modifyPassword(tempData).then((response) => {
            if (response.data.code === 0) {
              this.dialogFormPasswordVisible = false
              this.$notify({
                title: '成功',
                message: response.data.msg,
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: response.data.msg,
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleDelete(row) {
      deleteUser(row.id).then((response) => {
        if (response.data.code === 0) {
          this.getList()
          this.$notify({
            title: '成功',
            message: response.data.msg,
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: response.data.msg,
            duration: 2000
          })
        }
      })
    },
    handleInsertByUserId(selectCurentUserId, roleIds) {
      var idsStr = roleIds.join(',')
      insertByUserId(selectCurentUserId, idsStr).then((response) => {
        if (response.data.code === 0) {
          this.$notify({
            title: '成功',
            message: '设置成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: response.data.msg,
            duration: 2000
          })
        }
      })
    },
    handleDeleteByUserId(selectCurentUserId, roleIds) {
      var idsStr = roleIds.join(',')
      deleteByUserId(selectCurentUserId, idsStr).then((response) => {
        if (response.data.code === 0) {
          this.$notify({
            title: '成功',
            message: '撤回成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: response.data.msg,
            duration: 2000
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = false
      exportUser(this.listQuery).then((response) => {
        this.downloadLoading = true
        if (response.data.code === 0) {
          import('@/vendor/Export2Excel').then((excel) => {
            excel.export_byte_to_excel(response.data.bytes, response.data.title)
            this.downloadLoading = false
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg,
            duration: 2000
          })
        }
      })
    },
    toAssignRoles(row) {
      this.selectCurentUserId = row.id
      this.dialogFormRolesVisible = true
      this.getUserRoleIds(this.selectCurentUserId)
    },
    handleChangeRoles(value, direction, movedKeys) {
      if (direction === 'left') {
        this.handleDeleteByUserId(this.selectCurentUserId, movedKeys)
      } else {
        this.handleInsertByUserId(this.selectCurentUserId, movedKeys)
      }
    },
    // 获取组织
    getOrginData() {
      const parmas = {
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      }
      this.orgid = ''
      fetchOrganizationList(parmas).then((response) => {
        this.treeData = response.data
      })
    },
    handleNodeClick(val) {
      this.orgid = val.id
      this.getList()
    }
  }
}
</script>
<style scoped lang='scss'>
/deep/.el-dialog .el-dialog__body {
  display: flex;
  justify-content: center;
  align-items: center;
}
.searchModule {
  float: left;
  height: 95%;
  width: 22%;
  border-radius: 0px;
  overflow-y: auto;
  box-sizing: border-box;
}
.contentModule {
  float: right;
  width: 77%;
  height: 95%;
  overflow-y: auto;
}
.filter-container .filter-item {
  margin-bottom: 0px;
}
.MenuTreeTitle {
  height: 30px;
}
.left {
  float: left;
}
.right {
  float: right;
}
.el-tree-node__label {
  font-size: 16px;
}
</style>
