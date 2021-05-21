<template>
  <div class="app">
    <el-card>
      <div slot="header" class="clearfix">
        <span>设备绑定</span>
      </div>
      <el-row>
        <el-select v-model="eqpModeV" placeholder="请选择设备类型">
          <el-option v-for="item in eqpMode0ptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" style="margin-left: 15px">查询</el-button>
      </el-row>
      <el-row>
        <el-table
          :data="eqpTemplateDatas"
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
        <el-pagination
          :current-page="pageInfo1.pagenum1"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageInfo1.pagesize1"
          :total="0"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
        />
      </el-row>

      <el-row>
        <el-table
          :data="eqpTemplateBindDatas"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
          style="width: 100%"
          border
        >
          <el-table-column prop="name" label="模板名称" />
          <el-table-column prop="office_id" label="部门ID" />
          <el-table-column prop="class_code" label="子设备类型" />
          <el-table-column prop="record_id" label="记录ID" />
          <el-table-column label="操作" />
        </el-table>
        <el-pagination
          :current-page="pageInfo2.pagenum2"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageInfo2.pagesize2"
          :total="0"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
        />
      </el-row>
    </el-card>
  </div>
</template>

<script>
// import x from ''
export default {
  components: {},
  data() {
    return {
      pageInfo1: {
        query: '',
        pagenum1: 1,
        pagesize1: 5
      },
      pageInfo2: {
        query: '',
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
      eqpTemplateBindDatas: []
    }
  },
  methods: {
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
