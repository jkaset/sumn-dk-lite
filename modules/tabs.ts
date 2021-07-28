import { convertTag } from '../utils/helpers'

const keys = {
  end: 35,
  home: 36,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  delete: 46
}

const direction = {
  37: -1,
  38: -1,
  39: 1,
  40: 1
}

class DKTabs {
  element: HTMLElement
  tabs: HTMLElement[]
  panels: NodeListOf<Element>
  tablist: Element

  constructor(element: HTMLElement) {
    this.element = element
    const originalTabs = this.element.querySelectorAll('[dk-tabpanel-id]')
    originalTabs.forEach( (tab) => {
      tab = convertTag(tab, 'button')
    })

    this.tabs = Array.from(this.element.querySelectorAll('[dk-tabpanel-id]'))
    this.panels = this.element.querySelectorAll('[dk-tab-id]')
    this.tablist = this.element.querySelector('[dk-tablist]')

    this.create()
  }

  create = () => {
    this.tablist.setAttribute('role', 'tablist')
    this.tabs.forEach( (tab: any = {}, index) => {
      tab.index = index
      tab.setAttribute('role', 'tab')
      let tabpanelId = tab.getAttribute('dk-tabpanel-id')
      tab.setAttribute('aria-controls', tabpanelId)

      tab.addEventListener('click', this.clickEventListener, true)
      tab.addEventListener('keydown', this.keydownEventListener)
      tab.addEventListener('keyup', this.keyupEventListener)
      tab.addEventListener('focus', this.checkTabFocus.bind(this), true)

      if (index === 0) {
        this.activateTab(tab, false)
      }
    })
  }

  clickEventListener = (event: MouseEvent) => {
    let clickedTab = event.target as HTMLElement
    if((this.tabs).includes(clickedTab)){
      this.activateTab(clickedTab, false)
    }
  }

  keydownEventListener = (event: KeyboardEvent) => {
    let key = event.keyCode

    switch (key) {
      case keys.end:
        event.preventDefault()
        this.activateTab(this.tabs[this.tabs.length - 1])
        break
      case keys.home:
        event.preventDefault()
        this.activateTab(this.tabs[0])
        break

      case keys.up:
      case keys.down:
        this.determineOrientation(event)
        break
    }
  }

  keyupEventListener = (event: KeyboardEvent) => {
    let key = event.keyCode
    switch (key) {
      case keys.left:
      case keys.right:
        this.determineOrientation(event)
        break
    }
  }

  determineOrientation = (event: KeyboardEvent) => {
    let key = event.keyCode
    let vertical = this.tablist.getAttribute('aria-orientation') === 'vertical'
    let proceed = false

    if (vertical) {
      if (key === keys.up || key === keys.down) {
        event.preventDefault()
        proceed = true
      }
    }
    else {
      if (key === keys.left || key === keys.right) {
        proceed = true
      }
    }
    if (proceed) {
      this.switchTabOnArrowPress(event)
    }
  }

  switchTabOnArrowPress = (event: KeyboardEvent) => {
    const pressedKey = event.keyCode

    if (direction[pressedKey]) {
      let target = event.target as HTMLElement
      let index = this.tabs.indexOf(target)

      if (index !== undefined) {
        if (this.tabs[index + direction[pressedKey]]) {
          this.tabs[index + direction[pressedKey]].focus()
        }
        else if (pressedKey === keys.left || pressedKey === keys.up) {
          this.focusLastTab()
        }
        else if (pressedKey === keys.right || pressedKey === keys.down) {
          this.focusFirstTab()
        }
      }
    }
  }

  activateTab = (tab: HTMLElement, setFocus?: boolean) => {
    this.deactivateTabs()
    tab.removeAttribute('tabindex')
    tab.setAttribute('aria-selected', 'true')
    let controls = tab.getAttribute('aria-controls')
    let controlledTabpanel = document.getElementById(controls)
    if (controlledTabpanel !== null) {
      controlledTabpanel.removeAttribute('hidden')
    }
    if (setFocus === true) {
      tab.focus()
    }
  }

  deactivateTabs = () => {
    this.tabs.forEach( (tab) => {
      tab.setAttribute('tabindex', '-1')
      tab.setAttribute('aria-selected', 'false')
      tab.removeEventListener('focus', this.checkTabFocus)
    })
    this.panels.forEach( (panel) => {
      panel.setAttribute('hidden', 'hidden')
    })
  }

  focusFirstTab = () => {
    this.tabs[0].focus()
  }

  focusLastTab = () => {
    this.tabs[this.tabs.length - 1].focus()
  }

  checkTabFocus(event: FocusEvent & { target: HTMLElement }) {

    const focused = document.activeElement
    let tgt = event.target

    if (tgt === focused) {

      this.tabs.forEach( (tab) => {
        tab.setAttribute('tabindex', '-1')
        tab.setAttribute('aria-selected', 'false')
        tab.removeEventListener('focus', this.checkTabFocus)
      })

      this.panels.forEach( (panel) => {
        panel.setAttribute('hidden', 'hidden')
      })

      tgt.removeAttribute('tabindex')
      tgt.setAttribute('aria-selected', 'true')

      let controls = tgt.getAttribute('aria-controls')
      let controlledTabpanel = document.getElementById(controls)

      if (controlledTabpanel !== null) {
        controlledTabpanel.removeAttribute('hidden')
      }

      tgt.focus()

    }
  }
}

const Tabs = () => {
  Array.from(document.querySelectorAll('[dk-tabs]')).forEach((tabgroup) => {
    new DKTabs(tabgroup as HTMLElement)
  })
}

export default Tabs
