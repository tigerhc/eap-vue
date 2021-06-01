<template>
  <div class="app">
    <el-card>
      <div slot="header" class="clearfix">
        <span>设备绑定</span>
      </div>
      <el-row>
        <el-select v-model="eqpModeV" placeholder="请选择设备号">
          <el-option v-for="item in eqpMode0ptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" style="margin-left: 15px">查询</el-button>
      </el-row>
      <el-row>
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
          <el-table-column prop="office_id" label="部门ID" />
          <el-table-column prop="class_code" label="设备类型" />
          <el-table-column prop="active_flag" label="是否应用">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.active_flag === 'Y'" type="success">是</el-tag>
              <el-tag v-else type="danger">否</el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="create_by" label="创建人ID"> </el-table-column> -->
        </el-table>
        <!-- <el-pagination
          :current-page="pageInfo1.pagenum1"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageInfo1.pagesize1"
          :total="eqpTemplateDatas.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
        /> -->
      </el-row>

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
          <el-table-column prop="name" label="模板名称" />
          <el-table-column prop="office_id" label="部门ID" />
          <el-table-column prop="class_code" label="子设备类型" />
          <el-table-column prop="record_id" label="子设备号" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle @click="editClassCode(scope.row)" />
              <el-button type="danger" icon="el-icon-delete" circle />
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

      <el-dialog :visible.sync="dialogVisible" title="修改子设备类型" width="30%">
        <el-select v-model="classCodeValue" placeholder="请选择子设备类型">
          <el-option v-for="item in classCodeOptions" :key="item.value" :label="item.label" :value="item.label" />
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// import x from ''
export default {
  components: {},
  data() {
    return {
      isLoading: false,
      listLoading: false,
      dialogVisible: false,
      classCodeValue: '',
      classCodeOptions: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      pageInfo1: {
        pagenum1: 1,
        pagesize1: 5
      },
      pageInfo2: {
        pagenum2: 1,
        pagesize2: 5
      },
      eqpModeV: '',
      eqpMode0ptions: [],
      eqpTemplateDatas: [
        {
          name: 'sad',
          office_id: '12',
          class_code: 'saas',
          active_flag: 'Y'
        },
        {
          name: 'sad',
          office_id: '12',
          class_code: 'saas',
          active_flag: 'Y'
        },
        {
          name: 'sad',
          office_id: '12',
          class_code: 'saas',
          active_flag: 'N'
        },
        {
          name: 'sad',
          office_id: '12',
          class_code: 'saas',
          active_flag: 'Y'
        },
        {
          name: 'sad',
          office_id: '12',
          class_code: 'saas',
          active_flag: 'N'
        },
        {
          name: 'sad',
          office_id: '12',
          class_code: 'saas',
          active_flag: 'Y'
        }
      ],
      eqpTemplateBindDatas: [
        {
          name: 'sad',
          office_id: '12',
          class_code: 'saas',
          record_id: 'asda'
        }
      ]
    }
  },
  mounted() {},
  methods: {
    editClassCode(row) {
      this.code = row.class_code
      this.dialogVisible = true
    },
    getData(row) {
      console.log(row)
    },
    handleSizeChange1(pagesize) {
      this.pageInfo1.pagesize1 = pagesize
    },
    handleCurrentChange1(pagenum) {
      this.pageInfo1.pagenum1 = pagenum
    },
    handleSizeChange2(pagesize) {
      this.pageInfo2.pagesize2 = pagesize
    },
    handleCurrentChange2(pagenum) {
      this.pageInfo2.pagenum2 = pagenum
    },
    submit() {
      console.log(this.classCodeValue)
      this.dialogVisible = false
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
