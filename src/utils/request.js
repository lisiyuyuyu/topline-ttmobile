// 封装所有与 axios 相关的逻辑
// 改造为一个插件

// 导入 axios
import axios from 'axios'
// 导入 store
import store from '@/store'
// 导入 JSON-bigint
import JSONBig from 'json-bigint'

// 创建一个 axios实例
const instance = axios.create({
  // 设置一个统一的请求的基准地址
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/'
})

// 设置拦截器
// 设置一个请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 设置请求的 token
    // config 所有的请求信息
    // 判断用户是否登录：判断 store 中的 state 中的user是否存在
    let user = store.state.user
    if (user) {
      // 向请求头中添加 token
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function (error) {
    // 错误处理
    return Promise.reject(error)
  }
)

// 设置一个响应拦截器
instance.interceptors.response.use(
  function (response) {
    // response 服务器响应回来的数据
    return response.data.data
  },
  function (error) {
    // 错误处理
    return Promise.reject(error)
  }
)

// 再创建一个 axios 实例
const instance2 = axios.create({
  // 设置一个统一的请求的基准地址
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_1/',
  transformResponse: [
    function (data) {
      try {
        return JSONBig.parse(data)
      } catch (err) {
        console.log(err)
        return data
      }
    }
  ]
})

// 设置拦截器
// 设置一个请求拦截器
instance2.interceptors.request.use(
  function (config) {
    // 设置请求的 token
    // config 所有的请求信息
    // 判断用户是否登录：判断 store 中的 state 中的user是否存在
    let user = store.state.user
    if (user) {
      // 向请求头中添加 token
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function (error) {
    // 错误处理
    return Promise.reject(error)
  }
)

// 设置一个响应拦截器
instance2.interceptors.response.use(
  function (response) {
    // response 服务器响应回来的数据
    return response.data.data
  },
  function (error) {
    // 错误处理
    return Promise.reject(error)
  }
)

// 创建一个插件对象
const Myplugs = {}
// 添加一个 Install 方法
// Vue：构造器
Myplugs.install = function (Vue) {
  // 添加逻辑
  // 将 axios 实例挂载到 vue的元素中
  Vue.prototype.$http = instance
  // 将 axios 实例2 挂载到 vue的元素中
  Vue.prototype.$http2 = instance2
}

// 暴露插件对象
export default Myplugs
