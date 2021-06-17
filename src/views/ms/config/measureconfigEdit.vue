<template>
  <div class="app-container calendar-list-container">
    <w-form v-bind="formConf" :col="3" :model="model">
      <!--<el-input v-model="model.eqpModelName" label="设备型号" />-->
      <w-lookup
        v-model="model.eqpModelId"
        :display.sync="model.eqpModelName"
        idkey="id"
        displaykey="classCode"
        label="设备型号名称"
        title="选择设备型号"
        module="views/fab/eqpmodel/eqpmodelLook"
      />
      <el-input v-model="model.productionNo" label="产品" />
      <!-- <el-input v-model="model.timing" label="时机" /> -->
      <w-select-dic v-model="model.timing" style="width: 100%" label="时机" dict="TIMING" />
      <el-input v-model="model.status" label="状态" />
      <el-input v-model="model.sampleCount" label="采样数" />
      <el-input v-model="model.fileFlag" label="采样文件" />
      <el-input v-model="model.imgFlag" label="采样图片" />
      <el-row col="24" />
      <el-input v-model="model.createByName" :disabled="true" label="创建人" />
      <el-input v-model="model.createDate" :disabled="true" label="创建日期" />
      <el-row col="24" />
      <el-input v-model="model.updateByName" :disabled="true" label="更新人" />
      <el-input v-model="model.updateDate" :disabled="true" label="更新日期" />
      <!--      <el-row col="24">-->
      <!--        <div class="filter-container">-->
      <!--          <el-button type="danger" mini>批量删除</el-button>-->
      <!--          <el-button type="primary" mini @click="newGrid">添加</el-button>-->
      <!--        </div>-->
      <!--        <el-table :data="model.detail" :row-class-name="tableRowClassName" style="width: 100%" highlight-current-row>-->
      <!--          <el-table-column fixed type="index" label="序号"/>-->
      <!--          <el-table-column label="paraName" prop="paraName">-->
      <!--            <template slot-scope="scope">-->
      <!--              <el-input v-model="scope.row.paraName"/>-->
      <!--            </template>-->
      <!--          </el-table-column>-->
      <!--          <el-table-column label="paraCode" prop="paraCode">-->
      <!--            <template slot-scope="scope">-->
      <!--              <el-input v-model="scope.row.paraCode"/>-->
      <!--            </template>-->
      <!--          </el-table-column>-->
      <!--          <el-table-column label="itemCode" prop="itemCode">-->
      <!--            <template slot-scope="scope">-->
      <!--              <el-input v-model="scope.row.itemCode"/>-->
      <!--            </template>-->
      <!--          </el-table-column>-->
      <!--          <el-table-column label="itemName" prop="itemName">-->
      <!--            <template slot-scope="scope">-->
      <!--              <el-input v-model="scope.row.itemName"/>-->
      <!--            </template>-->
      <!--          </el-table-column>-->
      <!--          <el-table-column label="limitMin" prop="limitMin">-->
      <!--            <template slot-scope="scope">-->
      <!--              <el-input v-model="scope.row.limitMin"/>-->
      <!--            </template>-->
      <!--          </el-table-column>-->
      <!--          <el-table-column label="limitMax" prop="limitMax">-->
      <!--            <template slot-scope="scope">-->
      <!--              <el-input v-model="scope.row.limitMax"/>-->
      <!--            </template>-->
      <!--          </el-table-column>-->
      <!--          <el-table-column label="sampleCount" prop="sampleCount">-->
      <!--            <template slot-scope="scope">-->
      <!--              <el-input v-model="scope.row.sampleCount"/>-->
      <!--            </template>-->
      <!--          </el-table-column>-->
      <!--          <el-table-column label="showType" prop="showType">-->
      <!--            <template slot-scope="scope">-->
      <!--              &lt;!&ndash;            <el-input v-model="scope.row.showType"/>&ndash;&gt;-->
      <!--              <el-select v-model="scope.row.showType" placeholder="请选择">-->
      <!--                <el-option-->
      <!--                  v-for="item in options"-->
      <!--                  :key="item.value"-->
      <!--                  :label="item.label"-->
      <!--                  :value="item.value"/>-->
      <!--              </el-select>-->
      <!--            </template>-->
      <!--          </el-table-column>-->
      <!--        </el-table>-->
      <!--      </el-row>-->
    </w-form>
    <div style="border-top: 1px solid #ddd; padding: 5px 0; margin: 10px 0" />
    <w-edt-table v-slot="{ row }" ref="language" v-bind="table" url="/ms/msmeasureconfig/">
      <w-table-col name="paraName" required label="paraName">
        <el-input v-model="table.model.paraName" />
      </w-table-col>
      <w-table-col name="paraCode" label="paraCode" align="left">
        <el-input v-model="table.model.paraCode" />
      </w-table-col>
      <w-table-col name="itemCode" label="itemCode" align="left">
        <el-input v-model="table.model.itemCode" />
      </w-table-col>
      <w-table-col name="itemName" label="itemName" align="left">
        <el-input v-model="table.model.itemName" />
      </w-table-col>
      <w-table-col name="limitMin" label="limitMin" align="left">
        <el-input v-model="table.model.limitMin" />
      </w-table-col>
      <w-table-col name="limitMax" label="limitMax" align="left">
        <el-input v-model="table.model.limitMax" />
      </w-table-col>
      <w-table-col name="sampleCount" label="sampleCount" align="left">
        <el-input v-model="table.model.sampleCount" />
      </w-table-col>
      <w-table-col name="showType" label="SHOW_TYPE" dict="SHOW_TYPE" align="left">
        <w-select-dic v-model="table.model.showType" style="width: 100%" label="状态" dict="SHOW_TYPE" />
      </w-table-col>
    </w-edt-table>
  </div>
</template>
<script>
export default {
  name: 'MachineModel',
  data() {
    return {
      type: 'View',
      model: {
        eqpModelName: '',
        productionNo: '',
        detail: [],
        timing: '',
        status: '',
        sampleCount: '',
        fileFlag: '',
        imgFlag: '',
        createByName: '',
        createDate: '',
        updateByName: '',
        updateDate: ''
      },
      table: {
        rules: {
          paraName: [{ required: true, message: '设备号必填', trigger: 'blur' }],
          paraCode: [{ required: true, message: '设备类型必填', trigger: ['blur', 'change'] }],
          itemCode: [{ required: true, message: '有效标志必选', trigger: 'change' }]
        },
        model: {
          paraName: '',
          paraCode: '',
          itemCode: '',
          itemName: '',
          limitMin: '',
          limitMax: '',
          showType: ''
        },
        datas: []
      },
      options: [
        { value: 'input', label: '单行' },
        { value: 'grid', label: '表格' }
      ],
      formConf: {
        url: '/ms/msmeasureconfig/',
        title: {
          ADD: '新增配置',
          EDIT: '修改配置',
          VIEW: '配置详情'
        },
        rules: {
          eqpModelName: [{ required: true, message: '设备类型必填', trigger: 'blur' }],
          productionNo: [{ required: true, message: '机种必填', trigger: ['blur', 'change'] }]
        },
        onLoadData: (m, type) => {
          console.log(m)
          this.table.datas = m.detail
        },
        beforeSubmit: (params, type) => {
          console.log('submit params->' + JSON.stringify(params))
          delete params['detail'] // 删除原数据模型里的多语言数组
          const lang = this.$refs.language.tranformData('detail') // 获取被转换格式的所有细表数据
          const re = { ...params, ...lang } // 合并细表数据
          return re // 返回新的数据模型
        }
      }
    }
  },
  created() {
    this.type = this.$route.query.type
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    newGrid() {
      const p = {
        paraName: '',
        paraCode: '',
        itemCode: '',
        itemName: '',
        limitMax: '',
        limitMin: '',
        limitType: '',
        sampleCount: ''
      }
      this.model.detail.push(p)
    }
  }
}
</script>
