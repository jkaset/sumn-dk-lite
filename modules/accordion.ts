import { convertTag } from '../utils/helpers'

const ENTER_KEY = 'Enter'

const adjustExpanded = function (element: Element, expanded: string) {
  element.setAttribute('aria-expanded', expanded)
}

const isExpanded = function (element: Element) {
  return element.getAttribute('aria-expanded') === 'true'
}

const initialToggleExpanded = function (toggle: Element) {
  if (toggle.hasAttribute('aria-expanded')) return

  adjustExpanded(toggle, 'false')
}

const closeAccordion = function (toggle: Element) {
  adjustExpanded(toggle, 'false')
}

const openAccordion = function (toggle: Element, group: Element | null) {
  if (!group) {
    return adjustExpanded(toggle, 'true')
  }

  group.querySelectorAll('[aria-expanded="true"]').forEach((openItem) => {
    adjustExpanded(openItem, 'false')
  })

  setTimeout(() => {
    adjustExpanded(toggle, 'true')
  }, 375)
}

const addToggleEventListener = function (toggle: Element, group: Element | null) {
  toggle.addEventListener('click', function (_event: MouseEvent) {
    isExpanded(toggle) ? closeAccordion(toggle) : openAccordion(toggle, group)
  })
}

const addAccordionEventListener = function (accordion: Element, toggle: Element, group: Element | null) {
  accordion.addEventListener('keydown', function (event: KeyboardEvent) {
    if (event.key === ENTER_KEY && event.target === toggle) {
      event.preventDefault()
      isExpanded(toggle) ? closeAccordion(toggle) : openAccordion(toggle, group)
    }
  })
}

const Accordion = () => {
  document.querySelectorAll('[dk-accordion]').forEach((accordion: HTMLElement) => {
    const toggle: Element = convertTag(accordion.children[0], 'button')
    const group: HTMLElement | null = accordion.closest('[dk-accordion-group]')
    initialToggleExpanded(toggle)
    addToggleEventListener(toggle, group)
    addAccordionEventListener(accordion, toggle, group)
  })
}

export default Accordion
