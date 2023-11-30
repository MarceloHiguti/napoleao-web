import { NUMBERS, SUITS } from '../../constants/deckCard.const';
import { createDeck } from '../../utils/card.util';
import { DeckCard, DeckCard as DeckCardClass } from '../DeckCard/DeckCard.class';
import { DeckConstructor } from './Deck.model';

export class Deck {
  cards: DeckCard[];

  constructor({ numbers = NUMBERS, suits = SUITS, extraCards }: DeckConstructor) {
    const deck = createDeck({ numbers, suits, extraCards });
    this.cards = deck.map(({ key, suit, value }) => new DeckCardClass({ key, suit, value }));
    this.shuffle();
  }

  get getCards() {
    return this.cards;
  }

  get getCardsLength() {
    return this.cards.length;
  }

  set setCards(cards: DeckCard[]) {
    this.cards = cards;
  }

  drawCard(number = 1) {
    const returnCards = [];

    for (let i = number; i > 0; i--) {
      returnCards.push(this.cards.pop());
    }

    return returnCards;
  }

  shuffle() {
    let j, x, i;
    for (i = this.cards.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = x;
    }
  }
}
