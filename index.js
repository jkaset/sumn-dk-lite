import App from './app'

const isStaging = window.location.host.match(/webflow.io/)

if (isStaging && !window.__DK__) {
  const script = document.createElement('script')
  script.src = 'http://localhost:1234/index.js'

  document.body.appendChild(script)
  window.__DK__ = true

  script.onload = () => {
    console.log('🙊 DK Lite Started')
  }

  script.onerror = App()
} else {
  App()
}

export default null
