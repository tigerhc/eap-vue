<template>
  <div class="app-container calendar-list-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="设备参数列表" name="all">
        <w-table v-bind="table" url="" />
      </el-tab-pane>
      <el-tab-pane label="传感器绑定" name="sorsen">
        <w-form v-bind="formConf" :col="3" :model="model">
          <el-row :col="24" style="margin-bottom: 15px">
            <el-input v-model="model.classCode" placeholder="设备类型" style="width: 230px" disabled />
            <el-input v-model="model.name" placeholder="模板名称" style="width: 230px; margin-left: 15px" disabled />
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
          <div v-show="isShow" class="menu-two">
            <div
              v-for="(item1, index1) in sonType"
              :class="[num2 === index1 ? 'active' : '', 'menu-two-item']"
              :key="index1"
              @click="getIndex2(index1)"
            >
              {{ item1.treeValue }}
              <i class="el-icon-caret-right" />
            </div>
          </div>
          <div v-show="show" class="menu-three">
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
              :current-page="pageInfo.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="pageInfo.pagesize"
              :total="tableData.length"
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
              <el-input v-model="model.remarks" type="textarea" style="width: 400px" />
            </el-col>
          </el-row>
        </w-form>
      </el-tab-pane>
      <el-tab-pane label="设备自带参数列表" name="self">
        <w-edt-table v-bind="table1" url="" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { fetchDict } from '@/api/sys/dict.js'
import dateFormat from '@/utils/dateformat'
import request from '@/utils/request'
// import { Loading } from 'element-ui'

export default {
  components: {},
  data() {
    return {
      table: {},
      table1: {},
      activeName: 'all',
      isShow: false,
      show: false,
      showVisiable: false, // 控制显隐
      editIndex: -1, // 当前编辑行index
      pageInfo: {
        pagesize: 5,
        pagenum: 1
      },
      // 三级联动菜单初始数据源
      options: [
        // {
        //   delFlag: '0',
        //   treeModelList: [
        //     {
        //       delFlag: '0',
        //       treeModelList: [
        //         {
        //           delFlag: '0',
        //           treeNode: 'subClassCode',
        //           treeValue: '800ONM',
        //           num: '0'
        //         },
        //         {
        //           delFlag: '0',
        //           treeNode: 'subClassCode',
        //           treeValue: '111',
        //           num: '0'
        //         }
        //       ],
        //       treeNode: 'type',
        //       treeValue: '11'
        //     },
        //     {
        //       delFlag: '0',
        //       treeModelList: [
        //         {
        //           delFlag: '0',
        //           treeNode: 'subClassCode',
        //           treeValue: '1311432',
        //           num: '0'
        //         },
        //         {
        //           delFlag: '0',
        //           treeNode: 'subClassCode',
        //           treeValue: '1sdff11',
        //           num: '0'
        //         }
        //       ],
        //       treeNode: 'type',
        //       treeValue: 'asd'
        //     }
        //   ],
        //   treeNode: 'parentType',
        //   treeValue: '11'
        // },
        // {
        //   delFlag: '0',
        //   treeModelList: [
        //     {
        //       delFlag: '0',
        //       treeModelList: [
        //         {
        //           delFlag: '0',
        //           treeNode: 'subClassCode',
        //           treeValue: 'wdj',
        //           num: '0'
        //         }
        //       ],
        //       treeNode: 'type',
        //       treeValue: 'wdj2'
        //     }
        //   ],
        //   treeNode: 'parentType',
        //   treeValue: 'wdj1'
        // }
      ],
      // 二级菜单数据源
      sonType: [],
      num1: 0,
      num2: 0,
      // 表格数据源
      tableData: [],
      // 有效标志数据源
      activeFlagO: [],
      // 设备类型下拉框数据源
      classCodelOptions: [], // ////
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
      // 存储级联菜单选择的数据的对象
      selections: { parentType: '', type: '', subClassCode: '', id: '', num: '' },

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
          console.info(m, type)
          this.getInitializationData()
          this.getSelectedData()
          // if (m.officeIds) {
          //   m.officeIds = m.officeIds
          // }
          return m
        },
        beforeSubmit: (params, type) => {
          const re = { ...params }
          // console.log(re)
          // if (re.officeId) {
          //   re.officeId = re.officeIds[re.officeIds.length - 1]
          //   re.officeIds = undefined
          // }
          return re
        }
      }

      // arr: [
      //   { parentType: '11', type: '11', subClassCode: '111', id: '', num: '1' },
      //   { parentType: 'wdj1', type: 'wdj2', subClassCode: 'wdj', id: '', num: '1' }
      // ]
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

    // this.model.fabModelTemplateBodyList = this.arr
  },
  methods: {
    handleClick() {},
    getA() {
      const isCheck = (() => {
        const res = []
        this.tableData.forEach((item) => {
          this.model.fabModelTemplateBodyList.forEach((it) => {
            if (item.treeValue === it.subClassCode) {
              item.num = it.num
              res.push(item)
            }
          })
        })
        return res
      })()
      if (isCheck.length) {
        this.$nextTick(() => {
          this.toggleSelection(isCheck)
        })
      }
    },

    // 表格数据选中事件，如果选中将选中的数据添加到数组fabModelTemplateBodyList中，反之则删除改天数据
    change(rows, row) {
      // 判断选中状态 true 选中
      const selected = rows.length && rows.indexOf(row) !== -1
      if (selected) {
        if (parseInt(row.num) === 0) {
          row.num++
        }
        this.selections.subClassCode = row.treeValue
        this.selections.num = row.num
        this.selections.id = `${this.selections.parentType}${this.selections.type}${this.selections.subClassCode}`
        const sss = { ...this.selections }
        this.model.fabModelTemplateBodyList.push(sss)
        console.log(this.model.fabModelTemplateBodyList)
      } else {
        row.num--
        const id = row.treeValue
        this.model.fabModelTemplateBodyList.forEach((item, index) => {
          if (id === item.subClassCode) {
            this.model.fabModelTemplateBodyList.splice(index, 1)
          }
          console.log(this.model.fabModelTemplateBodyList)
        })
      }
    },
    // 一二级菜单来回切换，实现已勾选的数据还是勾选状态
    toggleSelection(rows) {
      if (rows && rows.length) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row, true)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 获取设备类型下拉框数据的函数
    getEqpModel() {
      return request({
        url: 'fab/fabequipmentmodel/noTemClassCodeList',
        method: 'get'
      }).then((res) => {
        this.classCodelOptions = res.data.results
      })
    },
    // 实现表格数量列可编辑
    editCurrRow(rowId, str) {
      this.editIndex = rowId // 不加editIndex,整个列都会一块变成可编辑
      this.showVisiable = true
      const id = rowId + str
      // 也可以用this.$nextTick，个人感觉加个0.01秒的延时比下次渲染灵活一点
      setTimeout(() => {
        document.getElementById(id).focus()
      }, 100)
    },

    handleSizeChange(pagesize) {
      this.pageInfo.pagesize = pagesize
    },
    handleCurrentChange(pagenum) {
      this.pageInfo.pagenum = pagenum
    },

    // 获取二级菜单数据
    getSubClassCode() {
      this.options.forEach((item, index) => {
        if (this.num1 === index) {
          this.sonType = item.treeModelList
        }
      })
    },
    // 获取三级菜单数据
    getTableDatas() {
      this.sonType.forEach((item, index) => {
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
      this.selections.parentType = this.options[idx].treeValue
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
      this.num2 = idx
      this.selections.type = this.sonType[idx].treeValue
      this.getTableDatas()
      this.show = true
      this.getA()
    },
    // 获取初始化数据
    getInitializationData() {
      return request({
        url: 'fab/fabModeltemplatebody/modelTemplateList/',
        method: 'get'
      }).then((res) => {
        this.options = res.data.results
      })
    },
    // 获取点击修改传过来的数据
    getSelectedData() {
      return request({
        url: `fab/fabModeltemplatebody/oneTemplateList/${this.model.id}`,
        method: 'get'
      }).then((res) => {
        this.model.fabModelTemplateBodyList = res.data.results
      })
    }
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
.el-tabs {
  width: 100%;
}
.el-tab-pane {
  width: 100%;
}
.menu {
  width: 100%;
  display: flex;
}
.menu-one,
.menu-two {
  height: 440px;
  overflow: hidden;
  overflow-y: auto;
  margin-bottom: 20px;
  border: 1px solid #eee;
}
.menu-three {
  height: 440px;
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
