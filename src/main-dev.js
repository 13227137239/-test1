import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './plugins/element.js'
import './assets/css/global.css'
import '../src/assets/fonts/iconfont.css'
import axios from 'axios'

import TreeTable from 'vue-table-with-tree-grid'


  // 导入富文本编辑器
  import VueQuillEditor from 'vue-quill-editor'
 //对应样式
  import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

//导入进度条包
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.response.use(config=>{
  NProgress.done();
  return config
})
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  NProgress.start();
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)
 
//注册富文本编辑器
Vue.use(VueQuillEditor)

//给全局挂载一个过滤器
Vue.filter('dateFormat',function(originVal){
 const dt =  new Date(originVal)
 const y = dt.getFullYear()+''
 const m = (dt.getMonth() +1 +'').padStart(2,"0")
 const d = (dt.getDate() +'').padStart(2,'0')
 const hh = (dt.getHours() +'').padStart(2,'0')
 const mm = (dt.getMinutes()+'').padStart(2,'0')
 const ss = (dt.getSeconds()+'').padStart(2,'0')

 return `${y}-${m}-${d}-${hh}-${mm}-${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
