<template>
  <div class="app-container calendar-list-container">

    <w-table v-slot="{row}" v-bind="table" url="/oa/oanotification" sort="create_date.desc" >
      <!--todo fixed属性导致当前列变为第一列-->
      <w-table-col name="subject" label="标题" align="left" handler="view" query condition="like"/>
      <w-table-col name="content" label="内容" width="400" align="left"/>
      <w-table-col name="createBy" label="创建人" width="300" align="left" />
      <w-table-col name="status" label="有效标志" width="150" align="center" dict="ACTIVE_FLAG" query condition="eq"/>
      <w-table-col name="createDate" label="创建时间" sort width="200" align="center" query querymode="date" condition="between"/>

      <w-table-toolbar name="add" url="views/fab/notice/indexEdit" />

    </w-table>

  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      table: {
      }
    }
  }
}
</script>

<style scoped>

</style>
