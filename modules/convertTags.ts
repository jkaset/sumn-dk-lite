import { convertTag } from '../utils/helpers'

const ConvertTags = () => {
  const nodesToConvert = document.querySelectorAll('[dk-convert-tag]')
  for (let i = 0; i < nodesToConvert.length; i++) {
    let thisItem = nodesToConvert[i]
    let desiredTag = thisItem.getAttribute('dk-convert-tag')
    if (desiredTag !== '#' && desiredTag !== null ) {
      thisItem = convertTag(thisItem, desiredTag)
    }
    if (desiredTag === 'button') {
      thisItem.setAttribute('type', 'button')
    }
  }
}

export default ConvertTags
