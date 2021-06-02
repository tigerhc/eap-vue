<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>修改设备模板</span>
    </div>

    <el-row style="margin-bottom: 15px">
      <el-select v-model="model.eqpModelValue" placeholder="设备类型">
        <el-option v-for="item in eqpModelOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="model.temNameValue" placeholder="模板名称">
        <el-option v-for="item in temNameOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-row>
    <div class="menu">
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
        <el-table ref="multipleTable" :data="obj2" tooltip-effect="dark" style="width: 100%" @row-click="rowClick">
          <el-table-column label width="50">
            <template slot-scope="scope">
              <el-radio :label="scope.row.eqpmodel" v-model="radioId">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="eqpmodel" label="名称/型号" />
          <el-table-column prop="brand" label="品牌" width="120" />
          <el-table-column prop="acqmode" label="数量" @click="editRow(row)">
            <template slot-scope="scope">
              <span
                v-show="!showVisiable || editIndex != scope.$index"
                class="editCell"
                style="width: 120px"
                @click="editCurrRow(scope.$index, 'rowkeY')"
                >{{ scope.row.acqmode }}</span
              >
              <el-input
                v-show="showVisiable && editIndex == scope.$index"
                :id="scope.$index + 'rowkeY'"
                v-model="scope.row.acqmode"
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
    </div>
    <el-row style="margin-bottom: 15px">
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
    <el-row>
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
  </el-card>
</template>
<script>
import { fetchDict } from '@/api/sys/dict.js'
import dateFormat from '@/utils/dateformat'

export default {
  components: {},
  data() {
    return {
      showVisiable: false, // 控制显隐
      editIndex: -1, // 当前编辑行index
      pageInfo: {
        total: 0
      },
      radioId: '',
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
                  eqpmodel: '氨氮传感器',
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
      multipleSelection: [],
      activeFlagO: [],
      temNameOptions: [],
      eqpModelOptions: [], // ////
      model: {
        updateBy: '',
        eqpModelValue: '',
        temNameValue: '',
        activeFlag: '',
        remarks: '',
        delFlag: 0,
        updateDate: '',
        createDate: '',
        createBy: ''
      }
    }
  },
  mounted() {
    this.getMenuOne()
    this.getMenuTwo()
    // this.radioId = this.obj2[0].eqpmodel

    fetchDict('ACTIVE_FLAG').then((res) => {
      this.activeFlagO = res.data
    })
    this.model.createBy = this.$store.getters.roles[0]
    this.model.createDate = dateFormat(new Date())
    this.model.updateBy = this.$store.getters.roles[0]
    this.model.updateDate = dateFormat(new Date())
  },
  methods: {
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
    rowClick(row) {
      this.radioId = row.eqpmodel
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
      this.radioId = this.obj2[0].eqpmodel
    }
  }
}
</script>

<style  scoped>
* {
  box-sizing: border-box;
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
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
  margin-bottom: 20px;
  border: 1px solid #eee;
}
.menu-three {
  flex: 3;
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
