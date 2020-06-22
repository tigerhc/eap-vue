<template>
  <div class="jk-wrapper-jingyuan">
    <div class="jk-bg-round-red">
      <div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
        <div v-for="item in listleft" :key="item" style="margin-right: 40px;">
          <div>{{ item }}</div>
        </div>
      </div>
      <div style="display: flex;flex-direction: column;justify-content: space-between;align-items: center;">
        <div v-for="item in listcenter" :key="item" style="line-height: 40px;">
          <div>{{ item }}</div>
        </div>
      </div>
      <div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
        <div v-for="item in listright" :key="item" style="margin-left: 40px;">
          <div>{{ item }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WCircleJy',
  props: {
    ary: {
      type: Array,
      default: () => []
    }
  },
  data: function() {
    return {
      listleft: [],
      listright: [],
      listcenter: []
    }
  },
  mounted() {
    if (this.ary) {
      const length = this.ary.length
      const center = length / 2
      const point = center + center / 2
      for (let i = 0; i < length; i++) {
        if (i < center) {
          this.listcenter.push(this.ary[i])
        } else if (i < point) {
          this.listleft.push(this.ary[i])
        } else {
          this.listright.push(this.ary[i])
        }
      }
    }
  },
  methods: {
    onValueChange(e) {
      this.list = e
      this.$emit('input', e)
    }
  }
}
</script>

<style scoped>
.jk-wrapper-jingyuan{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
  .jk-bg-round-red {
    position: relative;
    min-width:400px;
    min-height:400px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: url("/src/assets/img/yuan.png") no-repeat;
    background-size: 100%;
  }
</style>
