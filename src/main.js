import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

// 导入并配置axios
import axios from 'axios'
// 配置axios请求的基准路径
axios.defaults.baseURL = 'http://127.0.0.1:8700/api/private/v1/'

// 关于Vue配置请求拦截器和响应拦截器，
// 参考https://www.cnblogs.com/Jack-cx/p/12081745.html
// https://learnku.com/articles/37226 (重要)
axios.interceptors.request.use(config => {
  // 打印出来的是相对路径 >>login
  // console.log(config.url)
  // 这里做不做判断其实都可以，因为后端是不会对登陆请求做鉴权操作的
  if (config.url !== 'login') {
    const tokenStr = window.sessionStorage.getItem('token')
    if (tokenStr) {
      config.headers.Authorization = tokenStr
    }
    // 若sessionStorage中的token字段为空的话，请求拦截器不做处理
  }
  return config
})

// 设置响应拦截器，直接拿出返回对象中的data数据
// axios.interceptors.response.use(res => (res.data))
axios.interceptors.response.use(
  response => {
    // 未登录或会话已过期
    if (response.data.meta.status === 401) {
      // 重定向到登录页
      router.push('/login')
      Vue.prototype.$message.error('您没有登陆或登陆时效已过期,请重新登陆')
    }
    return response.data
  },
  error => {
    if (error.response.status === 500) {
      // 服务端异常
    }
    return Promise.reject(error) // 返回接口返回的错误信息
  }
)

// 把axios包挂载到Vue的原型对象上，这样就只需导入一次axios包之后每个组件中就都可以发送axios请求了
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
