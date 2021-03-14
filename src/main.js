import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
// import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false

// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: 'http://localhost:3000',
//   vuex: {
//       store,
//       actionPrefix: 'SOCKET_',
//       mutationPrefix: 'SOCKET_'
//   },
//   options: { path: "/my-app/" } //Optional options
// }));

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
