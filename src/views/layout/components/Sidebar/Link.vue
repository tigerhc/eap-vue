
<template>
  <!-- eslint-disable vue/require-component-is-->
  <component v-bind="linkProps(to)">
    <slot/>
  </component>
</template>

<script>
import { isExternal } from '@/utils'

export default {
  props: {
    to: {
      type: Object,
      default: () => { '/' },
      required: true
    }
  },
  methods: {
    isExternalLink(routePath) {
      return isExternal(routePath)
    },
    linkProps(to) {
      const url = to.path
      if (this.isExternalLink(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to
      }
    }
  }
}
</script>
