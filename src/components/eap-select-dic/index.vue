<template>
  <el-select :value="value" :disabled="disabled" @input="onValueChange">
    <el-option v-for="op in options" :label="op.label" :value="op.value" :key="op.value" />
  </el-select>
</template>

<script>
export default {
  name: 'EapSelectDic',
  props: {
    dict: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    options: function() {
      const dictList = this.dictList(this.dict) || []
      return dictList
    }
  },
  watch: {
    value: function(v, o) {
      console.info(v, o)
    }
  },
  mounted() {
    console.info('dict mounted')
  },
  methods: {
    onValueChange(e) {
      this.$emit('input', e)
    }
  }
}
</script>

<style>
</style>
