<template>
  <el-select v-bind="$attrs" :value="value" :disabled="disabled" :multiple="multiple" clearable filterable @input="onValueChange">
    <el-option v-for="op in options" :label="op.label" :value="op.value" :key="op.value" />
  </el-select>
</template>

<script>
export default {
  name: 'WSelectDic',
  props: {
    dict: {
      type: String,
      default: ''
    },
    value: {
      type: undefined,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
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
    value: function(v, o) {}
  },
  mounted() {},
  methods: {
    onValueChange(e) {
      this.$emit('input', e)
    }
  }
}
</script>

<style>
</style>
