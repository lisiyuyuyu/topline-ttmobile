// 导入了 vue
import Vue from 'vue'
// 导入了 vue-router
import VueRouter from 'vue-router'
// 在vue中 使用VueRouter
Vue.use(VueRouter)
const routes = [
  // 路由重定向
  {
    path: '/',
    redirect: '/login'
  },
  // 使用vant的使用
  {
    path: '/usevant',
    name: 'usevant',
    component: () => import('../views/usevant')
  },
  // 登录路由
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login')
  },
  // 布局的路由
  {
    path: '/layout',
    name: 'layout',
    component: () => import('../views/layout'),
    children: [
      // 首页路由
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/home')
      },
      // 搜索页面
      {
        path: '/search',
        name: 'search',
        component: () => import('../views/search')
      }
    ]
  }
]

// 创建一个路由实例
const router = new VueRouter({
  routes
})
// 导出路由实例
export default router
