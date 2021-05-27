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
    <div class="box1" />
    <div class="box2" />
    <div class="box3" />
    <div class="box4" />
    <div class="box5" />
  </div>
</template>

<script>
// import x from ''
export default {
  components: {},
  data() {
    return {
      temperature: '20',
      humidity: '70%',
      windspeed: '15',
      electric: '15',
      unelectric: '12'
    }
  },
  methods: {
    go() {
      this.$router.push('/product')
    }
  }
}
</script>

<style  scoped lang='scss'>
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

  p {
    font-size: 15px;
  }

  span {
    font-size: 20px;
    color: #009999;
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
    border: 1px solid #fff;
    position: absolute;
    top: 10%;
    left: 17.5%;
  }

  .box2 {
    width: 12.5%;
    height: 19%;
    border: 1px solid #fff;
    position: absolute;
    top: 4.7%;
    left: 42.3%;
  }

  .box3 {
    width: 10%;
    height: 14%;
    border: 1px solid #fff;
    position: absolute;
    top: 6%;
    left: 59.5%;
  }

  .box4 {
    width: 9.7%;
    height: 16%;
    border: 1px solid #fff;
    position: absolute;
    top: 15%;
    left: 77.7%;
  }

  .box5 {
    width: 12.7%;
    height: 22%;
    border: 1px solid #fff;
    position: absolute;
    top: 40.2%;
    left: 65%;
  }
}
</style>
