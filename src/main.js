import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载vant组件库
import Vant from 'vant'

// 加载全局样式
import './styles/index.less'
// 加载vant样式
import 'vant/lib/index.css'
// 动态设置rem基准值
import 'amfe-flexible'

// 加载dayjs初始化配置
import './utils/dayjs.js'

// 注册使用vant组件
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
