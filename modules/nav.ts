import DKDialog from './dk_dialog'
import { convertTag } from '../utils/helpers'

class DKNav {
  element: HTMLElement
  dkDialog: DKDialog
  _menu: DKNav['menu']
  _mediaQuery: DKNav['mediaQuery']
  _navToggle: DKNav['navToggle']
  _id: string

  constructor(element: HTMLElement) {
    this.element = element
    this.dkDialog = new DKDialog({
      element,
      focusTrapQuery: '[dk-nav]',
    })
    this.menu = element.querySelector(`#${element.getAttribute('dk-nav')}`)
    this._id = this.element.getAttribute('dk-nav') || this.element.id

    this.dkDialog.on('create', this.toggleCreation)
    this.dkDialog.on('create', this.menuCreation)
    this.dkDialog.on('create', this.dropdownToggleCreation)
    this.dkDialog.on('create', this.handleClosers)

    this.dkDialog.on('show', this.handleShow)

    this.dkDialog.on('hide', this.handleHide)

    this.dkDialog.create()
  }

  toggleCreation = (_event) => {
    convertTag(this.element.querySelector('[dk-nav-toggle]'), 'button')
    this.navToggle?.setAttribute('type', 'button')
    this.navToggle?.addEventListener('click', this.toggle)
    this.navToggle?.addEventListener('keyup', this.dkDialog.bindButtonKeypress)
  }

  toggle = (event: Event) => {
    if (this.shown) {
      this.hide(event)
    } else {
      this.show(event)
    }
  }

  menuCreation = (_event) => {
    if (this.mobile) {
      this.menu?.setAttribute('aria-hidden', 'true')
    }

    let timeoutFunctionId
    window.addEventListener('resize', (event) => {
      clearTimeout(timeoutFunctionId)
      timeoutFunctionId = setTimeout(() => {
        if (this.shown) this.hide(event)
        if (!this.mobile) this.menu?.removeAttribute('aria-hidden')
        if (this.mobile && !this.shown) this.menu?.setAttribute('aria-hidden', 'true')
      }, 350)
    })
  }

  dropdownToggleCreation = (_event: Event) => {
    const dropdownToggle = this.element.querySelector('.a-nav__link.special')
    if (!dropdownToggle) return

    dropdownToggle.addEventListener('click', (event) => {
      event.preventDefault()
      if (this.mobile) {
        dropdownToggle?.parentElement?.classList.toggle('open')
      }
    })
  }

  handleClosers = () => {
    Array.from(document.querySelectorAll('[dk-nav-hide]'))
      .concat(Array.from(document.querySelectorAll(`[dk-nav-hide="${this._id}"]`)))
      .forEach((closer) => {
        closer.setAttribute('aria-label', 'Close menu')
        closer.addEventListener('click', this.dkDialog.hide)

        // if (closer.getAttribute('role') !== 'button') return
        // closer.addEventListener('keydown', this.dkDialog.bindButtonKeypress)
      })
  }

  handleShow = (_event) => {
    this.element.classList.add('open')
    this.menu?.removeAttribute('aria-hidden')
    this.navToggle?.setAttribute('aria-expanded', 'true')
    this.navToggle?.setAttribute('aria-label', 'Close menu')
    // Array.from(this.element.querySelectorAll('[dk-nav-hide]')).forEach((closer) => {

    // })
    document.body.setAttribute('style', 'overflow: hidden;')
    document.addEventListener('click', this.closeOnOutsideClick, true)
  }

  handleHide = (_event) => {
    this.element.classList.remove('open')
    this.menu?.setAttribute('aria-hidden', 'true')
    this.navToggle?.setAttribute('aria-expanded', 'false')
    this.navToggle?.setAttribute('aria-label', 'Open menu')
    document.body.removeAttribute('style')
    document.removeEventListener('click', this.closeOnOutsideClick, true)
  }

  show(event: Event) {
    this.dkDialog.show(event)
  }

  hide(event: Event) {
    this.dkDialog.hide(event)
  }

  closeOnOutsideClick = (event: MouseEvent) => {
    let isClickInside = event.target instanceof HTMLElement ? this.dkDialog.$el.contains(event.target) : null
    if (!isClickInside) {
      this.dkDialog.hide(event)
    }
  }

  get mobile() {
    return !this.mediaQuery?.matches
  }

  get mediaQuery(): MediaQueryList | null {
    if (this._mediaQuery) return this._mediaQuery

    let navBreakpoint = this.element.getAttribute('dk-nav-breakpoint')
    if (navBreakpoint === null) navBreakpoint = '991'
    const navBreakpointForMediaQuery = parseInt(navBreakpoint) + 1

    this._mediaQuery = window.matchMedia(`(min-width: ${navBreakpointForMediaQuery} px)`)
    return this._mediaQuery
  }

  get shown() {
    return this.dkDialog.shown
  }

  get menu(): HTMLElement | null {
    return this._menu
  }

  set menu(menu) {
    this._menu = menu
  }

  get navToggle(): HTMLElement | null {
    if (this._navToggle) return this._navToggle
    this._navToggle = document.querySelector('[dk-nav-toggle]')
    return this._navToggle
  }
}

function Nav() {
  Array.from(document.querySelectorAll('[dk-nav]')).forEach(function (element: HTMLElement) {
    new DKNav(element)
  })
}

export default Nav
