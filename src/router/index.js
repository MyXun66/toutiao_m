import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由表
const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/index.vue')
  },
  {
    path: '/',
    // name: 'layout',
    component: () => import('@/views/layout/index.vue'),
    children: [
      // {
      //   path: '', // 默认子路由只能一个
      //   name: 'home',
      //   component: () => import('@/views/home/index.vue')
      // },
      {
        path: '/home', // 默认子路由只能一个
        name: 'home2',
        component: () => import('@/views/home/index.vue')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/index.vue')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/index.vue')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/index.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
