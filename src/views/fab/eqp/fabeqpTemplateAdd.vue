<template>
  <w-form v-bind="formConf" :col="3" :model="model">
    <el-input v-model="model.fabModelTemplateBodyList" style="display: none"/>
    <el-row :col="24" style="margin-bottom: 15px">
      <el-select v-model="model.classCode" placeholder="设备类型">
        <el-option v-for="item in eqpModelOptions" :key="item.id" :label="item.id" :value="item.id" />
      </el-select>
      <el-input v-model="model.name" placeholder="模板名称" />
    </el-row>
    <div class="menu-one">
      <div
        v-for="(item, index) in options"
        :class="[num1 === index ? 'active' : '', 'menu-one-item']"
        :key="index"
        @click="getIndex1(index)"
      >
        {{ item.treeValue }}
        <i class="el-icon-caret-right" />
      </div>
    </div>
    <div v-if="isShow" class="menu-two">
      <div
        v-for="(item1, index1) in obj1"
        :class="[num2 === index1 ? 'active' : '', 'menu-two-item']"
        :key="index1"
        @click="getIndex2(index1)"
      >
        {{ item1.treeValue }}
        <i class="el-icon-caret-right" />
      </div>
    </div>
    <div v-if="show" class="menu-three">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @select="change">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="treeValue" label="名称/型号" />
        <el-table-column prop="num" label="数量" @click="editRow(row)">
          <template slot-scope="scope">
            <span
              v-show="!showVisiable || editIndex != scope.$index"
              class="editCell"
              style="width: 120px"
              @click="editCurrRow(scope.$index, 'rowkeY')"
              >{{ scope.row.num }}</span
            >
            <el-input
              v-show="showVisiable && editIndex == scope.$index"
              :id="scope.$index + 'rowkeY'"
              v-model="scope.row.num"
              size="mini"
              style="width: 120px"
              @blur="showVisiable = false"
            />
          </template>
        </el-table-column>
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
    </div>
    <el-row :col="24" style="margin-bottom: 15px">
      <el-col :span="8">
        <label>创建人：</label>
        <el-input v-model="model.createBy" :disabled="true" />
      </el-col>
      <el-col :span="8">
        <label>创建日期：</label>
        <el-input v-model="model.createDate" :disabled="true" />
      </el-col>
      <el-col :span="8">
        <label>有效标志：</label>
        <el-select v-model="model.activeFlag" placeholder="请选择有效标志">
          <el-option v-for="item in activeFlagO" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-col>
    </el-row>
    <el-row :col="24">
      <el-col :span="8">
        <label>修改人：</label>
        <el-input v-model="model.updateBy" :disabled="true" />
      </el-col>
      <el-col :span="8">
        <label>修改日期：</label>
        <el-input v-model="model.updateDate" :disabled="true" />
      </el-col>
      <el-col :span="8">
        <label>备注：</label>
        <el-input v-model="model.remarks" />
      </el-col>
    </el-row>
  </w-form>
</template>
<script>
import { fetchDict } from '@/api/sys/dict.js'
import { create } from '@/api/sys/data.js'
import dateFormat from '@/utils/dateformat'
import request from '@/utils/request'
// import { Loading } from 'element-ui'

export default {
  components: {},
  data() {
    return {
      isShow: false,
      show: false,
      showVisiable: false, // 控制显隐
      editIndex: -1, // 当前编辑行index
      pageInfo: {
        total: 0
      },
      value: '',
      options: [
        {
          delFlag: '0',
          treeModelList: [
            {
              delFlag: '0',
              treeModelList: [
                {
                  delFlag: '0',
                  treeNode: 'subClassCode',
                  treeValue: '800ONM',
                  num: '0'
                },
                {
                  delFlag: '0',
                  treeNode: 'subClassCode',
                  treeValue: '111',
                  num: '0'
                }
              ],
              treeNode: 'type',
              treeValue: '11'
            },
            {
              delFlag: '0',
              treeModelList: [
                {
                  delFlag: '0',
                  treeNode: 'subClassCode',
                  treeValue: '1311432',
                  num: '0'
                },
                {
                  delFlag: '0',
                  treeNode: 'subClassCode',
                  treeValue: '1sdff11',
                  num: '0'
                }
              ],
              treeNode: 'type',
              treeValue: 'asd'
            }
          ],
          treeNode: 'parentType',
          treeValue: '11'
        },
        {
          delFlag: '0',
          treeModelList: [
            {
              delFlag: '0',
              treeModelList: [
                {
                  delFlag: '0',
                  treeNode: 'subClassCode',
                  treeValue: 'wdj',
                  num: '0'
                }
              ],
              treeNode: 'type',
              treeValue: 'wdj2'
            }
          ],
          treeNode: 'parentType',
          treeValue: 'wdj1'
        }
      ],
      obj1: [],
      num1: 0,
      num2: 0,
      tableData: [],
      activeFlagO: [],
      eqpModelOptions: [], // ////
      model: {
        id: '',
        manufacturerName: '',
        updateBy: '',
        classCode: '',
        name: '',
        activeFlag: 'Y',
        remarks: '',
        delFlag: '',
        updateDate: '',
        createDate: '',
        createBy: '',
        officeId: '',
        fabModelTemplateBodyList: []
      },
      obj: { parentType: '', type: '', subClassCode: '', id: '' },

      formConf: {
        url: 'fab/fabModeltemplate',
        title: {
          ADD: '新增设备',
          EDIT: '修改设备',
          VIEW: '设备详情'
        },
        rules: {
          eqpId: [{ required: true, message: '设备号必填', trigger: 'blur' }],
          modelName: [{ required: true, message: '设备类型必填', trigger: ['blur', 'change'] }],
          activeFlag: [{ required: true, message: '有效标志必选', trigger: 'change' }]
        },
        onLoadData: (m, type) => {
          console.info(m)
          if (m.officeIds) {
            m.officeIdsm.officeIds
          }
          return m
        },
        beforeSubmit: (params, type) => {
          const re = { ...params }
          if (re.officeId) {
            re.officeId = re.officeIds[re.officeIds.length - 1]
            re.officeIds = undefined
          }
          return re
        }
      }
    }
  },
  mounted() {
    this.getSubClassCode()
    this.getTableDatas()
    this.getEqpModel()
    fetchDict('ACTIVE_FLAG').then((res) => {
      this.activeFlagO = res.data
    })
    this.model.createBy = this.$store.getters.roles[0]
    this.model.createDate = dateFormat(new Date())
    this.model.updateBy = this.$store.getters.roles[0]
    this.model.updateDate = dateFormat(new Date())
    this.getAb()
    // this.getBb()
  },
  methods: {
    submit() {
      create(this.model).then((res) => {
        console.log(res)
      })
    },

    change(rows, row) {
      const selected = rows.length && rows.indexOf(row) !== -1
      if (selected) {
        this.obj.subClassCode = row.treeValue
        this.obj.id = `${this.obj.parentType}${this.obj.type}${this.obj.subClassCode}`
        const sss = { ...this.obj }
        this.model.fabModelTemplateBodyList.push(sss)
      } else {
        const id = row.treeValue
        this.model.fabModelTemplateBodyList.forEach((item, index) => {
          if (id === item.subClassCode) {
            this.model.fabModelTemplateBodyList.splice(index, 1)
          }
        })
      }
    },
    toggleSelection(rows) {
      const _this = this
      if (rows && rows.length) {
        rows.forEach((row) => {
          setTimeout(function() {
            _this.$refs.multipleTable.toggleRowSelection(row)
          }, 500)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    getEqpModel() {
      return request({
        url: 'fab/fabequipmentmodel/noTemClassCodeList',
        method: 'get'
      }).then((res) => {
        this.eqpModelOptions = res.data.results
      })
    },
    editCurrRow(rowId, str) {
      this.editIndex = rowId // 不加editIndex,整个列都会一块变成可编辑
      this.showVisiable = true
      const id = rowId + str
      // 也可以用this.$nextTick，个人感觉加个0.01秒的延时比下次渲染灵活一点
      setTimeout(() => {
        document.getElementById(id).focus()
      }, 100)
    },

    handleSizeChange() {},
    handleCurrentChange() {},

    // 获取一级菜单数据
    getSubClassCode() {
      this.options.forEach((item, index) => {
        if (this.num1 === index) {
          this.obj1 = item.treeModelList
        }
      })
    },
    // 获取三级菜单数据
    getTableDatas() {
      this.obj1.forEach((item, index) => {
        if (this.num2 === index) {
          this.tableData = item.treeModelList
        }
      })
    },
    // // 一级菜单点击时间
    getIndex1(idx) {
      this.isShow = true
      this.show = false
      this.num1 = idx
      this.num2 = 0
      this.obj.parentType = this.options[idx].treeValue
      this.getSubClassCode()
      this.getTableDatas()
      const isCheckList = (() => {
        const res = []
        this.tableData.forEach((item) => {
          if (this.model.fabModelTemplateBodyList.length) {
            this.model.fabModelTemplateBodyList.forEach((it) => {
              if (item.treeValue === it.subClassCode) {
                res.push(item)
              }
            })
          }
        })
        return res
      })()
      if (isCheckList.length) {
        this.$nextTick(() => {
          this.toggleSelection(isCheckList)
        })
      }
    },
    // 二级菜单点击时间
    getIndex2(idx) {
      this.show = true
      this.num2 = idx
      this.obj.type = this.obj1[idx].treeValue
      this.getTableDatas()

      const isCheckList = (() => {
        const res = []
        this.tableData.forEach((item) => {
          if (this.model.fabModelTemplateBodyList.length) {
            this.model.fabModelTemplateBodyList.forEach((it) => {
              if (item.treeValue === it.subClassCode) {
                res.push(item)
              }
            })
          }
        })
        return res
      })()
      if (isCheckList.length) {
        this.$nextTick(() => {
          this.toggleSelection(isCheckList)
        })
      }
    },

    getAb() {
      return request({
        url: 'fab/fabModeltemplatebody/modelTemplateList/',
        method: 'get'
      }).then((res) => {
        this.options = res.data.results
      })
    }
    // getBb() {
    //   return request({
    //     url: 'fab/fabModeltemplatebody/oneTemplateList/{modelId}"',
    //     method: 'get'
    //   }).then((res) => {
    //     console.log('单')
    //     console.log(res)
    //   })
    // }
  }
}
</script>

<style  scoped lang="scss">
* {
  box-sizing: border-box;
}

/deep/ .el-table__header-wrapper .el-checkbox {
  display: none;
}

.el-input {
  width: 400px;
}
.editCell:hover {
  cursor: pointer;
}
.el-table {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
.active {
  color: #3c78ff;
  background-color: #ebeef5;
  border-left: 3px solid #3c78ff;
}
.menu {
  display: flex;
}
.menu-one,
.menu-two {
  height: 500px;

  overflow: hidden;
  overflow-y: auto;
  margin-bottom: 20px;
  border: 1px solid #eee;
}
.menu-three {
  height: 500px;
  position: relative;
  border: 1px solid #eee;
  margin-bottom: 20px;
}
.menu-one-item,
.menu-two-item {
  width: 100%;
  height: 50px;
  text-align: center;
  line-height: 50px;
  border-top: 1px solid #eee;
  border-right: 1px solid #eee;
  border-bottom: 1px solid #eee;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 35px;
}
.el-pagination {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
