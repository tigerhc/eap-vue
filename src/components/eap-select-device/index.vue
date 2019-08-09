<template>
  <div>
    <select-device ref="selectDevice" @childByValue="childByValue" />
    <el-input :disabled="disabled" :value="value" :placeholder="placeholder" readonly>
      <i slot="suffix" class="el-input__icon el-icon-search" @click="selecton" />
    </el-input>
  </div>
</template>

<script>
import SelectDevice from '@/views/fab/eqpmodel/eqpmodelLook'
console.info(SelectDevice)
export default {
  name: 'WSelectDevice',
  components: { SelectDevice },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: { type: undefined, default: undefined },
    placeholder: {
      type: String,
      default: '单击选择设备类型'
    }
  },
  methods: {
    selecton() {
      this.$refs.selectDevice.openDialog(true)
    },
    childByValue(val) {
      console.info(val)
      this.$emit('input', val)
    }
  }
}
</script>

<style>
</style>
