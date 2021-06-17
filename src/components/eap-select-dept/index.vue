<template>
  <!-- <div class="wrap"> -->
  <el-cascader
    :disabled="disabled"
    :value="value"
    :options="options"
    :props="{ expandTrigger: 'hover', value: 'id', label: 'name' }"
    placeholder="组织机构"
    @input="onChange"
  />
  <!-- <i v-if="loading" class="el-icon-loading" /> -->
  <!-- </div> -->
</template>
<style scoped>
/* .wrap {
  width: 200px;
  position: relative;
}
.el-icon-loading {
  position: absolute;
  right: 10px;
  z-index: 1;
  top: 10px;
} */
</style>
<script>
import { fetchOrganizationList } from '@/api/sys/organization'
export default {
  name: 'WSelectDept',
  props: {
    value: {
      type: undefined,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      options: [],
      loading: false
    }
  },
  mounted() {
    this.loading = true
    fetchOrganizationList(this.listQuery)
      .then((response) => {
        this.options = response.data
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    onChange(v) {
      console.log(v)
      this.$emit('input', v)
    }
  }
}
</script>

<style>
</style>
