<template>
  <div class="fabeqpTemplate">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h2>设备模板</h2>
      </div>
      <el-row :getter="20">
        <el-col :span="4">
          <el-select v-model="value" placeholder="请选择项目">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-col>
        <el-col :span="4"> <el-input placeholder="请输入模板名称"/> </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getuser()">查询</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column label="日期" width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120"/>
        <el-table-column prop="address" label="地址" show-overflow-tooltip/>
      </el-table>
      <el-pagination
        :current-page="1"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="100"
        :total="10"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>
// import x from ''
export default {
  components: {},
  data() {
    return {
      tableData: [],
      options: [
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
      value: ''
    }
  },
  methods: {
    handleSelectionChange() {},
    handleSizeChange() {},
    handleCurrentChange() {},
    getuser() {}
  }
}
</script>

<style  scoped>
h2 {
  margin: 0;
}
.el-table {
  margin-top: 15px;
}
.el-input {
  width: 200px;
}
.fabeqpTemplate {
  width: 100%;
  height: calc(100vh - 83px);
}
.box-card {
  width: 75%;
  height: 60%;
  margin: 20px auto;
  position: relative;
}
.el-pagination {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
