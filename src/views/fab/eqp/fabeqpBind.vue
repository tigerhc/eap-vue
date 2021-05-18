<template>
  <div class="container">
    <div class="container-wrap">
      <el-row :gutter="20" style="margin-bottom: 15px">
        <el-col :span="4">
          <el-input placeholder="请输入模板名称"/>
        </el-col>
        <el-col :span="4">
          <el-select v-model="value" filterable placeholder="请选择设备号">
            <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-date-picker v-model="value1" type="datetime" placeholder="请选择绑定时间"/>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">已绑设备查询</el-button>
        </el-col>
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
            <i class="el-icon-caret-right"/>
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
            <i class="el-icon-caret-right"/>
          </div>
        </div>
        <div class="menu-three">
          <el-table
            ref="multipleTable"
            :data="obj2"
            tooltip-effect="dark"
            height="250"
            style="width: 100%"
            @row-click="rowClick"
          >
            <el-table-column label width="50">
              <template slot-scope="scope">
                <el-radio :label="scope.row.eqpmodel" v-model="radioId">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="eqpmodel" label="名称/型号"/>
            <el-table-column prop="brand" label="品牌" width="120"/>
            <el-table-column prop="acqmode" label="采集方式"/>
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
    </div>
    <el-card>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="id" label="ID" width="120"/>
        <el-table-column prop="eqp_id" label="设备号" width="120"/>
        <el-table-column prop="parent_eqp_id" label="父级设备号"/>
        <el-table-column prop="office_id" label="部门ID"/>
        <el-table-column prop="create_by" label="创建人ID"/>
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
    </el-card>
  </div>
</template>
<script>
// import x from ''
export default {
  components: {},
  data() {
    return {
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
      multipleSelection: []
    }
  },
  mounted() {
    this.getMenuOne()
    this.getMenuTwo()
    this.radioId = this.obj2[0].eqpmodel
  },
  methods: {
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
.el-table {
  height: 84%;
  overflow: hidden;
  overflow-y: auto;
}
.active {
  color: #3c78ff;
  background-color: #ebeef5;
  border-left: 3px solid #3c78ff;
}
.el-input {
  width: 200px;
}
.container {
  width: 90%;
  height: calc(100vh - 88px);
  margin: 0 auto;
  padding: 15px 0;
}
.container .container-wrap {
  width: 100%;
  height: 50%;
  border: 1px solid #ebeef5;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border-radius: 10px;
  padding: 15px;
}
.menu {
  width: 100%;
  height: 85%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ebeef5;
  background-color: #fff;
}
.menu-one,
.menu-two {
  height: 100%;
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
}
.container .container-wrap .menu-three {
  flex: 3;
  height: 100%;
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
.el-card {
  height: 50%;
  margin-top: 15px;
  position: relative;
}
.el-pagination {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
