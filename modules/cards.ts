import { convertTag } from '../utils/helpers'

class DKCard {

  constructor(card) {

    this.card = card

    // each card should be a list item
    if (this.card.tagName !== 'LI') {
      console.warn('Cards must be list items')
    }

    // convert card FRONTS to buttons
    this.cardFront = card.querySelector('[dk-card-front]')
    if (!this.cardFront) {
      console.warn('Missing dk-card-front')
    }
    this.cardFront = convertTag(this.cardFront, 'button')
    this.cardFront.setAttribute('role', 'button')
    this.cardFront.setAttribute('tabindex', '0')

    // give cardFront aria-label="Learn more about {card front content}"
    let cardFrontContent = this.cardFront.textContent || ''
    this.cardFront.setAttribute('aria-label', 'Learn more about how we help you ' + cardFrontContent)

    // cardFront is a button and receives keyboard focus
    this.cardFront.addEventListener('blur', this.blurEventListener.bind(this))
    this.cardFront.addEventListener('focus', this.focusEventListener.bind(this))

    this.card.addEventListener('click', this.clickEventListener.bind(this))

  }

  clickEventListener() {
    toggleCardFlip(this.card)
  }

  // cardFront is a button and receives keyboard focus
  // but card itself needs to get class of 'focused'
  // so we're passing in this.card instead of this.cardFront
  focusEventListener() {
    handleCardFocus(this.card)
  }
  blurEventListener() {
    handleCardBlur(this.card)
  }
}

const toggleCardFlip = (card) => {
  card.classList.toggle('flipped')
}

const handleCardFocus = (element) => {
  element.classList.add('focused')
}

const handleCardBlur = (element) => {
  element.classList.remove('focused')
  if(element.classList.contains('flipped')) {
    element.classList.remove('flipped')
  }
}

const Cards = () => {
  const notMobile = window.matchMedia('(min-width: 768px)')

  if(notMobile.matches) {
    document.querySelectorAll('[dk-card]').forEach( (card) => {
      new DKCard(card)
    })
  }
}

export default Cards
