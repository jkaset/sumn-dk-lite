import { focusableSelectors } from '../utils/helpers'

const TAB_KEY = 'Tab'
const ESCAPE_KEY = 'Escape'
const SPACE_KEY = ' '
const ENTER_KEY = 'Enter'

interface DKDialogOptions {
  element: HTMLElement
  focusTrapQuery: string
}

class DKDialog {
  $el: Element
  shown: Boolean
  _focusTrapQuery: string
  _previouslyFocused: null | DKDialog['$el']
  _listeners: {} | { string: [Function] }

  constructor({ element, focusTrapQuery }: DKDialogOptions) {
    this.$el = element
    this.shown = false
    this._focusTrapQuery = focusTrapQuery
    this._previouslyFocused = null
    this._listeners = {}
  }

  /**
   * Set up everything necessary for the dialog to be functioning
   * @return {this}
   */
  create() {
    // Execute all callbacks registered for the `create` event
    this._fire('create', null)

    return this
  }

  /**
   * Show the dialog element, disable all the targets (siblings), trap the
   * current focus within it, listen for some specific key presses and fire all
   * registered callbacks for `show` event
   */
  show = (event: null | Event) => {
    // If the dialog is already open, abort
    if (this.shown) {
      return this
    }

    // Keep a reference to the currently focused element to be able to restore
    // it later
    this._previouslyFocused = document.activeElement
    this.shown = true

    setFocusToFirstItem(this.$el)

    // Bind a focus event listener to the body element to make sure the focus
    // stays trapped inside the dialog while open, and start listening for some
    // specific key presses (TAB and ESC)
    document.body.addEventListener('focus', this._maintainFocus, true)
    document.addEventListener('keydown', this._bindKeypress)

    // Execute all callbacks registered for the `show` event
    this._fire('show', event)

    return this
  }

  /**
   * Hide the dialog element, enable all the targets (siblings), restore the
   * focus to the previously active element, stop listening for some specific
   * key presses and fire all registered callbacks for `hide` event
   */
  hide = (event: null | Event) => {
    // If the dialog is already closed, abort
    if (!this.shown) {
      return this
    }

    this.shown = false

    // If there was a focused element before the dialog was opened (and it has a
    // `focus` method), restore the focus back to it
    // See: https://github.com/KittyGiraudel/a11y-dialog/issues/108
    if (this._previouslyFocused && this._previouslyFocused.focus) {
      this._previouslyFocused.focus()
    }

    // Remove the focus event listener to the body element and stop listening
    // for specific key presses
    document.body.removeEventListener('focus', this._maintainFocus, true)
    document.removeEventListener('keydown', this._bindKeypress)

    // Execute all callbacks registered for the `hide` event
    this._fire('hide', event)

    return this
  }

  /**
   * Register a new callback for the given event type
   */
  on(type: string, handler: Function) {
    if (typeof this._listeners[type] === 'undefined') {
      this._listeners[type] = []
    }

    this._listeners[type].push(handler)

    return this
  }

  /**
   * Unregister an existing callback for the given event type
   */
  off(type: string, handler: Function) {
    var index = (this._listeners[type] || []).indexOf(handler)

    if (index > -1) {
      this._listeners[type].splice(index, 1)
    }

    return this
  }

  /**
   * Iterate over all registered handlers for given type and call them all with
   * the dialog element as first argument, event as second argument (if any).
   */
  _fire(type: string, event: null | Event) {
    var listeners = this._listeners[type] || []

    listeners.forEach(
      function (listener) {
        listener(this.$el, event)
      }.bind(this),
    )
  }

  /**
   * Event handler used when treating links as buttons
   */
  bindButtonKeypress = (event: KeyboardEvent) => {
    if (event.key === SPACE_KEY || event.key === ENTER_KEY) {
      event.preventDefault()
      if (!this.shown) {
        this.show(event)
      } else if (this.shown) {
        this.hide(event)
      }
    }
  }

  /**
   * Private event handler used when listening to some specific key presses
   * (namely ESCAPE and TAB)
   */
  _bindKeypress = (event: KeyboardEvent) => {
    // This is an escape hatch in case there are nested dialogs, so the keypresses
    // are only reacted to for the most recent one
    // if (!this.$el.contains(document.activeElement)) {
    //   console.log('whoops')
    //   return
    // }

    // If the dialog is shown and the ESCAPE key is being pressed, prevent any
    // further effects from the ESCAPE key and hide the dialog, unless its role
    // is 'alertdialog', which should be modal
    if (this.shown && event.key === ESCAPE_KEY && this.$el.getAttribute('role') !== 'alertdialog') {
      event.preventDefault()
      this.hide(event)
    }

    // If the dialog is shown and the TAB key is being pressed, make sure the
    // focus stays trapped within the dialog element
    if (this.shown && event.key === TAB_KEY) {
      trapTabKey(this.$el, event)
    }
  }

  /**
   * Private event handler used when making sure the focus stays within the
   * currently open dialog
   */
  _maintainFocus = (event: FocusEvent) => {
    const target = event.target as HTMLElement
    // If the dialog is shown and the focus is not within a dialog element (either
    // this one or another one in case of nested dialogs) or within an element
    // with the `dk-dialog-focus-trap-ignore` attribute, move it back to
    // its first focusable child.
    // See: https://github.com/KittyGiraudel/a11y-dialog/issues/177
    if (this.shown && !target.closest(this._focusTrapQuery) && !target.closest('[dk-dialog-ignore-focus-trap]')) {
      setFocusToFirstItem(this.$el)
    }
  }
}

/**
 * Convert a NodeList into an array
 */
function toArray(collection: NodeListOf<Element>) {
  return Array.from(collection)
}

/**
 * Query the DOM for nodes matching the given selector, scoped to context (or
 * the whole document)
 */
function $$(selector: string, context: Element) {
  return toArray((context || document).querySelectorAll(selector))
}

/**
 * Set the focus to the first element with `autofocus` or the first focusable
 * child of the given element
 */
function setFocusToFirstItem(node: Element) {
  var focusableChildren = getFocusableChildren(node)
  var focused = node.querySelector('[autofocus]') || focusableChildren[0]

  if (focused instanceof HTMLElement) {
    // timeout added to counteract css visibility transition length
    setTimeout(() => focused.focus(), 300)
  }
}

/**
 * Get the focusable children of the given element
 */
function getFocusableChildren(node: Element) {
  return $$(focusableSelectors.join(','), node).filter(function (child: HTMLElement) {
    return !!(child.offsetWidth || child.offsetHeight || child.getClientRects().length)
  })
}

/**
 * Trap the focus inside the given element
 *
 * @param {Element} node
 * @param {Event} event
 */
function trapTabKey(node: Element, event: KeyboardEvent) {
  const focusableChildren = getFocusableChildren(node)
  let focusedItemIndex = document.activeElement ? focusableChildren.indexOf(document.activeElement) : null

  // If the SHIFT key is being pressed while tabbing (moving backwards) and
  // the currently focused item is the first one, move the focus to the last
  // focusable item from the dialog element
  if (event.shiftKey && focusedItemIndex === 0) {
    focusableChildren[focusableChildren.length - 1].focus()
    event.preventDefault()
    // If the SHIFT key is not being pressed (moving forwards) and the currently
    // focused item is the last one, move the focus to the first focusable item
    // from the dialog element
  } else if (!event.shiftKey && focusedItemIndex === focusableChildren.length - 1) {
    focusableChildren[0].focus()
    event.preventDefault()
  }
}

export default DKDialog
