<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        style="width: 200px"
        class="filter-item"
        placeholder="请输入角色名称"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.code"
        style="width: 200px"
        class="filter-item"
        placeholder="请输入角色编码"
        @keyup.enter.native="handleFilter"
      />
      <!-- <el-select
        v-model="listQuery.projectId"
        class="filter-item"
        placeholder="请选择项目"
        @keyup.enter.native="handleFilter"
      >
        <el-option v-for="item in projectList" :key="item.id" :label="item.projectName" :value="item.id" />
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{
        $t('table.search')
      }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
        >{{ $t('table.add') }}</el-button
      >
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
      <el-table-column width="200" align="center" label="角色名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150" label="角色编码">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="是否可用">
        <template slot-scope="scope">
          <span>{{ scope.row.usable | dictLabel('sf') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" style="width: 100px" @click="toSetMenu(scope.row)">关联设备</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('table.delete') }} </el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left: 50px"
      >
        <!-- <el-form-item label="项目" prop="project"> -->
        <!-- <el-select
            :disabled="dialogStatus == 'update'"
            v-model="temp.projectId"
            class="filter-item"
            placeholder="请选择项目"
          >
            <el-option v-for="item in projectList" :key="item.id" :label="item.projectName" :value="item.id" />
          </el-select> -->
        <!-- </el-form-item> -->
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="temp.code" />
        </el-form-item>
        <el-form-item label="是否系统数据" prop="isSys">
          <el-radio v-for="item in dictList('sf')" :key="item.id" v-model="temp.isSys" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-form-item>
        <el-form-item label="是否可用" prop="usable">
          <el-radio v-for="item in dictList('sf')" :key="item.id" v-model="temp.usable" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="temp.remarks"
            type="textarea"
            placeholder="请输入内容"
          />
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
    <!--设置权限-->
    <el-dialog :visible.sync="dialogFormMenuVisible" :fullscreen="true" title="设置关联设备">
      <div class="box">
        <el-card class="searchModule" style="width: 500px; height: 600px">
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
        <div class="box1">
          <el-table
            ref="multipleTable"
            :data="tableData.slice((pageInfo.pageNum - 1) * pageInfo.pageSize, pageInfo.pageNum * pageInfo.pageSize)"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            style="width: 100%; margin-left: 100px"
            height="250"
            @selection-change="change"
            @select="select"
            @select-all="selectAll"
          >
            <el-table-column type="selection" label="序号" />
            <el-table-column type="index" label="序号" />
            <el-table-column prop="modelName" label="设备型号" />
            <el-table-column prop="eqpName" label="设备名称" />
            <el-table-column prop="eqpId" label="设备号" />
          </el-table>

          <el-pagination
            :current-page="pageInfo.pageNum"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="pageInfo.pageSize"
            :total="tableData.length"
            layout="total, sizes,prev, pager, next, jumper"
            style="margin-top: 20px"
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
          />
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormMenuVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="handleChangeMenus">关联设备</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchProList } from '@/api/sys/project'
import { getList, addRoleEqp, deleteRole, updateRoleEqp, fetchRoleMenu, setEqp } from '@/api/sys/role'
import waves from '@/directive/waves' // 水波纹指令
import { fetchOrganizationList } from '@/api/sys/organization'
import request from '@/utils/request'

export default {
  name: 'SysRoleList',
  directives: {
    waves
  },
  data() {
    return {
      pageInfo: {
        pageSize: 10,
        pageNum: 1
      },
      tableData: [
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'true' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'true' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'false' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'true' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'true' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'false' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'true' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'true' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'false' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'true' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'true' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'true' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'true' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'false' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'true' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'true' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'false' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'true' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'true' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'false' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'true' },
        // { modelName: 'Liu', eqpName: '222', eqpId: '333', flag: 'true' }
      ],
      Props: {
        value: 'id',
        label: 'name'
      },
      treeData: [],
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
        sort: '+id',
        projectId: ''
      },
      showReviewer: false,
      temp: {
        projectId: '',
        id: undefined,
        isSys: '1',
        usable: '1',
        name: '',
        code: '',
        remark: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑角色',
        create: '添加角色'
      },
      projectList: [],
      dialogPvVisible: false,
      pvData: [],
      rules: {
        code: [{ required: true, message: '角色编码必填', trigger: 'change' }],
        name: [{ required: true, message: '角色名称必填', trigger: 'change' }],
        isSys: [{ required: true, message: '是否系统必选', trigger: 'blur' }],
        usable: [{ required: true, message: '是否可用必选', trigger: 'blur' }]
      },
      dialogFormMenuVisible: false,
      menuData: null,
      selectCurentRoleId: '', // 角色id
      selectMenuIds: [],
      menuTemp: {
        menuIds: ''
      },
      menuTreeProps: {
        children: 'children',
        label: 'name'
      },
      orgid: '',
      eqpIds: ''
    }
  },
  created() {
    this.getProList()
    this.getOrginData()
  },
  mounted() {},
  methods: {
    selectAll(v) {
      v.forEach((item) => {
        item.flag = 'true'
      })
    },
    select(rows, row) {
      const selected = rows.length && rows.indexOf(row) !== -1
      if (selected) {
        rows.forEach((item) => {
          item.flag = 'true'
        })
      } else {
        rows.forEach((item) => {
          item.flag = 'false'
        })
      }
    },

    change(v) {
      // console.log(v)

      v.forEach((item) => {
        this.eqpIds += item.eqpId + ','
      })
      // console.log(eqpId)
    },
    getA() {
      const arr = []
      this.tableData.forEach((item) => {
        if (item.flag === 'true') {
          arr.push(item)
        }
      })
      if (arr) {
        this.toggleSelection(arr)
      }
    },
    handleSizeChange1(pagesize) {
      this.pageInfo.pageSize = pagesize
    },
    handleCurrentChange1(pagenum) {
      this.pageInfo.pageNum = pagenum
      this.getA()
    },
    toggleSelection(rows) {
      if (rows && rows.length) {
        rows.forEach((row) => {
          setTimeout(() => {
            this.$refs.multipleTable.toggleRowSelection(row)
          }, 500)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    getTableData(query) {
      return request({
        url: `fab/iotroleeqp/list`,
        methods: 'get',
        query
      }).then((res) => {
        console.log('初始化')
        console.log(res)
      })
    },

    handleNodeClick(val) {
      this.orgid = val.id
      this.getTableData(this.orgid)
    },
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
    getList() {
      this.listLoading = true
      getList(this.listQuery).then((response) => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 查询项目
    getProList() {
      const params = this.changeParams()
      fetchProList(params).then((response) => {
        this.projectList = response.data
        this.listQuery.projectId = this.projectList[0].id
        this.getList()
      })
    },
    // 转换入参
    changeParams() {
      const params = {
        'page.pn': 1,
        'page.size': 99999,
        status: 1,
        delFlag: 0,
        queryFields: 'id,projectName,projectDetail,projectUrl,projectPhotoUrl,'
      }
      return params
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
        isSys: '1',
        usable: '1',
        name: '',
        code: '',
        remark: ''
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
          addRoleEqp(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
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
          updateRoleEqp(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      deleteRole(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })
    },
    getRoleMenus(roleId, menuModule) {
      fetchRoleMenu(roleId, menuModule).then((response) => {
        this.menuData = response.data.menus
        this.selectMenuIds = response.data.selectMenuIds
      })
    },
    toSetMenu(row) {
      this.selectCurentRoleId = row.id
      this.dialogFormMenuVisible = true
      this.getRoleMenus(this.selectCurentRoleId, this.menuTemp.module)
      this.getA()
    },
    changeMenu() {
      this.getRoleMenus(this.selectCurentRoleId, this.menuTemp.module)
    },
    handleChangeMenus() {
      const postData = {
        roleId: this.selectCurentRoleId,
        orgid: this.orgid,
        eqpid: this.eqpIds
      }
      setEqp(postData).then((response) => {
        const data = response.data
        if (data.code === 0) {
          this.dialogFormMenuVisible = false
          this.$notify({
            title: '成功',
            message: '设置成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: data.msg,
            type: 'error',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.left {
  float: left;
}
.right {
  float: right;
}
.MenuTreeTitle {
  height: 30px;
}
.box {
  width: 100%;
  height: 650px;
  display: flex;
}
.box1 {
  width: 50%;
  height: 537px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.el-table {
  overflow: auto;
}
</style>
