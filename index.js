import App from './app'

const LOCAL_API_URL = 'http://localhost:1234'
const isStaging = window.location.host.match(/webflow.io/)

if (isStaging && !window.__DK__) {
  $.getScript(`${LOCAL_API_URL}/index.js`)
    .done(() => {
      process.env.NODE_ENV === 'production' || console.log('🙊 DK Lite Started')
      window.__DK__ = true
    })
    .fail(App)
} else {
  App()
}

export default null
