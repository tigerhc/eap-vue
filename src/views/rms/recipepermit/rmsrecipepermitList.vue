<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" :datas="datas" url="rms/recipepermit/" sort="updateDate.desc, createDate.desc" >
      <!--todo fixed属性导致当前列变为第一列-->
      <w-table-col name="recipeCode" label="程序名称" sort fixed align="left" handler="view" query condition="like"/>
      <w-table-col name="eqpId" label="设备号" align="left" query condition="like" dict url="/fab/fabequipment/eqpIdlist"/>
      <w-table-col name="eqpModelName" label="设备类型" align="left" />
      <w-table-col name="eqpModelId" label="设备型号ID" hidden dict query url="/fab/fabequipmentmodel/list" namekey="modelName" condition="eq" filterable />
      <w-table-col name="versionType" label="程序等级" align="center" dict="RECIPE_VERSION_TYPE" query condition="eq" filterable />
      <w-table-col name="versionNo" label="程序版本号" align="center"/>
      <w-table-col name="status" label="状态" hidden dict="RECIPE_STATUS" query condition="eq" filterable />
      <w-table-col name="approveStep" label="审核状态" align="center" dict="RECIPE_APPROVE_STEP" query condition="eq" filterable />
      <w-table-col name="approveResult" label="审核结果" align="center" dict="RECIPE_APPROVE_RESULT" query condition="eq" filterable />
      <w-table-col name="createDate" label="创建时间" align="center"/>
      <w-table-col name="createByName" label="上传人" align="center" query condition="eq" />
      <w-table-col name="updateDate" label="更新时间" width="200" align="center" sort="1" query querymode="date" condition="between"/>

      <!--hidden属性: 隐藏默认button url: 修改默认url 没有url,则默认调用属性name值的方法-->
      <w-table-toolbar name="add" hidden url="views/rms/recipepermit/rmsrecipepermitView" />
      <w-table-toolbar hidden name="batchDelete" />

      <w-table-button hidden name="delete" />
      <w-table-button name="edit" label="升级" url="views/rms/recipepermit/rmsrecipepermitView" icon="el-icon-setting" />

    </w-table>

  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'RmsRecipePermitList',
  data() {
    return {
      table: {
      },
      datas: []
    }
  },
  created() {
    this.getDatas()
  },
  methods: {
    getDatas() {
      request({
        url: 'rms/rmsrecipe/recipePermitList',
        method: 'post'
      }).then((res) => {
        this.datas = res.data.results
      })
    }
  }
}
</script>
