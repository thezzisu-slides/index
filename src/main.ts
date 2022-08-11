import { createApp } from 'vue'
import { Quasar } from 'quasar'
import quasarIconSet from 'quasar/icon-set/mdi-v6'
import '@quasar/extras/mdi-v6/mdi-v6.css'
import 'quasar/src/css/index.sass'
import App from 'src/App.vue'
import 'src/styles/index.scss'
import 'src/styles/overrides.scss'

const app = createApp(App)

app.use(Quasar, {
  plugins: {},
  iconSet: quasarIconSet
})

app.mount('#app')
