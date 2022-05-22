import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// import {
//   faHome,
//   faUser,
//   faUserPlus,
//   faSignInAlt,
//   faSignOutAlt
// } from '@fortawesome/free-solid-svg-icons';
// library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);
// Vue.component('font-awesome-icon', FontAwesomeIcon);

// const base = axios.create({baseURL: 'https://safibackend.azurewebsites.net'});
// Vue.prototype.$http = base;
axios.defaults.baseURL = 'https://safibackend-apim.azure-api.net/safi-finance/api/';
//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/json';

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(Vuex);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
