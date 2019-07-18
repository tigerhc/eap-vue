import Vue from 'vue'
import Router from 'vue-router'

// const _import = require('./_import_vue')

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/jeeweb-vue-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/oven/statusFull',
    component: () => import('@/views/screenfull/statusFull/index'),
    name: 'statusFull',
    hidden: true,
    meta: { title: '首页', icon: '', noCache: true }
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/a/b/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '*',
    component: () => import('@/views/errorPage/404')
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

/**
 * 处理路由信息
 *
 * @param routerMap
 */
/**
 * 匹配 views 文件夹下 所有非 components,layout,login 文件夹下的 index.vue
 */
const allModules = require.context('@/views/', true, /^((?!\/components\/|\/layout\/|\/login\/).)+\.vue$/, 'lazy')
const moduleComponents = {}
console.info(allModules.keys())
allModules.keys().forEach(file => {
  file.match(/\.(.*).vue/)
  const asyncCompt = () => allModules(file).then(r => r.default)
  moduleComponents['views' + RegExp.$1] = asyncCompt
})

// const isLeafe = (router) => {
//   return router && !router.children && router.type === 2
// }

const page404 = () => import('@/views/errorPage/404')
const routerView = () => import('@/components/RouterMeta')
export function processRouter(routerMap, isTopLevel = true) {
  const newRouters = routerMap.filter(router => {
    const component = router.component
    /**
     * 不处理权限按钮
     */
    if (router.type === '3') {
      return false
    }
    try {
      if (!isTopLevel) {
        router.path = router.path.replace('/', '')
      }
      if (component) {
        if (component === 'Layout') {
          router.component = Layout
          if (!isTopLevel) {
            router.component = routerView
          }
        } else if (!component.name) { // 判定是否数据库配置的组件(判定逻辑有待完善) 否则进行本地代码转化
          router.component && (router.name = router.component) // 用组件路径代替 路由name  业务代码可以使用 router.push({name:"数据库配置的组件路径"}) 进行跳转
          router.component = moduleComponents[router.component] || page404 // 没有找到本地组件设置404页面
        }
      } else {
        router.component = undefined
      }
    } catch (e) {
      router.component = page404
    }
    if (router.children && router.children.length) {
      for (const item of router.children) {
        if (item.children) {
          item.children = processRouter(item.children, false)
        }
      }
      router.children = processRouter(router.children, false)
    }
    return true
  })
  // console.info(JSON.stringify(newRouters,(key,val)=>{
  //   if(key==='component'){
  //     return val && val.name
  //   }
  //   return val
  // }))
  return newRouters
}

// export function processRouter_bac(routerMap) {
//   const newRouters = routerMap.filter(router => {
//     const component = router.component
//     try {
//       // router.name = router.path
//       console.info(router.path);
//       if (component) {
//         if (component === 'Layout') {
//           router.component = Layout
//         } else if (!component.name) {
//           router.component = _import(component)
//         }
//       } else {
//         router.component = undefined
//       }
//     } catch (e) {
//       router.component = () => import('@/views/errorPage/404')
//     }
//     if (router.children && router.children.length) {
//       for (const item of router.children) {
//         if (item.children) {
//           item.children = processRouter(item.children)
//         }
//       }
//       router.children = processRouter(router.children)
//     }
//     return true
//   })
//   console.info(JSON.stringify(newRouters,(key,val)=>{
//     if(key==='component'){
//       return val && val.name
//     }
//     return val
//   }))
//   return newRouters
// }
