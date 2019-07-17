<template>

  <el-popover placement="right" title="请选择图标" width="600" trigger="click">
    <el-tabs v-model="activeName" stretch type="card">
      <el-tab-pane label="Element Icon" name="el">
        <ul class="icon-container">
          <li v-for="iconName in iconsEl" :key="iconName" :class="{active:iconName===tempValue}" @click="onPick(iconName)">
            <span :class="iconName" />
            <i>{{ iconName }}</i>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="Font Awesome Icon" name="fa">
        <ul class="icon-container">
          <li v-for="iconName in iconsFa" :key="iconName" :class="{active:'fa-'+iconName===tempValue}" @click="onPick('fa-'+iconName)">
            <span :class="'fa-' + iconName" />
            <i>{{ 'fa-'+iconName }}</i>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>

    <el-input slot="reference" :value="tempValue" clearable @keyup.native.stop.prevent @clear="onClear">
      <el-button v-if="tempValue" slot="prepend" :icon="tempValue" />
      <el-button slot="append" icon="el-icon-search" />
    </el-input>
  </el-popover>

</template>
<script>
import '../../../static/font-awesome-4.7.0/css/font-awesome.css'
export default {
  name: 'IconPicker',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      iconsFa: Array.from(new Set(require('./iconFa.json'))),
      iconsEl: require('./iconEl.json'),
      activeName: 'el',
      tempValue: ''
    }
  },
  mounted() {
    this.tempValue = this.value
  },
  methods: {
    onPick(iconName) {
      this.tempValue = iconName
      this.$emit('input', iconName)
    },
    onClear() {
      this.onPick('')
    }
  }
}
</script>
<style lang="scss" scoped>
.icon-container {
  height: 300px;
  overflow: auto;
  list-style: none;
  font-size: 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  li {
    float: left;
    flex-basis:50%;
    display: flex;
    align-items: center;
    margin:3px 0;
    &:hover{
      color:#409EFF;
      cursor:pointer;
    }
    &:active , &.active{
      color:darken(#409EFF,10);
    }
  }
  span{
    width:1.5em;
  }
  i{
    font-size:14px;
    vertical-align: middle;
    font-style: normal;
    font-weight: 600;
    white-space:nowrap;
  }
}
</style>
