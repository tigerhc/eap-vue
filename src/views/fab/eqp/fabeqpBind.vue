<template>
  <div class="app">
    <el-card>
      <div slot="header" class="clearfix">
        <span>设备绑定</span>
      </div>
      <el-row>
        <el-select v-model="parentEqpId.parentEqpId" placeholder="请选择设备号">
          <el-option v-for="item in eqpMode0ptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-button type="primary" style="margin-left: 15px" @click="search()">查询</el-button>
      </el-row>
      <!-- <el-row>
      <el-table
          v-loading="isLoading"
          :data="
            eqpTemplateDatas.slice(
              (pageInfo1.pagenum1 - 1) * pageInfo1.pagesize1,
              pageInfo1.pagenum1 * pageInfo1.pagesize1
            )
          "
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
          style="width: 100%"
          border
          @row-click="getData"
        >
          <el-table-column prop="name" label="模板名称" />
          <el-table-column prop="officeId" label="部门ID" />
          <el-table-column prop="classCode" label="设备类型" />
          <el-table-column prop="active_flag" label="是否应用">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.active_flag === 'Y'" type="success">是</el-tag>
              <el-tag v-else type="danger">否</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_by" label="创建人ID"> </el-table-column>
        </el-table>
      <el-pagination
          :current-page="pageInfo1.pagenum1"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageInfo1.pagesize1"
          :total="eqpTemplateDatas.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
        />
      </el-row> -->

      <el-row>
        <el-table
          v-loading="listLoading"
          :data="
            eqpTemplateBindDatas.slice(
              (pageInfo2.pagenum2 - 1) * pageInfo2.pagesize2,
              pageInfo2.pagenum2 * pageInfo2.pagesize2
            )
          "
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
          style="width: 100%"
          border
        >
          <!-- <el-table-column prop="id" label="ID" /> -->
          <el-table-column prop="name" label="模板名称" />
          <el-table-column prop="officeId" label="部门ID" />
          <el-table-column prop="classCode" label="子设备类型" />
          <el-table-column prop="eqpId" label="传感器编号" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle @click="editClassCode(scope.row, scope.$index)" />
              <el-button type="danger" icon="el-icon-delete" circle @click="delDatas(scope.row, scope.$index)" />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="pageInfo2.pagenum2"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageInfo2.pagesize2"
          :total="eqpTemplateBindDatas.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
        />
      </el-row>

      <el-dialog :visible.sync="dialogVisible" title="修改子设备号" width="30%">
        <el-select v-model="sorIdValue" placeholder="请选择传感器编号">
          <el-option v-for="item in sorIdOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-row style="margin-top: 15px">
          <label>备注：</label>
          <el-input v-model="remarksValue" type="textarea" />
        </el-row>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit()">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog :visible.sync="delDialogVisible" title="提示" width="30%">
        <p>确定删除吗？</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="del()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import request from '@/utils/request'
import dateFormat from '@/utils/dateformat'

export default {
  components: {},
  data() {
    return {
      delDialogVisible: false,
      isLoading: false,
      listLoading: false,
      dialogVisible: false,
      sorIdValue: '',
      sorIdOptions: [],
      // pageInfo1: {
      //   pagenum1: 1,
      //   pagesize1: 5
      // },
      pageInfo2: {
        pagenum2: 1,
        pagesize2: 5
      },
      remarksValue: '',
      parentEqpId: { parentEqpId: '' },
      eqpMode0ptions: [],
      // eqpTemplateDatas: [],
      eqpTemplateBindDatas: [
        {
          id: '12312',
          name: 'sad',
          officeId: '12',
          classCode: 'saas',
          eqpId: 'asda',
          remarks: '',
          createBy: '',
          createDate: '',
          updateBy: '',
          updateDate: ''
        }
      ],
      datas: {},
      num: 0,
      num1: 0
    }
  },
  mounted() {
    this.getEqpNum()
    this.eqpTemplateBindDatas[this.num].updateBy = this.$store.getters.roles[0]
    this.eqpTemplateBindDatas[this.num].createBy = this.$store.getters.roles[0]
    this.eqpTemplateBindDatas[this.num].createDate = dateFormat(new Date())
    this.eqpTemplateBindDatas[this.num].updateDate = dateFormat(new Date())
  },
  methods: {
    delDatas(row, idnex) {
      this.num1 = idnex
      this.delDialogVisible = true
    },
    del() {
      const id = this.eqpTemplateBindDatas[this.num1].id
      return request({
        url: `fab/fabSensor/${id}/delete`,
        method: `post`
      })
        .then(() => {
          this.search()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
        .finally(() => {
          this.delDialogVisible = false
        })
    },
    getEqpNum() {
      return request({
        url: 'fab/fabequipment/eqpIdlist',
        method: 'get'
      }).then((res) => {
        this.eqpMode0ptions = res.data.results
      })
    },
    getSorsenNum() {
      const query = this.eqpTemplateBindDatas[this.num].classCode
      return request({
        url: `fab/fabSensor/sorIdlist/${query}`,
        methods: 'get'
      }).then((res) => {
        console.log(res)
      })
    },
    search() {
      console.log(this.parentEqpId)
      return request({
        url: `fab/iotequipmentbind/page`,
        methods: 'get',
        params: this.parentEqpId
      }).then((res) => {
        console.log(res)
      })
    },
    editClassCode(row, index) {
      this.num = index
      this.sorIdValue = row.eqpId
      this.getSorsenNum()
      this.dialogVisible = true
    },
    getData(row) {
      console.log(row)
    },
    // handleSizeChange1(pagesize) {
    //   this.pageInfo1.pagesize1 = pagesize
    // },
    // handleCurrentChange1(pagenum) {
    //   this.pageInfo1.pagenum1 = pagenum
    // },
    handleSizeChange2(pagesize) {
      this.pageInfo2.pagesize2 = pagesize
    },
    handleCurrentChange2(pagenum) {
      this.pageInfo2.pagenum2 = pagenum
    },
    submit() {
      this.eqpTemplateBindDatas[this.num].eqpId = this.sorIdValue
      this.eqpTemplateBindDatas[this.num].remarks = this.remarksValue

      this.datas = this.eqpTemplateBindDatas[this.num]
      console.log(this.datas)
      return request({
        url: `fab/fabSensor/create`,
        method: `post`,
        data: this.datas
      })
        .then((res) => {
          if (res.code === 0) {
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
        .finally(() => {
          this.dialogVisible = false
        })
    }
  }
}
</script>

<style  scoped>
.el-row {
  margin-bottom: 15px;
}

.el-pagination {
  text-align: center;
  margin-top: 15px;
}
</style>
