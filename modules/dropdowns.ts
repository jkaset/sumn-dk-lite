import { convertTag } from '../utils/helpers'

const Dropdowns = () => {
  Array
    .from(document.querySelectorAll('[dk-dropdown-toggle]'))
    .forEach((toggle) => {
      let opened = false
      let mobileOnly = false

      if (!(toggle.getAttribute('dk-mobile-only') === null)) {
        mobileOnly = true
        let mobileBreakpoint = toggle.getAttribute('dk-mobile-only')
        if (mobileBreakpoint === '#') mobileBreakpoint = '991'
        const mobileBreakpointForMediaQuery = parseInt(mobileBreakpoint) + 1
        const mediaQuery = window.matchMedia(`(min-width: ${mobileBreakpointForMediaQuery}px)`)
        const isDesktop = () => {
          return mediaQuery.matches
        }
        if (isDesktop) {
          toggle.removeAttribute('aria-expanded')
        } else {
          toggle.setAttribute('aria-expanded', 'false')
        }
        let timeoutFunctionId
        window.addEventListener('resize', () => {
          clearTimeout(timeoutFunctionId)
          timeoutFunctionId = setTimeout(() => {
            if (isDesktop && opened) {
              closeDropdown()
              toggle.removeAttribute('aria-expanded')
            }
            if (isDesktop) toggle.removeAttribute('aria-expanded')
            if (!isDesktop && opened) {
              toggle.setAttribute('aria-expanded', 'true')
            }
          }, 350)
        })
      }

      let dropdownID = toggle.getAttribute('dk-dropdown-toggle')
      if (!(dropdownID === '#') && !(dropdownID === null)) {
        let dropdown = document.getElementById(dropdownID)
        if (!dropdown) return
        dropdown.setAttribute('role', 'menu')
        let menuLinks = dropdown.getElementsByTagName('a')
        Array.from(menuLinks).forEach((link) => {
          link.setAttribute('role', 'menuitem')
        })
      }
      toggle = convertTag(toggle, 'button')
      toggle.setAttribute('type', 'button')
      if (!mobileOnly) toggle.setAttribute('aria-expanded', 'false')

      toggle.addEventListener('click', (event) => {
        handleToggleClick(event)
      })

      const handleToggleClick = (event) => {
        event.preventDefault()
        if (!opened) {
          openDropdown()
        } else {
          closeDropdown()
        }
      }

      const openDropdown = () => {
        toggle.setAttribute('aria-expanded', 'true')
        toggle.parentElement?.classList.add('open')
        opened = true
      }

      const closeDropdown = () => {
        toggle.setAttribute('aria-expanded', 'false')
        toggle.parentElement?.classList.remove('open')
        opened = false
      }

    })
}

export default Dropdowns