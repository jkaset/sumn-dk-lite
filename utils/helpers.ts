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
  '[tabindex]:not([tabindex^="-"])',
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
export const access = (el, place_focus_before) => {
  var focus_el, focus_method, ogti, onblur_el, onblur_temp_el, temp_el;
  onblur_el = function(e) {
    if (el.getAttribute('data-ogti')) {
      el.setAttribute('tabindex', ogti);
    } else {
      el.removeAttribute('tabindex');
    }
    el.removeAttribute('data-ogti');
    el.removeEventListener('focusout', focus_method);
  };
  onblur_temp_el = function(e) {
    temp_el.removeEventListener('focusout', focus_method);
    temp_el.parentNode.removeChild(temp_el);
  };
  focus_el = function(the_el) {
    the_el.setAttribute('tabindex', '-1');
    the_el.addEventListener('focusout', focus_method);
    the_el.focus();
  };
  focus_method = onblur_el;
  if (place_focus_before) {
    temp_el = document.createElement('span');
    if (typeof place_focus_before === 'string') {
      temp_el.innerHTML = place_focus_before;
    }
    temp_el.setAttribute('style', 'position: absolute;height: 1px;width: 1px;margin: -1px;padding: 0;overflow: hidden;clip: rect(0 0 0 0);border: 0;');
    temp_el = el.parentNode.insertBefore(temp_el, el);
    focus_method = onblur_temp_el;
    focus_el(temp_el);
  } else {
    ogti = el.getAttribute('tabindex');
    if (ogti) {
      el.setAttribute('data-ogti', ogti);
    }
    focus_el(el);
  }
}