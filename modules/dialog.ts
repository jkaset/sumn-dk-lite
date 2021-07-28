import Cookies from 'js-cookie'
import DKDialog from './dk_dialog'

class Dialog {
  element: HTMLElement
  dkDialog: DKDialog
  cookie: Boolean
  modal: Boolean
  modalItself: null | HTMLElement
  _id: string

  constructor(element: HTMLElement) {
    this.element = element
    this.dkDialog = new DKDialog({
      element,
      focusTrapQuery: '[dk-dialog]',
    })
    this.cookie = this.element.hasAttribute('dk-dialog-cookies')
    this._id = this.element.id

    this.dkDialog.on('create', this.modalConstruction)
    this.dkDialog.on('create', this.checkCookie)
    this.dkDialog.on('create', this.ensureRole)
    this.dkDialog.on('create', this.handleNormalOpeners)
    this.dkDialog.on('create', this.handleLinkOpeners)
    this.dkDialog.on('create', this.handleClosers)

    this.dkDialog.on('show', this.handleDialogShow)

    this.dkDialog.on('hide', this.handleDialogHide)

    this.dkDialog.create()
  }

  modalConstruction = () => {
    this.modal = this.element.hasAttribute('dk-dialog-modal')
    if (this.modal) {
      this.modalItself = document.querySelector('[dk-modal-itself]') || null
      this.element.setAttribute('aria-modal', 'false')
    }
    this.element.setAttribute('aria-hidden', 'true')
  }

  checkCookie = () => {
    if (!this.cookie) return

    if (Cookies.get('CookieConsent')) {
      this.dkDialog.shown = true
      this.dkDialog.hide(null)
    } else {
      this.dkDialog.shown = false
      this.dkDialog.show(null)
    }
  }

  ensureRole = () => {
    if (this.element.hasAttribute('role')) return

    this.element.setAttribute('role', 'dialog')
  }

  handleNormalOpeners = () => {
    Array.from(document.querySelectorAll(`[dk-dialog-show="${this._id}"]`)).forEach((opener) => {
      opener.addEventListener('click', this.dkDialog.show)
    })
  }

  handleLinkOpeners = () => {
    Array.from(document.querySelectorAll(`a[href="#${this._id}"]`)).forEach((linkOpener) => {
      linkOpener.addEventListener('click', this._linkShow)
    })
  }

  handleClosers = () => {
    Array.from(this.element.querySelectorAll('[dk-dialog-hide]'))
      .concat(Array.from(document.querySelectorAll(`[dk-dialog-hide="${this._id}"]`)))
      .forEach((closer) => {
        closer.addEventListener('click', this.dkDialog.hide)
        if (this.cookie === true) {
          closer.addEventListener('click', (event) => {
            Cookies.set('CookieConsent', true, {
              expires: 365 * 40,
            })
            this.dkDialog.hide(event)
          })
        }
      })
  }

  handleDialogShow = () => {
    if (this.modal) {
      this.element.setAttribute('aria-modal', 'true')
      document.body.setAttribute('style', 'overflow: hidden; cursor: pointer;')
      document.addEventListener('click', this.closeOnOutsideClick, true)
    }
    this.element.classList.add('open')
    this.element.removeAttribute('aria-hidden')
  }

  handleDialogHide = () => {
    if (this.modal) {
      this.element.setAttribute('aria-modal', 'false')
      document.body.removeAttribute('style')
      document.removeEventListener('click', this.closeOnOutsideClick, true)
    }

    this.element.classList.remove('open')
    this.element.setAttribute('aria-hidden', 'true')
  }

  _linkShow = (event: Event) => {
    event.stopPropagation()
    this.dkDialog.show(event)
    return this
  }

  closeOnOutsideClick = (event: MouseEvent) => {
    let isClickInside = event.target instanceof HTMLElement ? this.modalItself.contains(event.target) : null
    if (!isClickInside) {
      this.dkDialog.hide(event)
    }
  }
}

function DialogCreator() {
  Array.from(document.querySelectorAll('[dk-dialog]')).forEach((element) => {
    new Dialog(element as HTMLElement)
  })
}

export default DialogCreator
