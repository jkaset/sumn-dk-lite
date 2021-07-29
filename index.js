import App from './app'

const LOCAL_JS_URL = 'http://localhost:1234/index.js'
const isStaging = window.location.host.match(/webflow.io/)

if (isStaging && !window.__DK__) {
  $.getScript(LOCAL_JS_URL)
    .done(() => {
      process.env.NODE_ENV === 'production' || console.log('🙊 DK Lite Started')
      window.__DK__ = true
    })
    .fail(App)
} else {
  App()
}

export default null
