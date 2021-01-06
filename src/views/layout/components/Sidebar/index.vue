<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div v-show="!isCollapse" class="header-sidebar" @click="comeBack">
      <img :src="project.projectPhotoUrl">
      <span id="projectName"/>
    </div>
    <div v-show="isCollapse" style="padding-left:10px" class="header-sidebar" @click="comeBack">
      <img :src="project.projectPhotoUrl">
    </div>
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :default-openeds="openeds"
      style="height:90%"
      mode="vertical"
      background-color="#002140"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      >
      <sidebar-item v-for="route in meunRouter[0].children" :key="route.path" :item="route" :base-path="meunRouter[0].path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar',
      'project'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    },
    meunRouter() {
      if (this.$store.state.permission.meunRouter.length > 0) {
        return this.$store.state.permission.meunRouter
      } else {
        return [{ children: [] }]
      }
    },
    openeds() {
      return ['1']
    }
  },
  mounted() {
    if (window.location.hostname === '10.160.144.9') {
      document.getElementById('projectName').innerHTML = 'CIM9(二栋)'
    } else {
      document.getElementById('projectName').innerHTML = 'CIM8(一栋)'
    }
  },
  methods: {
    comeBack() {
      this.$router.push('/dashboard')
    }
  }
}
</script>
<style lang="scss"  scoped>
.header-sidebar {
    padding-left: 24px;
    display: flex;
    min-height: 55px;
    height: 10%;
    align-items: center;
    background-color: #002140;
    opacity: 1;
    overflow: visible;
    position: relative;
    transition: all .3s ease-in-out;
    cursor: pointer;
    img {
      width: 32px;
      vertical-align: middle;
    }
    span {
      color: #fff;
      font-size: 20px;
      margin-left: 10px;
      vertical-align: middle;
      font-weight: 600;
      white-space: nowrap;
    }
}

</style>

