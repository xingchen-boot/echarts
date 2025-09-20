import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入字体文件
import './assets/font/iconfont.css'
import axios from 'axios'
import SocketService from './utils/socket_service'
import './assets/css/global.less'
SocketService.Instance.connect()
Vue.prototype.$socket = SocketService.Instance
axios.defaults.baseURL = 'http://127.0.0.1:8888/api'
// 挂载到Vue原型上
Vue.prototype.$http = axios

// 将全局echarts挂载到Vue原型上
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
