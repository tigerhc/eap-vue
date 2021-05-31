<template>
  <div class="app">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>设备模板</span>
      </div>
      <el-row :gutter="15">
        <el-col :span="3">
          <el-input v-model="modelName" type=" text" placeholder="模板名称" />
        </el-col>
        <el-col :span="3">
          <el-select v-model="sensorValue" multiple filterable allow-create default-first-option placeholder="传感器">
            <el-option v-for="item in sensorOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="numTypeValue"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="示数类型"
          >
            <el-option v-for="item in numTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="parentTypeValue"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="主设备类型"
          >
            <el-option v-for="item in parentTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search">搜索</el-button>
        </el-col>
        <el-col :span="1">
          <el-button type="success" icon="el-icon-circle-plus-outline" @click="addTemplate()">添加</el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="isLoading"
        :data="
          templateData.slice((pageInfo1.pagenum1 - 1) * pageInfo1.pagesize1, pageInfo1.pagenum1 * pageInfo1.pagesize1)
        "
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
        border
        style="width: 100%; margin-top: 15px"
      >
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="name" label="模板名称" />
        <el-table-column prop="sensor" label="传感器" />
        <el-table-column prop="num_type" label="示数类型" />
        <el-table-column prop="collect_type" label="采集方式" />
        <el-table-column label="操作">
          <el-button type="primary" icon="el-icon-edit" circle @click="editTemplate()" />
          <el-button type="danger" icon="el-icon-delete" circle />
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageInfo1.pagenum1"
        :page-sizes="[10, 15, 30, 50]"
        :page-size="pageInfo1.pagesize1"
        :total="templateData.length"
        layout="total, sizes,prev, pager, next, jumper"
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
      />
      <!----- 弹窗 ------->
      <div class="dialog">
        <el-dialog :visible.sync="addDialogVisible" title="添加模板" width="80%">
          <el-select v-model="eqpModelValue" placeholder="设备类型">
            <el-option v-for="item in eqpModelOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
          <div class="container">
            <div class="menu-one">
              <div
                v-for="(item, index) in options"
                :class="[num1 === index ? 'active' : '', 'menu-one-item']"
                :key="index"
                @click="getIndex1(index)"
              >
                {{ item.label }}
                <i class="el-icon-caret-right" />
              </div>
            </div>
            <div class="menu-two">
              <div
                v-for="(item1, index1) in obj1"
                :class="[num2 === index1 ? 'active' : '', 'menu-two-item']"
                :key="index1"
                @click="getIndex2(index1)"
              >
                {{ item1.label }}
                <i class="el-icon-caret-right" />
              </div>
            </div>
            <div class="menu-three">
              <el-table
                v-loading="editLoading"
                ref="multipleTable1"
                :data="
                  obj2.slice((pageInfo2.pagenum2 - 1) * pageInfo2.pagesize2, pageInfo2.pagenum2 * pageInfo2.pagesize2)
                "
                tooltip-effect="dark"
                style="width: 100%"
                @row-click="rowClick"
              >
                <el-table-column label width="50">
                  <template slot-scope="scope">
                    <el-radio :label="scope.row.eqpmodel" v-model="radioId">&nbsp;</el-radio>
                  </template>
                </el-table-column>
                <el-table-column prop="eqpmodel" label="名称/型号" />
                <el-table-column prop="brand" label="厂商" width="120" />
                <el-table-column prop="acqmode" label="数量">
                  <!-- <template slot-scope="scope">
                    <el-input
                      size="small"
                      :disabled="item.disabled || disabled"
                      v-model="scope.row[item.name]"
                      placeholder="请输入内容"
                      @change="handleEdit(scope.$index, scope.row)"
                    />
                    <span>{{ scope.row[item.name] }}</span>
                  </template> -->
                </el-table-column>
              </el-table>
              <el-pagination
                :current-page="pageInfo3.pagenum3"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageInfo3.pagesize3"
                :total="obj2.length"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange3"
                @current-change="handleCurrentChange3"
              />
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog :visible.sync="editDialogVisible" title="修改模板" width="80%">
          <div class="container">
            <div class="menu-one">
              <div
                v-for="(item, index) in options"
                :class="[num1 === index ? 'active' : '', 'menu-one-item']"
                :key="index"
                @click="getIndex1(index)"
              >
                {{ item.label }}
                <i class="el-icon-caret-right" />
              </div>
            </div>
            <div class="menu-two">
              <div
                v-for="(item1, index1) in obj1"
                :class="[num2 === index1 ? 'active' : '', 'menu-two-item']"
                :key="index1"
                @click="getIndex2(index1)"
              >
                {{ item1.label }}
                <i class="el-icon-caret-right" />
              </div>
            </div>
            <div class="menu-three">
              <el-table
                v-loading="editLoading"
                ref="multipleTable1"
                :data="
                  obj2.slice((pageInfo3.pagenum3 - 1) * pageInfo3.pagesize3, pageInfo3.pagenum3 * pageInfo3.pagesize3)
                "
                tooltip-effect="dark"
                style="width: 100%"
              >
                <el-table-column label width="50">
                  <template slot-scope="scope">
                    <el-radio :label="scope.row.eqpmodel" v-model="radioId">&nbsp;</el-radio>
                  </template>
                </el-table-column>
                <el-table-column prop="eqpmodel" label="名称/型号" />
                <el-table-column prop="brand" label="品牌" width="120" />
                <el-table-column prop="acqmode" label="采集方式" />
              </el-table>
              <el-pagination
                :current-page="pageInfo3.pagenum3"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageInfo3.pagesize3"
                :total="obj2.length"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange3"
                @current-change="handleCurrentChange3"
              />
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { fetchDict } from '@/api/sys/dict.js'
import request from '@/utils/request'

export default {
  components: {},
  data() {
    return {
      isLoading: false,
      addLoading: false,
      editLoading: false,
      parentTypeOptions: [],
      parentTypeValue: '',
      modelName: '',
      eqpModelValue: '',
      eqpModelOptions: [],
      pageInfo1: {
        pagesize1: 5,
        pagenum1: 1
      },
      pageInfo2: {
        pagesize2: 5,
        pagenum2: 1
      },
      pageInfo3: {
        pagesize3: 5,
        pagenum3: 1
      },
      // 设备模板表格数据源
      templateData: [
        {
          id: 1,
          name: 'sdas',
          sensor: 'afasfad',
          num_type: 'af',
          collect_type: 'asfas'
        }
      ],
      // 传感器值
      sensorValue: '',
      // 示数类型值
      numTypeValue: '',
      // 传感器数据源
      sensorOptions: [],
      // 示数类型数据源
      numTypeOptions: [],
      // 添加弹框是否显示条件
      addDialogVisible: false,
      // 修改弹框是否显示条件
      editDialogVisible: false,
      // 弹框中表格选择行的id
      radioId: '',
      // 弹框中二级菜单数据
      options1: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: '',
      value1: '',
      // 弹框中一级菜单数据
      options: [
        {
          label: '传感器',
          children: [
            {
              label: '振动传感器',
              children: [
                {
                  eqpmodel: '振动传感器RS-485',
                  brand: '智泽',
                  acqmode: '云端'
                },
                {
                  eqpmodel: '振动传感器LoRa',
                  brand: '智泽',
                  acqmode: '云端'
                },
                {
                  eqpmodel: '振动传感器 NB',
                  brand: '智泽',
                  acqmode: '云端'
                }
              ]
            },
            {
              label: '土壤传感器',
              children: [
                {
                  eqpmodel: '土壤PH传感器',
                  brand: '智泽',
                  acqmode: '云端'
                },
                {
                  eqpmodel: '土壤温湿度传感器',
                  brand: '智泽',
                  acqmode: '云端'
                },
                {
                  eqpmodel: '土壤温湿度电导率',
                  brand: '智泽',
                  acqmode: '云端'
                },
                {
                  eqpmodel: '土壤水分传感器',
                  brand: '智泽',
                  acqmode: '云端'
                }
              ]
            },
            {
              label: '水质传感器',
              children: [
                {
                  eqpmodel: '电导率传感器',
                  brand: '智泽',
                  acqmode: '云端'
                },
                {
                  eqpmodel: 'PH传感器',
                  brand: '智泽',
                  acqmode: '云端'
                },
                {
                  eqpmodel: '氨氮传感器',
                  brand: '智泽',
                  acqmode: '云端'
                },
                {
                  eqpmodel: '氨氮感器',
                  brand: '智泽',
                  acqmode: '云端'
                },
                {
                  eqpmodel: 'ORP传感器',
                  brand: '智泽',
                  acqmode: '云端'
                },
                {
                  eqpmodel: '溶解氧传感器',
                  brand: '智泽',
                  acqmode: '云端'
                }
              ]
            }
          ]
        },
        {
          value: 'zujian',
          label: 'IO控制器',
          children: [
            {
              value: 'basic',
              label: 'Basic',
              children: [
                {
                  eqpmodel: '振动传感器RS-485',
                  brand: '智泽',
                  acqmode: '云端'
                },
                {
                  eqpmodel: '振动传感器LoRa',
                  brand: '智泽',
                  acqmode: '云端'
                },
                {
                  eqpmodel: '振动传感器 NB',
                  brand: '智泽',
                  acqmode: '云端'
                }
              ]
            },
            {
              value: 'form',
              label: 'Form',
              children: [
                {
                  eqpmodel: '振动传感器RS-485',
                  brand: '智泽',
                  acqmode: '云端'
                },
                {
                  eqpmodel: '振动传感器LoRa',
                  brand: '智泽',
                  acqmode: '云端'
                }
              ]
            }
          ]
        },
        {
          value: 'ziyuan',
          label: '仪器仪表',
          children: [
            {
              value: 'axure',
              label: 'Axure Components',
              children: [
                {
                  eqpmodel: '振动传感器RS-485',
                  brand: '智泽',
                  acqmode: '云端'
                },
                {
                  eqpmodel: '振动传感器LoRa',
                  brand: '智泽',
                  acqmode: '云端'
                },
                {
                  eqpmodel: '振动传感器 NB',
                  brand: '智泽',
                  acqmode: '云端'
                }
              ]
            },
            {
              value: 'sketch',
              label: 'Sketch Templates',
              children: [
                {
                  eqpmodel: '振动传感器RS-485',
                  brand: '智泽',
                  acqmode: '云端'
                },
                {
                  eqpmodel: '振动传感器LoRa',
                  brand: '智泽',
                  acqmode: '云端'
                },
                {
                  eqpmodel: '振动传感器 NB',
                  brand: '智泽',
                  acqmode: '云端'
                },
                {
                  eqpmodel: '振动传感器 NB',
                  brand: '智泽',
                  acqmode: '云端'
                },
                {
                  eqpmodel: '振动传感器 NB',
                  brand: '智泽',
                  acqmode: '云端'
                }
              ]
            }
          ]
        }
      ],
      obj1: [],
      obj2: [],
      num1: 0,
      num2: 0,
      tableData: [],
      multipleSelection: []
    }
  },
  mounted() {
    this.getMenuOne()
    this.getMenuTwo()
    this.getDatas()
    fetchDict('NUM_TYPE').then((response) => {
      this.numTypeOptions = response.data
    })
  },
  methods: {
    getDatas() {
      return request({
        url: 'fab/fabequipmentmodel',
        method: 'get'
      }).then((res) => {
        console.log(res)
      })
    },

    handleEdit(index, row) {
      console.log(index, row)
    },

    // 确认添加
    add() {
      console.log(this.num1, this.num2, this.radioId)

      this.addDialogVisible = false
    },
    editTemplate() {
      this.editDialogVisible = true
    },
    addTemplate() {
      this.addDialogVisible = true
    },
    handleSizeChange2(pagesize) {
      this.pageInfo2.pagesize2 = pagesize
    },
    handleCurrentChange2(pagenum) {
      this.pageInfo2.pagenum2 = pagenum
    },
    handleSizeChange3(pagesize) {
      this.pageInfo3.pagesize3 = pagesize
    },
    handleCurrentChange3(pagenum) {
      this.pageInfo3.pagenum3 = pagenum
    },
    rowClick(v) {
      console.log(v)
      this.radioId = v.eqpmodel
      console.log(this.radioId)
    },
    // 获取一级菜单数据
    getMenuOne() {
      this.options.forEach((item, index) => {
        if (this.num1 === index) {
          this.obj1 = item.children
        }
      })
    },
    // 获取二级菜单数据
    getMenuTwo() {
      this.obj1.forEach((item, index) => {
        if (this.num2 === index) {
          this.obj2 = item.children
        }
      })
    },
    // 一级菜单点击时间
    getIndex1(idx) {
      this.num1 = idx
      this.num2 = 0
      // this.radioId = this.obj2[0].eqpmodel
      this.getMenuOne()
      this.getMenuTwo()
    },
    // 二级菜单点击时间
    getIndex2(idx) {
      this.num2 = idx
      this.getMenuTwo()
      this.radioId = this.obj2[idx].eqpmodel
    },
    handleSizeChange1(pagesize) {
      this.pageInfo1.pagesize1 = pagesize
    },
    handleCurrentChange1(pagenum) {
      this.pageInfo1.pagenum1 = pagenum
    }
  }
}
</script>

<style  scoped>
.dialog {
  width: 80%;
}
.container {
  width: 100%;
  height: 500px;
  display: flex;
  margin-top: 15px;
}
.active {
  color: #3c78ff;
  background-color: #ebeef5;
  border-left: 3px solid #3c78ff;
}

.menu-one,
.menu-two {
  height: 500px;
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
}
.menu-three {
  flex: 3;
  height: 500px;
  position: relative;
  border: 1px solid #eee;
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
  /* background-color: #fff; */
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
