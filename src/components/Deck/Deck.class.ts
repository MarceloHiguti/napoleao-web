import { NUMBERS, SUITS } from '../../constants/deckCard.const';
import { createDeck, drawCard, shuffleDeck } from '../../utils/card.util';
import { DeckCard, DeckCard as DeckCardClass } from '../DeckCard/DeckCard.class';
import { DeckConstructor } from './Deck.model';

export class Deck {
  cards: DeckCard[];

  constructor({ numbers = NUMBERS, suits = SUITS, extraCards }: DeckConstructor) {
    const deck = createDeck({ numbers, suits, extraCards });
    this.cards = deck.map(({ key, suit, value }) => new DeckCardClass({ ownerId: '', key, suit, value }));
    this.cards = this.shuffle();
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
    const { cardsDrew, deckPile } = drawCard({ deck: this.cards, numberToDraw: number });
    this.cards = deckPile as DeckCard[];

    return cardsDrew;
  }

  shuffle() {
    return shuffleDeck(this.cards);
  }
}
