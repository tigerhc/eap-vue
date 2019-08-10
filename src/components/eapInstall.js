import Vue from 'vue'
export default function eapInstall() {
  const files = require.context('@/components/', true, /^\.\/eap.*\/index.vue$/)
  files.keys().forEach((file) => {
    const f = files(file).default || files(file)
    if (f.name) {
      console.warn(f.name)
      Vue.component(f.name, f)
    }
  })
}
