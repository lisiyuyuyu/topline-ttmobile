// 导入了vue
import Vue from 'vue'
// 导入了 vuex
import Vuex from 'vuex'
// 导入 userLocal
import { setUserLocal, getUserLocal } from '@/utils/userlocal.js'
// 使用 Vuex
Vue.use(Vuex)
// 创建并导出 一个仓库 对象
export default new Vuex.Store({
  // 统一管理项目中的公共数据
  state: {
    // 查询用户唯一标识 token
    user: getUserLocal()
  },
  // 修改 state 中的数据
  mutations: {
    setUser: function (state, obj) {
      // 赋值给 state 中的 user
      state.user = obj
      // 存储到 localStorage 中
      setUserLocal(obj)
    }
  }
})
