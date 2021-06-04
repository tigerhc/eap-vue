<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-row :gutter="5">
        <el-col :span="3">
          <el-input v-model="searchObj.lotNo" placeholder="请输入批次号" clearable/>
        </el-col>
        <el-col :span="4">
          <el-input v-model="searchObj.chipId" placeholder="请输入制品序号" clearable/>
        </el-col>
        <el-col :span="5" class="tray-chip-eqp-selet">
          <!--<w-select-eqp v-model="searchObj.eqpIds"/>-->
							<el-select v-model="searchObj.eqpIds" clearable>
								<el-option
									v-for="item in eqps"
									:key="item.eqpId"
									:label="item.eqpId"
									:value="item.eqpId" />
							</el-select>
        </el-col>
        <el-date-picker
          v-model="searchObj.time"
          :picker-options="dateOptions"
          :editable="false"
          type="datetimerange"
          popper-class="tray-chip-date-picker"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        />
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
				<el-button type="primary" icon="el-icon-refresh" @click="clnParam">清空</el-button>
        <el-button type="text" class="a-tray-job-history" @click="toHistory">任务历史</el-button>
      </el-row>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="lotNo" label="批次号" width="70" fixed/>
      <el-table-column prop="chipId" label="制品号" width="200" fixed>
        <template v-if="scope.row.chipId" slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleChipClick(scope.row)"
          >{{ scope.row.chipId }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="eqpId" label="设备号" width="150" fixed/>
      <el-table-column prop="productionNo" label="品番号" width="80"/>
      <el-table-column prop="toTrayId" label="托盘ID" width="100"/>
      <el-table-column prop="toX" label="X坐标" width="60"/>
      <el-table-column prop="toY" label="Y坐标" width="60"/>
      <el-table-column prop="judgeResult" label="质量" width="60"/>
      <el-table-column :formatter="colDateFormatter" prop="startTime" label="时间" width="180"/>
			<el-table-column prop="dmId" label="晶圆ID" width="100">
				<template v-if="scope.row.dmId" slot-scope="scope">
          <el-button type="text" size="small" @click="handleDMClick(scope.row)">{{ scope.row.dmId }}</el-button>
        </template>
			</el-table-column>
      <el-table-column prop="dmX" label="晶圆X" width="60"/>
      <el-table-column prop="dmY" label="晶圆Y" width="60"/>
      <el-table-column prop="productionParam" label="生产条件" width="100">
        <template slot-scope="scope">
          <!-- <el-button
            type="text"
            size="small"
            @click="handleParamClick(scope.row)"
          >{{ scope.row.productionParam }}</el-button>-->
          <el-button
            type="text"
            size="small"
            @click="handleParamClick(scope.row)"
          >生产条件明细</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="lotNo" label="物料信息" width="100">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleGoodsClick(scope.row)"
          >查询物料</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogTableVisible" title="生产条件">
      <div class="prodTitlePanel">
        <div v-for="(item,index) in prodTitleArr" :key="'T'+index" :value="item" class="prodTitle">{{ item.colName }}：</div>
      </div>
      <div class="prodValuePanel">
        <div v-for="(item,index) in prodValueArr" :key="'pvA'+index" :value="item" :class="prodAlarmValue.indexOf(','+index+',')>-1?'prodAlarmValue':'prodValue'">{{ item }}</div>
      </div>
      <div class="prodMinPanel">
        <div v-for="(item,index) in prodTitleArr" :key="'pvMin'+index" :value="item" class="prodTitleMinValue">最小值:{{ item.limitMin }}</div>
      </div>
      <div class="prodMaxPanel">
        <div v-for="(item,index) in prodTitleArr" :key="'pvMax'+index" :value="item" class="prodTitleMaxValue">最大值:{{ item.limitMax }}</div>
      </div>
      <div class="prodSetPanel">
        <div v-for="(item,index) in prodTitleArr" :key="'pvS'+index" :value="item" class="prodTitleSetValue">设定值:{{ item.defaultValue }}</div>
      </div>
    </el-dialog>
    <el-pagination
      :current-page="searchObj.page"
      :page-sizes="[50, 100, 200, 500]"
      :page-size="searchObj.pageSize"
      :total="searchObj.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="scss">
.a-tray-job-history{
  margin-left: 3px;
  border: 0;
  font-size: 12px;
  span {
    position: absolute;
    bottom: 5px;
  }
}
.tray-chip-eqp-selet .el-select {
  display: block;
}
.tray-chip-date-picker .el-picker-panel__shortcut {
  background-color: #eeeeee;
  border: 1px solid #dcdfe6;
  display: inline-block;
  border-radius: 2px;
  color: #0033cc;
  margin: 4px;
}
.prodTitlePanel{width:20%;position:absolute;height:200px;}
.prodValuePanel{width:20%;position:absolute;margin-left:20%;}
.prodMinPanel{width:15%;position:absolute;margin-left:40%;}
.prodMaxPanel{width:15%;position:absolute;margin-left:55%;}
.prodSetPanel{width:15%;margin-left:73%;}

.prodTitlePanel .prodTitle{width:100%;height:40px;background-color:#1e6abc;color:white;text-align:right;line-height:40px;font-weight:bold;border:1px solid white;}
.prodValue{width:100%;height:40px;line-height:40px;padding-left:5px;}
.prodTitleMinValue{width:100%;height:40px;line-height:40px;padding-left:5px;background-color: #d0d0d7}/**background:url(../../../assets/img/proParamMin.jpg);*/
.prodTitleMaxValue{width:100%;height:40px;line-height:40px;padding-left:5px;background-color: #d0d0d7}
.prodTitleSetValue{width:100%;height:40px;line-height:40px;padding-left:5px;background-color: #d0d0d7}
.prodValuePanel .prodAlarmValue{width:100%;height:40px;line-height:40px;padding-left:5px;background-color: #DD4A68}
</style>

<script>
import request from '@/utils/request'
import dateFormat from '@/utils/dateformat'
import { getTrayEqpList, getPuctionParam, getPuctionGoods } from '@/api/map/monitor'

export default {
  name: 'TrayChipMoveList',
  data() {
    return {
      tableData: [],
      searchObj: {
        lotNo: null,
        eqpIds: [],
        chipId: '',
        time: [],
        total: 0,
        pageSize: 50,
        page: 1,
        eqpId: ''
      },
      eqps: [],
      dialogTableVisible: false,
      prodTitleArr: [],
      prodValueArr: [],
      prodAlarmValue: ',',
      da: [],
      dateOptions: {
        shortcuts: [
          {
            text: '最近2小时',
            onClick(picker) {
              const end = new Date()
              const start = new Date(end.getTime() - 3600 * 1000 * 2)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近6小时',
            onClick(picker) {
              const end = new Date()
              const start = new Date(end.getTime() - 3600 * 1000 * 6)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '今天',
            onClick(picker) {
              const end = new Date()
              const start = new Date(new Date().toLocaleDateString())
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const end = new Date(new Date().toLocaleDateString())
              const start = new Date(end.getTime() - 3600 * 1000 * 24)
              end.setTime(end.getTime() - 1000)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '近三天',
            onClick(picker) {
              const end = new Date()
              const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 48)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  created() {
    getTrayEqpList().then((response) => {
      this.eqps = response.data.eqps
    })
  },
  methods: {
    search() {
      const data = {}
      data.pageSize = this.searchObj.pageSize
      data.offset = (this.searchObj.page - 1) * this.searchObj.pageSize
      data.total = this.searchObj.total

      /** *if (this.searchObj.chipId && this.searchObj.chipId.trim() !== '') {
        this.searchObj.time = []
        data.lotNo = this.searchObj.lotNo
        data.chipIds = this.searchObj.chipId.trim().split(',')
      } else {
        if (
          typeof this.searchObj.time === 'undefined' ||
          this.searchObj.time == null ||
          this.searchObj.time.length === 0
        ) {
          // this.searchObj.time = [dateFormat(new Date(new Date().toLocaleDateString())), dateFormat(new Date())]
        }
        if (this.searchObj.lotNo !== null && this.searchObj.lotNo !== undefined) {
          this.searchObj.lotNo = this.searchObj.lotNo.toUpperCase()
        }
        data.lotNo = this.searchObj.lotNo
        data.eqpIds = this.searchObj.eqpIds
        data.sTime = this.searchObj.time[0]
        data.eTime = this.searchObj.time[1]
      }***/
      if (this.searchObj.lotNo !== null && this.searchObj.lotNo !== '') {
        data.lotNo = this.searchObj.lotNo
      }
      if (this.searchObj.chipId && this.searchObj.chipId.trim() !== '') {
        if (this.searchObj.lotNo === null || this.searchObj.lotNo === '') {
          return
        }
        data.chipIds = this.searchObj.chipId.trim().split(',')
      }
      if (this.searchObj.time === null) {
        this.searchObj.time = []
      }
      if (this.searchObj.time[0] !== undefined && this.searchObj.time[1] !== undefined) {
        data.sTime = this.searchObj.time[0]
        data.eTime = this.searchObj.time[1]
      }
      data.eqpIds = this.searchObj.eqpIds
      request({
        url: '/map/maptraychipmove/page',
        method: 'post',
        data
      }).then((resp) => {
        this.searchObj.total = resp.data.total
        if (resp.data.results) {
          this.tableData = resp.data.results
        }
      })
    },
    goEchart() {

    },
    clnParam() {
      this.searchObj.lotNo = null
      this.searchObj.eqpIds = []
      this.searchObj.eqpId = ''
      this.searchObj.time = []
      this.searchObj.chipId = ''
    },
    handleSizeChange(val) {
      this.searchObj.pageSize = val
      this.search()
    },
    handleCurrentChange(val) {
      this.searchObj.page = val
      this.search()
    },
    colDateFormatter(row, column, val) {
      if (val !== null) {
        return dateFormat(new Date(Date.parse(val)))
      }
      return val
    },
    handleChipClick(row) {
      // name: 'views/map/tray/traychipmoveDetail',
      this.$router.push({
        name: 'views/map/tray/chip2D',
        // name: 'views/map/tray/traychipmoveDetail',
        query: {
          id: row.chipId,
          type: 'VIEW'
        }
      })
    },
    handleDMClick(row) {
      this.$router.push({
        name: 'views/map/tray/trayDmDetail',
        query: {
          id: row.id,
          type: 'VIEW'
        }
      })
    },
    handleParamClick(row) {
      // 初始化使用的数据变量
      this.prodAlarmValue = ','
      this.prodValueArr = []
      var _this = this
      getPuctionParam(row.id).then((response) => {
        var paramObj = response.data.paramObj
        if (paramObj !== undefined && paramObj !== null) {
          // 标题
          _this.prodTitleArr = paramObj.title

          if (paramObj.paramValue !== undefined && paramObj.paramValue !== null) {
            var pvs = paramObj.paramValue.split(',')
            if (pvs.length > paramObj.title.length) {
              for (var j = 0; j < paramObj.title.length; j++) {
                // 告警的变量记录下标
                if (_this._chkParamValue(pvs[j], paramObj.title[j])) {
                  _this.prodAlarmValue = _this.prodAlarmValue + j + ','
                }
                // 添加到生产条件的list中
                _this.prodValueArr.push(pvs[j])
              }
            } else {
              for (var m = 0; m < pvs.length; m++) {
                // 告警的变量记录下标
                if (_this._chkParamValue(pvs[m], paramObj.title[m])) {
                  _this.prodAlarmValue = _this.prodAlarmValue + m + ','
                }
                // 添加到生产条件的list中
                _this.prodValueArr.push(pvs[m])
              }
            }
          }
        }
        _this.dialogTableVisible = true
      })
    },
    handleGoodsClick(row) {
      // var _this = this
      getPuctionGoods(row.startTime, row.eqpId).then((response) => {
        alert('等待入账信息完善才能查')
      })
    },
    toHistory() {
      this.$router.push({
        name: 'views/map/tray/trayjobhistoryList'
      })
    },
    // true :不在范围内或 不是设定值
    _chkParamValue(paramV, titleObj) {
      if (titleObj !== undefined) {
        // 比较设定值
        if (titleObj.defaultValue !== undefined && titleObj.defaultValue !== '' && titleObj.defaultValue !== null) {
          return titleObj.defaultValue !== paramV
        }
        // 比较上下限
        var numRe = new RegExp('^[-\\+]?([0-9]+\\.?)?[0-9]+$')
        if (numRe.test(titleObj.limitMin) && numRe.test(titleObj.limitMax)) {
          var min = parseFloat(titleObj.limitMin)
          var max = parseFloat(titleObj.limitMax)
          var rs = paramV > min && paramV < max
          return !rs
        } else {
          return false
        }
      } else {
        return false
      }
    }
  }
}
</script>
