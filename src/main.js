// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Bootstrap JS (툴팁, 팝오버 등에 필요)
import * as bootstrap from 'bootstrap'

// 기본 스타일 (있다면)
import './assets/main.css'

const app = createApp(App)

// Bootstrap을 전역에서 사용할 수 있도록 설정
app.config.globalProperties.$bootstrap = bootstrap

app.mount('#app')