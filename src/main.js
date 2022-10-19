import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/components/DynamicForm/icons'

import FormControls from './components/FormControls/index.js'
Vue.use( FormControls )

import '@/utils/antd';
import 'ant-design-vue/dist/antd.css';

Vue.config.productionTip = false
Vue.prototype.log = console.log

new Vue( {
  router,
  store,
  render: h => h( App )
} ).$mount( '#app' )

