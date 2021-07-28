import { convertTag } from '../utils/helpers'

class DKCard {
  card: HTMLElement
  cardFront: Element

  constructor(card: HTMLElement) {

    this.card = card

    // each card should be a list item
    if (this.card.tagName !== 'LI') {
      console.warn('Cards should be list items')
    }

    // convert card FRONTS to buttons
    this.cardFront = card.querySelector('[dk-card-front]') as HTMLElement
    if (!this.cardFront) {
      console.warn('Missing dk-card-front')
    }
    this.cardFront = convertTag(this.cardFront, 'button')
    this.cardFront.setAttribute('type', 'button')
    this.cardFront.setAttribute('tabindex', '0')

    // give cardFront aria-label="Learn more about {card front content}"
    let cardFrontContent = this.cardFront.textContent || ''
    this.cardFront.setAttribute('aria-label', 'Learn more about ' + cardFrontContent)

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
  Array.from(document.querySelectorAll('[dk-card]')).forEach( (card) => {
    new DKCard(card as HTMLElement)
  })
}

export default Cards
