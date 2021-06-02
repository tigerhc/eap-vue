<template>
  <div class="app">
    <h1>生产管理系统</h1>
    <div class="temperature">
      <p>温度</p>
      <span>{{ temperature }}℃</span>
    </div>
    <div class="humidity">
      <p>湿度</p>
      <span>{{ humidity }}</span>
    </div>
    <div class="windspeed">
      <p>风速</p>
      <span>{{ windspeed }}km/h</span>
    </div>
    <div class="electric">
      <p>电表有功</p>
      <span>{{ electric }}km/h</span>
    </div>
    <div class="unelectric">
      <p>电表无功</p>
      <span>{{ unelectric }}km/h</span>
    </div>
    <div class="box5">
      <p>耗费材料</p>
      <span>{{ cost }}</span>
    </div>
    <div class="box2">
      <p>批次号</p>
      <span>{{ batchNum }}</span>
    </div>
    <div class="box3">
      <p>批次产量</p>
      <span>{{ batchProduct }}</span>
    </div>
    <div class="box1">
      <p>设备号</p>
      <el-select v-model="eqpNum" placeholder="请选择设备号" @change="changeData">
        <el-option v-for="item in eqpOptions" :key="item.value" :value="item.value"/>
      </el-select>
    </div>
    <div class="box4">
      <p>设备类型</p>
      <span>{{ eqpModel }}</span>
    </div>
  </div>
</template>

<script>
// import x from ''
export default {
  components: {},
  data() {
    return {
      eqpOptions: [{ value: '11111' }, { value: '22222' }],
      temperature: '',
      humidity: '',
      windspeed: '',
      electric: '',
      unelectric: '',
      cost: '',
      batchNum: '',
      batchProduct: '',
      eqpNum: '',
      eqpModel: ''
    }
  },
  methods: {
    changeData() {
      if (this.eqpNum === '11111') {
        this.temperature = '20'
        this.humidity = '70%'
        this.windspeed = '15'
        this.electric = '15'
        this.unelectric = '12'
        this.cost = '30'
        this.batchNum = '28310'
        this.batchProduct = '50'
        this.eqpModel = 'adafkdf'
      } else {
        this.temperature = '40'
        this.humidity = '80%'
        this.windspeed = '20'
        this.electric = '34'
        this.unelectric = '24'
        this.cost = '35'
        this.batchNum = '234324'
        this.batchProduct = '63'
        this.eqpModel = 'we34223'
      }
    }
  }
}
</script>

<style  scoped lang='scss'>
p {
  color: #fff;
  font-size: 15px;
}

span {
  font-size: 20px;
  color: #009999;
}

.app {
  width: 100%;
  height: 100vh;
  background-image: url('../../assets/img/product.jpg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 2% 5%;
  position: relative;
  h1 {
    color: #fff;
  }

  .temperature,
  .humidity,
  .windspeed,
  .electric,
  .unelectric {
    width: 7.5%;
    height: 24%;
    position: absolute;
    color: #fff;
    bottom: 7.5%;
    padding: 15px;
  }

  .temperature {
    left: 16%;
  }

  .humidity {
    left: 24.3%;
  }

  .windspeed {
    left: 32.7%;
  }

  .electric {
    left: 41%;
  }

  .unelectric {
    left: 49.5%;
  }

  .box1 {
    width: 10.5%;
    height: 19%;
    position: absolute;
    top: 10%;
    left: 17.5%;
    padding: 1%;
  }

  .box2 {
    width: 12.5%;
    height: 19%;
    position: absolute;
    top: 4.7%;
    left: 42.3%;
    padding: 1%;
  }

  .box3 {
    width: 10%;
    height: 14%;
    position: absolute;
    top: 6%;
    left: 59.5%;
    padding: 1%;
  }

  .box4 {
    width: 9.7%;
    height: 16%;
    position: absolute;
    top: 15%;
    left: 77.7%;
    padding: 1%;
  }

  .box5 {
    width: 12.7%;
    height: 22%;
    position: absolute;
    top: 40.2%;
    left: 65%;
    padding: 1%;
  }
}
</style>
