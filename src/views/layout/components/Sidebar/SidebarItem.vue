<template>
  <div class="menu-wrapper">

    <template v-if="!item.children" >
      <app-link :to="resolvePath(item)">
        <el-menu-item :index="item.name" :class="{'submenu-title-noDropdown':!isNest}">
          <item v-if="item.meta" :icon="item.meta.icon||'meun'" :title="generateTitle(item.meta.title)" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="submenu" index="1">
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta.icon" :title="generateTitle(item.meta.title)" />
      </template>

      <template v-for="child in item.children" v-if="!child.hidden">
        <sidebar-item
          v-if="child.children&&child.children.length>0"
          :is-nest="true"
          :item="child"
          :key="child.path"
          :base-path="resolveBasePath(child.path)"
          class="nest-menu" />

        <app-link v-else :to="resolvePath(child)" :key="child.name">
          <el-menu-item :index="child.name">
            <item v-if="child.meta" :icon="child.meta.icon" :title="generateTitle(child.meta.title)" />
          </el-menu-item>
        </app-link>
      </template>
    </el-submenu>

  </div>
</template>

<script>
import path from 'path'
import { generateTitle } from '@/utils/i18n'
import { isExternal } from '@/utils'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: null,
      secondBase: ''
    }
  },
  mounted() {
    // console.info(this.item)
  },
  methods: {
    // hasOneShowingChild(children, parent) {
    //   const showingChildren = children.filter(item => {
    //     if (item.hidden) {
    //       return false
    //     } else {
    //       // Temp set(will be used if only has one showing child)
    //       this.onlyOneChild = item
    //       return true
    //     }
    //   })

    //   // When there is only one child router, the child router is displayed by default
    //   if (showingChildren.length === 1) {
    //     return true
    //   }

    //   // Show parent if there are no child router to display
    //   if (showingChildren.length === 0) {
    //     this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
    //     return true
    //   }

    //   return false
    // },
    resolveRoute(item) {

    },
    resolvePath(item) {
      const routePath = item.path
      if (this.isExternalLink(routePath)) {
        return { path: routePath }
      }
      return {
        name: item.component || item.name // 为了方便编码  取用数据库配置的组件路径作为跳转参数 route.push({name:"xxxx"})
      }
      // path.resolve(this.basePath, routePath)
    },
    resolveBasePath(routePath) {

    },
    isExternalLink(routePath) {
      return isExternal(routePath)
    },
    resolveNewPath(item) {
      return path.resolve(this.basePath, item.path)
    },
    generateTitle
  }
}
</script>
<style scoped>
.menu-wrapper {
  margin-left: 5px;
}
</style>

