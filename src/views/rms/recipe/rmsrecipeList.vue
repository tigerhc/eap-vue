<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="rms/rmsrecipe/" sort="updateDate.desc, createDate.desc" >
      <!--todo fixed属性导致当前列变为第一列-->
      <w-table-col name="recipeCode" label="程序名称" sort fixed align="left" handler="view" query condition="like"/>
      <w-table-col name="eqpCode" label="设备号" align="left" query condition="like" />
      <w-table-col name="eqpModelName" label="设备类型" align="left" />
      <w-table-col name="eqpModelId" label="设备型号ID" hidden dict query url="/fab/fabequipmentmodel/list" namekey="modelName" condition="eq" filterable />
      <w-table-col name="versionType" label="程序等级" align="center" dict="RECIPE_VERSION_TYPE" query condition="eq" filterable />
      <w-table-col name="versionNo" label="程序版本号" align="center"/>
      <w-table-col name="status" label="状态" hidden dict="RECIPE_STATUS" query condition="eq" filterable />
      <w-table-col name="approveStep" label="审核状态" align="center" dict="RECIPE_APPROVE_STEP" query condition="eq" filterable />
      <w-table-col name="approveResult" label="审核结果" align="center" dict="RECIPE_APPROVE_RESULT" query condition="eq" filterable />
      <w-table-col name="createDate" label="创建时间" align="center"/>
      <w-table-col name="createByName" label="上传人" align="center" query condition="eq" />
      <w-table-col name="versionNo" label="程序版本号" align="center"/>
      <w-table-col name="versionNo" label="程序版本号" align="center"/>
      <w-table-col name="updateDate" label="更新时间" width="200" align="center" sort="1" query querymode="date" condition="between"/>

      <!--hidden属性: 隐藏默认button url: 修改默认url 没有url,则默认调用属性name值的方法-->
      <w-table-toolbar name="add" hidden url="views/rms/recipe/rmsrecipeEdit" />
      <w-table-toolbar hidden name="batchDelete" />
      <w-table-button hidden name="edit" />
      <w-table-button hidden name="delete" />

      <!--<w-table-toolbar name="exportExcel" label="导出Excel" tip="你想干啥111？" icon="fa-download" type="success" />-->
      <w-table-toolbar name="uploadRecipe" label="上传recipe" type="primary" tip="上传recipe？" icon="el-icon-circle-plus-outline" />

    </w-table>

  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'RmsrecipeList',
  data() {
    return {
      table: {
      }
    }
  },
  methods: {
    // 弹出一个input框,输入后发送请求
    uploadRecipe(row, table, ctx) {
      request({
        url: 'rms/rmsrecipe/' + row.id + '/uploadrecipe',
        method: 'post'
      }).then(() => {
        ctx.refresh()
        this.$notify({
          title: '成功',
          message: '上传recipe成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
