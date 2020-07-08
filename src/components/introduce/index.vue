<template>
  <div v-html="content"/>
</template>

<script>
export default {
  name: 'Introduce',
  props: {
    content: undefined
  }
}
</script>
