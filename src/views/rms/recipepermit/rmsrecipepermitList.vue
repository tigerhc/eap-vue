<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" :datas="datas" url="rms/recipepermit/" sort="approveStep.desc, updateDate.desc" >
      <!--todo fixed属性导致当前列变为第一列-->
      <w-table-col name="recipeCode" label="程序名称" sort fixed align="center" handler="edit" query condition="like"/>
      <w-table-col name="eqpId" label="设备号" align="center" query condition="like" dict url="/fab/fabequipment/eqpIdlist"/>
      <w-table-col name="eqpModelName" label="设备类型" align="center" />
      <w-table-col name="eqpModelId" label="设备型号ID" hidden dict url="/fab/fabequipmentmodel/list" namekey="modelName" condition="eq" filterable />
      <w-table-col name="versionType" label="程序等级" align="center" dict="RECIPE_VERSION_TYPE" query condition="eq" filterable />
      <w-table-col name="versionNo" label="程序版本号" align="center"/>
      <w-table-col name="status" label="状态" hidden dict="RECIPE_STATUS" condition="eq" filterable />
      <w-table-col name="approveStep" label="审核状态" align="center" dict="RECIPE_APPROVE_STEP" condition="eq" filterable />
      <w-table-col name="approveResult" label="审核结果" align="center" dict="RECIPE_APPROVE_RESULT" condition="eq" filterable foldcolor/>
      <w-table-col name="createDate" label="创建时间" width="200" align="center"/>
      <w-table-col name="createByName" label="上传人" align="center" condition="eq" />
      <w-table-col name="updateDate" label="更新时间" width="200" align="center" sort="1" query querymode="date" condition="between"/>

      <!--hidden属性: 隐藏默认button url: 修改默认url 没有url,则默认调用属性name值的方法-->
      <w-table-toolbar name="search"/>
      <w-table-toolbar name="add" hidden />
      <w-table-toolbar hidden name="batchDelete" />
      <w-table-toolbar name="exports" hidden />

      <w-table-button hidden name="delete" />
      <w-table-button name="edit" label="升级" url="views/rms/recipepermit/rmsrecipepermitEdit" icon="el-icon-setting" />

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
      datas: [],
      params: {
        eqpId: '',
        recipeCode: '',
        startDate: '',
        endDate: '',
        versionType: ''
      }
    }
  },
  watch: {
    '$route'(to, from) {
      this.getDatas()
    }
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    getDatas() {
      request({
        url: 'rms/rmsrecipe/recipePermitList',
        method: 'post',
        data: this.params
      }).then((res) => {
        this.datas = res.data.results
      })
    },
    query(param) {
      const eqpId = `query.eqpId||like`
      const recipeCode = `query.recipeCode||like`
      const updateDate = `query.updateDate||between`
      const versionType = `query.versionType||eq`
      if (param[eqpId]) {
        this.params.eqpId = param[eqpId]
      }
      if (param[recipeCode]) {
        this.params.recipeCode = param[recipeCode]
      }
      if (param[updateDate]) {
        this.params.startDate = param[updateDate][0]
        this.params.endDate = param[updateDate][1]
      }
      if (param[versionType]) {
        this.params.versionType = param[versionType]
      }
      console.log(this.params)
      this.getDatas()
    }
  }
}
</script>
