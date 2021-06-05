<template>
  <div class="app-container calendar-list-container">
    <div class="search">
      <el-input v-model="manufacturerName" placeholder="设备厂家" style="width: 200px" />
      <el-select v-model="classCode" placeholder="设备类型">
        <el-option v-for="item in classCodeOptions" :key="item.id" :label="item.id" :value="item.id"/>
      </el-select>
      <el-select v-model="parentType" placeholder="设备大类">
        <el-option v-for="item in parentTypeOptions" :key="item.id" :label="item.id" :value="item.id"/>
      </el-select>
      <el-select v-model="type" placeholder="设备小类">
        <el-option v-for="item in typeOptions" :key="item.id" :label="item.id" :value="item.id"/>
      </el-select>
      <el-button type="primary" icon="el-icon-search">搜索</el-button>
      <el-button type="primary" icon="el-icon-circle-plus-outline">添加</el-button>
    </div>

    <el-table :data="tableData">
      <el-table-column type="selection" width="55"/>
      <el-table-column type="index" label="序号" width="55"/>
      <el-table-column prop="manufacturerName" label="厂家设备"/>
      <el-table-column prop="classCode" label="设备类型"/>
      <el-table-column prop="parentType" label="设备大类"/>
      <el-table-column prop="type" label="设备小类"/>
      <el-table-column prop="activeFlag" label="有效标志"/>
      <el-table-column prop="updateDate" sortable label="更新时间"/>
    </el-table>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  components: {},
  data() {
    return {}
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      return request({
        url: '/fab/fabequipmentmodel',
        methods: 'get'
      }).then((res) => {
        console.log(res)
      })
    }
  }
}
</script>

<style  scoped>
.search {
  display: flex;
  margin-bottom: 20px;
}
.el-input,
.el-select,
.el-button {
  margin-right: 20px;
}
</style>
