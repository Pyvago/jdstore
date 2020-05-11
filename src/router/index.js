import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 表示将要访问的路径
  // from 代表由哪个路径跳转而来
  // next 是一个函数，表示放行
  //    next放行方式有两种：1、next()  2、next('/login') 强制跳转
  if (to.path === '/login') {
    next()
  } else {
    // 查看sessionstorage中是否有token
    const tokenStr = window.sessionStorage.getItem('token')
    if (tokenStr) {
      // token不为空，放行
      next()
    } else {
      // token为空，跳转至登陆页面
      next('/login')
      Vue.prototype.$message.error('您没有登陆或登陆时效已过期,请重新登陆')
    }
  }
})
export default router
