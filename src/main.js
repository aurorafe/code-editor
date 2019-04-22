import 'normalize.css';
import './styles/index.scss'; // global css
import 'element-ui/lib/theme-chalk/index.css';

import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import MojiMap from '../src';
import App from './App';
import router from './router';
import store from './store';

Vue.use(VueRouter);
Vue.use(ElementUI, {
  size: 'mini',
});
Vue.use(MojiMap);

// 开启debug模式
Vue.config.debug = true;

const app = new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');

export default app;
