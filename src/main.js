// 导入了 vue
import Vue from 'vue'
// 导入了 App.vue(根组件)
import App from './App.vue'
// 导入了 router
import router from '@/router'
// 导入了 vuex
import store from '@/store'
// 导入 vant
// eslint-disable-next-line import/no-duplicates
import Vant, { Lazyload } from 'vant'
// 导入自己封装的插件
import Axiosplugs from '@/utils/request.js'
// 导入自己封装的登录插件
import loginPlugs from '@/utils/loginplugs'
// 导入第三方包 day.js
import dayjs from 'dayjs'
// 导入dayjs的插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入 dayjs 的中文包
import 'dayjs/locale/zh-cn'
// 导入 vant 的样式
import 'vant/lib/index.css'
// 导入字体图标
import '@/styles/index.css'

// 使用dayjs的插件
dayjs.extend(relativeTime)
// 使用中文包
dayjs.locale('zh-cn')
// 定义一个全局过滤器来处理时间
Vue.filter('relativetime', function (value) {
  return dayjs().from(dayjs(value))
})

// eslint-disable-next-line import/no-duplicates
// 在vue中 使用vant
Vue.use(Vant)

Vue.use(Lazyload)
// 在Vue中使用插件
// use 本质其实是调用 Axiosplugs 的 install 方法
Vue.use(Axiosplugs)
Vue.use(loginPlugs)
Vue.config.productionTip = false
// 创建一个vue实例
new Vue({
  router, // 加载 router
  store, // 加载 vuex
  // 将 App.vue渲染到 index.html 中的 id为app的元素上
  render: h => h(App)
}).$mount('#app')
// $mount()与属性 el 是一样的，都是用来让内容挂载到 index.html 中的 id为App的元素上
