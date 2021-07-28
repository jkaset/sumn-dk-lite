import { access } from '../utils/helpers'

const Anchors = () => {
  Array.from(document.querySelectorAll('[href^="#"]:not([href="#"])')).forEach( (anchorLink: Element) => {
    anchorLink.addEventListener('click', function() {
      const section = document.querySelector(anchorLink.getAttribute('href'))
      if (section) {
        const sectionHeading = section.querySelector('h1' || 'h2' || 'h3' || 'h4' || 'h5' || 'h6')
        if (sectionHeading) {
          access(sectionHeading, true)
        }
        else {
          access(section, true)
        }
      }
    })
  })
}

export default Anchors