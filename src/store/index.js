import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state: {
    // user是一个对象,包含当前登录的用户信息
    // user: null
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
    user: getItem(TOKEN_KEY)
  },
  getters: {},
  mutations: {
    setUser(state, data) {
      state.user = data
      // 本地存储
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {},
  modules: {}
})
