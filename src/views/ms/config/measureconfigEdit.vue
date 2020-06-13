<template>
  <div>
<!--    <div class="add-footer">-->
<!--      <el-button @click="cancel">返回</el-button>-->
<!--      <el-button type="primary" @click="submit">保存</el-button>-->
<!--    </div>-->
    <w-form v-bind="formConf" :col="3" :model="model">
      <el-input v-model="model.eqpModelName" label="设备型号" />
      <el-input v-model="model.productionNo" label="机种" />
      <el-input v-model="model.timing" label="时机" />
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
      <el-row col="24">
        <el-table :data="model.detail" :row-class-name="tableRowClassName" style="width: 100%" highlight-current-row>
          <el-table-column fixed type="index" label="序号"/>
          <el-table-column label="paraName" prop="paraName">
            <template slot-scope="scope">
              <el-input v-model="scope.row.paraName"/>
            </template>
          </el-table-column>
          <el-table-column label="paraCode" prop="paraCode">
            <template slot-scope="scope">
              <el-input v-model="scope.row.paraCode"/>
            </template>
          </el-table-column>
          <el-table-column label="itemCode" prop="itemCode">
            <template slot-scope="scope">
              <el-input v-model="scope.row.itemCode"/>
            </template>
          </el-table-column>
          <el-table-column label="itemName" prop="itemName">
            <template slot-scope="scope">
              <el-input v-model="scope.row.itemName"/>
            </template>
          </el-table-column>
          <el-table-column label="limitMin" prop="limitMin">
            <template slot-scope="scope">
              <el-input v-model="scope.row.limitMin"/>
            </template>
          </el-table-column>
          <el-table-column label="limitMax" prop="limitMax">
            <template slot-scope="scope">
              <el-input v-model="scope.row.limitMax"/>
            </template>
          </el-table-column>
          <el-table-column label="sampleCount" prop="sampleCount">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sampleCount"/>
            </template>
          </el-table-column>
          <el-table-column label="showType" prop="showType">
            <template slot-scope="scope">
              <!--            <el-input v-model="scope.row.showType"/>-->
              <el-select v-model="scope.row.showType" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
        <el-button v-if="type=='EDIT'" type="primary" style="margin-top: 10px;" @click="newGrid">添加</el-button>
      </el-row>
    </w-form>
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
      options: [
        { 'value': 'input', 'label': '单行' },
        { 'value': 'grid', 'label': '表格' }
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

        },
        beforeSubmit: (params, type) => {
          console.log('submit params->' + JSON.stringify(params))
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
      const p = { paraName: '', paraCode: '', itemCode: '', itemName: '', limitMax: '', limitMin: '', limitType: '', sampleCount: '' }
      this.model.detail.push(p)
    }
  }
}
</script>
