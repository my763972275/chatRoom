import Vue from 'vue'
import App from './App'
//引入socket模块
import io from './components/socket/weapp.socket.io.js'
Vue.config.productionTip = false
Vue.prototype.serverUrl = 'http://192.168.0.105:3000'
Vue.prototype.socket = io('http://192.168.0.105:8082')

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
