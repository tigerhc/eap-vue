<template>
  <div class="app-container calendar-list-container">
    <!--设备列表组件-->
    <eap-eqpt/>
  </div>
</template>

<script>
import EapEqpt from '../../../components/eap-eqpt/index'
export default {
  name: 'Eqp',
  components: { EapEqpt },
  data() {
    return {}
  },
  methods: {
  }
}
</script>
