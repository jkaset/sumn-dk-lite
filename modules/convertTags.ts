import { convertTag } from '../utils/helpers'

const ConvertTags = () => {
  Array.from(document.querySelectorAll('[dk-convert-tag]')).forEach((node: HTMLElement | Element) => {
    let desiredTag = node.getAttribute('dk-convert-tag')
    if (desiredTag !== '#' && desiredTag !== null ) {
      node = convertTag(node, desiredTag)
    } else {
      console.warn('Please specify desired tag')
    }
    if (desiredTag === 'button') {
      node.setAttribute('type', 'button')
    }
  })
}

export default ConvertTags
