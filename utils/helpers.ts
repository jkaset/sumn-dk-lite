/* eslint-disable */
export const focusableSelectors = [
  'a[href]:not([tabindex^="-"])',
  'area[href]:not([tabindex^="-"])',
  'input:not([type="hidden"]):not([type="radio"]):not([disabled]):not([tabindex^="-"])',
  'input[type="radio"]:not([disabled]):not([tabindex^="-"]):checked',
  'select:not([disabled]):not([tabindex^="-"])',
  'textarea:not([disabled]):not([tabindex^="-"])',
  'button:not([disabled]):not([tabindex^="-"])',
  'iframe:not([tabindex^="-"])',
  'audio[controls]:not([tabindex^="-"])',
  'video[controls]:not([tabindex^="-"])',
  '[contenteditable]:not([tabindex^="-"])',
  '[tabindex]:not([tabindex^="-"])'
]

export const convertTag = (el: Element, tag: string) => {
  const newElement: Element = document.createElement(tag)
  newElement.innerHTML = el.innerHTML
  Array.from(el.attributes).forEach((attr) => {
    newElement.setAttribute(attr.name, attr.value)
  })
  el.parentNode?.replaceChild(newElement, el)
  return newElement
}

// https://gist.github.com/patrickfox/ee5a0d093e0ab9f76441f8339ab4b8e1
export const access = (el: HTMLElement, placeFocusBefore: string | boolean) => {
  let focusMethod: any, ogti: string, tempEl: HTMLElement

  const onblurEl = function(e) {
    if (el.getAttribute('data-ogti')) {
      el.setAttribute('tabindex', ogti);
    } else {
      el.removeAttribute('tabindex');
    }
    el.removeAttribute('data-ogti');
    el.removeEventListener('focusout', focusMethod);
  };
  const onblurTempEl = function(e) {
    tempEl.removeEventListener('focusout', focusMethod);
    tempEl.parentNode.removeChild(tempEl);
  };
  const focusEl = function(theEl: HTMLElement) {
    theEl.setAttribute('tabindex', '-1');
    theEl.addEventListener('focusout', focusMethod);
    theEl.focus();
  };
  focusMethod = onblurEl;
  if (placeFocusBefore) {
    tempEl = document.createElement('span');
    if (typeof placeFocusBefore === 'string') {
      tempEl.innerHTML = placeFocusBefore;
    }
    tempEl.setAttribute('style', 'position: absolute;height: 1px;width: 1px;margin: -1px;padding: 0;overflow: hidden;clip: rect(0 0 0 0);border: 0;');
    tempEl = el.parentNode.insertBefore(tempEl, el);
    focusMethod = onblurTempEl;
    focusEl(tempEl);
  } else {
    ogti = el.getAttribute('tabindex');
    if (ogti) {
      el.setAttribute('data-ogti', ogti);
    }
    focusEl(el);
  }
}

export function throttle(callbackFunction: Function, limit: number) {
  let tick = false
  return function() {
    if(!tick) {
      callbackFunction()
      tick = true
      setTimeout( function() {
        tick = false
      }, limit)
    }
  }
}
