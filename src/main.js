import 'normalize.css';
// import './styles/index.scss'; // global css

import Vue from 'vue';
import App from './App';


// 开启debug模式
Vue.config.debug = true;

const app = new Vue({
  render: h => h(App),
}).$mount('#app');

export default app;
