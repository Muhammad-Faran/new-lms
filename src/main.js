import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css'; // Add this line
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './utils/bootstrapaxios';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';


createApp(App)
  .use(router)
  .use(ElementPlus)
  .mount('#app');
