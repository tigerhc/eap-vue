<template>
  <div class="app-container calendar-list-container">
    <div class="search">
      <el-input v-model="model.id" placeholder="工单号" />
      <el-select v-model="model.eqpId" placeholder="设备编号">
        <el-option v-for="item in eqpIdOptions" :key="item.id" :label="item.id" :value="item.id"/>
      </el-select>
      <el-date-picker
        v-model="model.assignedTime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
      <el-button type="primary" @click="search()">搜索</el-button>
    </div>
  </div>
</template>

<script>
// import x from ''
export default {
  components: {},
  data() {
    return {
      eqpIdOptions: [],
      model: {
        id: '',
        eqpId: '',
        assignedTime: ''
      }
    }
  },

  mounted() {},
  methods: {
    search() {
      console.log(this.model.assignedTime)
      console.log(this.model.id)
    }
  }
}
</script>

<style  scoped>
</style>
