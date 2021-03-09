<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{row}" v-bind="table" url="rms/rmsrecipe/" sort="updateDate.desc, createDate.desc" >
      <!--todo fixed属性导致当前列变为第一列-->
      <w-table-col name="recipeCode" label="程序名称" width="130" sort fixed align="left" handler="view" query condition="like"/>
      <w-table-col name="eqpId" label="设备号" width="150" sort fixed align="center" query dict multiple eqp condition="in"/>
      <w-table-col name="eqpModelName" width="200" label="设备类型" align="center" />
      <w-table-col name="eqpModelId" label="设备型号ID" hidden dict query url="/fab/fabequipmentmodel/list" namekey="modelName" condition="eq" filterable />
      <w-table-col name="versionType" label="程序等级" align="center" dict="RECIPE_VERSION_TYPE" query hiddenquery condition="eq" filterable />
      <w-table-col name="versionNo" label="版本号" align="center"/>
      <w-table-col name="status" label="状态" dict="RECIPE_STATUS" query hiddenquery condition="eq" filterable />
      <w-table-col name="approveStep" label="审核状态" width="100" align="center" dict="RECIPE_APPROVE_STEP" query hiddenquery condition="eq" filterable />
      <w-table-col name="approveResult" label="审核结果" width="100" align="center" dict="RECIPE_APPROVE_RESULT" query hiddenquery condition="eq" filterable foldcolor/>
      <w-table-col name="createDate" label="创建时间" width="180" align="center"/>
      <w-table-col name="createByName" label="上传人" align="center" query hiddenquery condition="eq" />
      <!--<w-table-col name="versionNo" label="程序版本号" align="center"/>-->
      <!--<w-table-col name="versionNo" label="程序版本号" align="center"/>-->
      <w-table-col name="updateDate" label="更新时间" width="180" align="center" sort="1" query querymode="date" condition="between"/>

      <!--hidden属性: 隐藏默认button url: 修改默认url 没有url,则默认调用属性name值的方法-->
      <w-table-toolbar name="add" hidden url="views/rms/recipe/rmsrecipeEdit" />
      <w-table-toolbar hidden name="batchDelete" />

      <w-table-button hidden name="delete" />

      <!--<w-table-toolbar name="exportExcel" label="导出Excel" tip="你想干啥111？" icon="fa-download" type="success" />-->
<!--      <w-table-toolbar name="uploadRecipe" label="上传recipe" type="primary" tip="上传recipe？" icon="el-icon-circle-plus-outline" />-->
<!--      <w-table-toolbar name="downloadRecipe" label="下载recipe" type="primary" tip="下载recipe？" icon="fa-download" />-->
      <w-table-toolbar name="uploadRecipe" label="上传recipe" type="primary" icon="el-icon-circle-plus-outline" />
      <w-table-button name="edit" label="升级" url="views/rms/recipe/rmsrecipeEdit" icon="el-icon-setting" />
      <w-table-button v-if="row.approveStep === 0 && row.status !== 'Y'" name="enable" label="启用" tip="确认启用？" icon="el-icon-bell" />
      <w-table-button v-if="row.status === 'Y'" name="diable" label="停用" tip="确认停用？" icon="el-icon-circle-close" type="warning" />

    </w-table>

    <el-dialog :visible.sync="dialogFormUploadRecipeVisible" :close-on-click-modal="false" title="上传recipe" style="width: 45%; margin: auto">
      <!--<el-form ref="dataModifyForm" :rules="modifyPasswordRules" :model="modifyPassword" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">-->
      <el-form ref="dataModifyForm" :model="uploadRecipe1" label-position="left" label-width="60px" style="width: 400px">
        <el-form-item label="设备号" prop="eqpId">
          <w-select-eqp v-model="uploadRecipe1.eqpId" :multiple="false" param="filter" style="width:300px"/>
        </el-form-item>
<!--        <el-form-item label="程序名称" prop="recipeName">-->
<!--          <el-input v-model="uploadRecipe1.recipeName"/>-->
<!--          <el-select-->
<!--            v-model="uploadRecipe1.recipeList"-->
<!--            multiple-->
<!--            collapse-tags-->
<!--            filterable-->
<!--            style="width:400px;"-->
<!--            placeholder="请选择">-->
<!--            <el-option-->
<!--              v-for="item in allRecipeList"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value"/>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormUploadRecipeVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="getRecipeList">查询recipe列表</el-button>
<!--        <el-button type="primary" @click="doUploadRecipe">{{ $t('table.confirm') }}</el-button>-->
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogFormRecipeList" :close-on-click-modal="false" title="配方列表" style="width: 45%; margin: auto">
      <div class="filter-container">
        <el-input v-model="searchValue" placeholder="配方名称" class="filter-item" style="width: 200px;" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">{{ $t('table.search') }}</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="searchRecipeList"
        tooltip-effect="dark"
        style="width: 100%"
        height="350"
        border
        fit
        @selection-change="selectionChange">
        <el-table-column type="selection" width="39"/>
        <el-table-column align="center" label="配方名称">
          <template slot-scope="scope">
            <span>{{ scope.row }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormRecipeList = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="doUploadRecipe">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogFormDownloadRecipeVisible" :close-on-click-modal="false" title="下载recipe">
      <!--<el-form ref="dataModifyForm" :rules="modifyPasswordRules" :model="modifyPassword" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">-->
      <el-form ref="dataModifyForm" :model="downloadRecipe1" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="设备号" prop="eqpId">
          <w-select-eqp v-model="downloadRecipe1.eqpId" :multiple="false" param="filter" style="width:300px" />
        </el-form-item>
        <el-form-item label="程序名称" prop="recipeName">
          <el-input v-model="downloadRecipe1.recipeName"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormDownloadRecipeVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="doDownloadRecipe">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import request from '@/utils/request'
import WSelectEqp from '../../../components/eap-select-eqp/index'
import WTable from '../../../components/eap-table/index'
export default {
  name: 'RmsrecipeList',
  components: { WTable, WSelectEqp },
  data() {
    return {
      table: {
      },
      dialogFormUploadRecipeVisible: false,
      uploadRecipe1: {
        eqpId: '',
        recipeList: []
      },
      dialogFormDownloadRecipeVisible: false,
      downloadRecipe1: {
        eqpId: '',
        recipeName: ''
      },
      dialogFormRecipeList: false,
      eqpIdSel: '',
      eqpIdList: [],
      searchRecipeList: [],
      allRecipeList: [],
      searchValue: ''
    }
  },
  watch: {
    'uploadRecipe1.eqpId': function(val) {
      this.eqpIdSel = val
    }
  },
  created() {
    this.getEqpIdList()
  },
  methods: {
    enable(row, table, ctx) {
      request({
        url: '/rms/rmsrecipe/status/' + row.id + '/Y',
        method: 'put'
      }).then(() => {
        ctx.refresh()
        this.$notify({
          title: '成功',
          message: '已启用',
          type: 'success',
          duration: 2000
        })
      })
    },
    diable(row, table, ctx) {
      request({
        url: '/rms/rmsrecipe/status/' + row.id + '/N',
        method: 'put'
      }).then(() => {
        ctx.refresh()
        this.$notify({
          title: '成功',
          message: '已禁用',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 弹出一个input框,输入后发送请求
    uploadRecipe(row, table, ctx) {
      this.dialogFormUploadRecipeVisible = true
    },
    downloadRecipe(row, table, ctx) {
      this.dialogFormDownloadRecipeVisible = true
    },

    doUploadRecipe(row, table, ctx) {
      var oary = this.uploadRecipe1.recipeList
      if (!oary) {
        return
      }
      var recipe = ''
      for (var i = 0; i < oary.length; i++) {
        recipe = recipe + '@' + oary[i]
      }
      request({
        url: 'rms2/rmsrecipe/uploadrecipe',
        method: 'post',
        params: {
          eqpId: this.uploadRecipe1.eqpId,
          recipeList: recipe
        }
      }).then((res) => {
        if (res.data.code === 0) {
          this.$notify({
            title: '成功',
            message: '上传recipe成功',
            type: 'success',
            duration: 2000
          })
          this.dialogFormRecipeList = false
          this.dialogFormUploadRecipeVisible = false
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    doDownloadRecipe(row, table, ctx) {
      request({
        url: 'rms/rmsrecipe/downloadrecipe',
        method: 'post',
        params: this.downloadRecipe1
      }).then((res) => {
        if (res.data.code === 0) {
          this.$notify({
            title: '成功',
            message: '下载recipe成功',
            type: 'success',
            duration: 2000
          })
          this.dialogFormDownloadRecipeVisible = false
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    // 升级
    upgrade() {
      // debugger
    },
    // 获取设备号下拉框
    getEqpIdList() {
      request({
        url: '/fab/fabequipment/eqpIdlist',
        method: 'get',
        params: ''
      }).then((res) => {
        this.eqpIdList = res.data.results
      })
    },
    // 查询recipe列表
    getRecipeList() {
      if (this.eqpIdSel === '') {
        this.$notify({
          title: '失败',
          message: '请先选择设备',
          type: 'error',
          duration: 2000
        })
      } else {
        request({
          url: '/rms2/rmsrecipe/getRecipeList',
          method: 'get',
          params: {
            eqpId: this.eqpIdSel
          }
        }).then((res) => {
          if (res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '查询recipe成功',
              type: 'success',
              duration: 2000
            })
            const oary = res.data.results
            if (!oary) {
              return
            }
            this.allRecipeList = []
            this.searchRecipeList = []
            for (let i = 0; i < oary.length; i++) {
              this.allRecipeList.push(oary[i])
              this.searchRecipeList.push(oary[i])
            }
            this.dialogFormRecipeList = true
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
          }
        })
      }
    },
    // 选中
    selectionChange: function(val) {
      this.uploadRecipe1.recipeList = val
    },
    // 查询
    handleSearch: function() {
      this.searchRecipeList = []
      if (this.searchValue === '') {
        for (let i = 0; i < this.allRecipeList.length; i++) {
          this.searchRecipeList.push(this.allRecipeList[i])
        }
      } else {
        for (let i = 0; i < this.allRecipeList.length; i++) {
          if (this.allRecipeList[i].indexOf(this.searchValue) !== -1) {
            this.searchRecipeList.push(this.allRecipeList[i])
          }
        }
      }
    }
  }
}
</script>
