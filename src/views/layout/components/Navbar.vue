<template>
  <div class="navbar">
    <el-tooltip content="左侧导航隐藏开关" placement="bottom">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    </el-tooltip>

    <!-- <breadcrumb class="breadcrumb-container"/> -->
    <div class="headerSur">
      <el-tabs v-model="activeName" @tab-click="chooseFirstLeave" >
        <el-tab-pane v-for="(item,index) in firstLeave" :key="index" :label="item.name" :name="item.id">
          <span slot="label">&nbsp;<item :icon="item.icon" />&nbsp;<span class="menu-name">{{ item.name }}</span> </span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="right-menu">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <span class="sys-dw">系统</span>
          <i class="el-icon-caret-bottom"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,index) in projectList" :command="item" :key="index">{{ item.projectName }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item"/>

        <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip>

        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select class="international right-menu-item"/>
        </el-tooltip>

        <lang-select class="international right-menu-item"/>

        <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
          <theme-picker class="theme-switch right-menu-item"/>
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item" trigger="click" @command="getHome">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="url" trigger="click" >
            {{ $t('navbar.home') }}
          </el-dropdown-item>
          <router-link to="/info">
            <el-dropdown-item divided>
              用户信息
            </el-dropdown-item>
          </router-link>
          <!-- <router-link to="/change/password">
            <el-dropdown-item>
              修改密码
            </el-dropdown-item>
          </router-link> -->
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { fetchProList, fetchHome, getProject } from '@/api/sys/project'
import { mapGetters } from 'vuex'
import { fetchMenuList, fetchMeunRouterList } from '@/api/sys/menu'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import Item from './Sidebar/Item'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker,
    Item
  },
  data() {
    return {
      firstLeave: [],
      projectList: [],
      activeName: '',
      home: '',
      url: {
        href: 'http://10.160.144.8/#/home'
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'avatar', 'device', 'addRouters', 'project'])
  },
  mounted() {
    getProject('2').then((res) => {
      const obj = res.data
      this.$store.dispatch('getProject', obj)
    })
    this.getFirstMeun()
    this.getList()
  },
  methods: {
    getHome(url) {
      window.location.href = url.href
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    // 切换系统
    handleCommand(item) {
      window.location.href = item.projectUrl
      // window.location.href = item.projectUrl + '?projectId=' + item.projectId + '&projectName=' + item.projectName + '&projectPhotoUrl=' + item.projectPhotoUrl
    },
    // 查询项目
    getList() {
      const params = this.changeParams()
      fetchProList(params).then((response) => {
        this.projectList = response.data
      })
    },
    // 转换入参
    changeParams() {
      const params = {
        'page.pn': 1,
        'page.size': 99999,
        status: 1,
        delFlag: 0,
        queryFields: 'id,projectName,projectDetail,projectUrl,projectPhotoUrl,'
      }
      return params
    },
    // 获取一级菜单
    getFirstMeun() {
      const params = {
        projectId: '2'
      }
      fetchMenuList(params).then((response) => {
        this.firstLeave = response.data
        this.activeName = this.firstLeave[0].id
        this.getSecondLeave(this.activeName)
      })
    },
    // 点击一级菜单 header-home-sidebar
    chooseFirstLeave(tab) {
      this.getSecondLeave(tab.name)
    },
    // 获取二级菜单
    getSecondLeave(id) {
      const params = {
        id
      }
      fetchMeunRouterList(params).then((response) => {
        this.$store.commit('SET_MEUNROUTES', response.data)
        this.$store.commit('SET_ACTIVENAME', id)
        if (!this.$store.state.app.sidebar.opened) {
          this.toggleSideBar()
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  // line-height: 50px;
  border-radius: 0px !important;
  display: flex;
  width: 100%;
  .headerSur {
    display: inline-block;
    // width: 40%;
    line-height: 50px;

    flex: 1;
    overflow: auto;
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    display: flex;
    align-items: center;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .sys-dw {
      font-size: 16px;
      font-weight: bold;
    }
    .avatar-container {
      // height: 50px;
      // margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;
        .user-avatar {
          width: 36px;
          height: 34px;
          border-radius: 50%;
        }
        .el-icon-caret-bottom {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
<style>
/*覆写一级菜单样式*/
.headerSur .el-tabs__header {
  margin: 0;
  margin-right: 10px;
}
.headerSur .el-tabs__nav-wrap::after {
  height: 0;
}
.headerSur .el-tabs__active-bar {
  height: 0;
}
.headerSur .el-tabs__item {
  font-size: 17px;
  height: 50px;
  line-height: 50px;
}
.headerSur .el-tabs__item.is-active {
  border-bottom: 2px solid #409eff;
}
.headerSur .el-tabs__nav {
  /* margin-top:-3px; */
  /* float: right; */
}
.headerSur .el-tabs__nav-prev {
  line-height: 50px;
}
.headerSur .el-tabs__item + .el-tabs__item {
  margin-left: 20px;
}
.headerSur .el-tabs__item {
  padding: 0;
}
.headerSur .el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2),
.el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
.el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  /* padding-left:20px; */
}
.headerSur .el-tabs--bottom .el-tabs__item.is-bottom:last-child,
.el-tabs--bottom .el-tabs__item.is-top:last-child,
.el-tabs--top .el-tabs__item.is-bottom:last-child,
.el-tabs--top .el-tabs__item.is-top:last-child {
  /* padding-right:20px; */
}
.headerSur .el-tabs__item:hover {
  /* color: white; */
  border-bottom: 2px solid #409eff;
}
.mar-top-20 {
  margin-top: 20px;
}
.wid160 {
  width: 160px;
}
@media (max-width: 800px) {
  .headerSur .menu-name {
    display: none;
  }
}
</style>

