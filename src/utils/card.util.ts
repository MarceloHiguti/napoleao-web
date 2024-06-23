import { Deck } from 'src/components/Deck/Deck.class';
import { DeckCardConstructor } from 'src/components/DeckCard/DeckCard.model';
import { PILE } from 'src/constants/deckCard.const';
import {
  BuildNumbersWithLabelsParams,
  CardType,
  CreateDeckParams,
  DeckType,
  DistributeCardsParams,
  DrawCardsParams,
  DrawCardsReturnValues,
  RecursiveDistributeCardsParams,
} from 'src/models/card.util.model';

export function createDeck({
  numbers,
  suits,
  extraCards,
  deckModifierCallback,
  deckNumber = 1,
}: CreateDeckParams): DeckCardConstructor[] {
  const deck: DeckCardConstructor[] = [];

  for (let suit of suits) {
    for (let number of numbers) {
      deck.push({
        ownerId: '',
        key: `${number}_${suit}_deck_${deckNumber}`,
        value: number,
        suit: suit,
      });
    }
  }

  if (!!extraCards) {
    deck.push({
      ownerId: '',
      key: `${extraCards.value}_${extraCards.suit}`,
      value: extraCards.value,
      suit: extraCards.suit,
      extraParams: extraCards?.extraParams ?? {},
    });
  }

  const finalDeck = deckModifierCallback?.(deck) ?? deck;

  return finalDeck;
}

function recursiveDistributeCards({
  deck,
  numberOfCards,
  numberOfPlayers,
  playerIndex,
  playersObject,
  playersCustomIndex,
}: RecursiveDistributeCardsParams): void {
  const { cardsDrew, deckPile } = drawCard({ deck, numberToDraw: numberOfCards });
  const isPileCards = playerIndex === numberOfPlayers;
  const playerCustomIndex = playersCustomIndex?.[playerIndex] ?? `${playerIndex}`;
  const indexString = isPileCards ? PILE : playerCustomIndex;
  playersObject[indexString] = cardsDrew;
  playersObject[indexString].forEach((card) => {
    card.ownerId = playerCustomIndex;
  });

  if (playerIndex < numberOfPlayers) {
    recursiveDistributeCards({
      deck: deckPile,
      numberOfCards,
      numberOfPlayers,
      playerIndex: playerIndex + 1,
      playersObject,
      playersCustomIndex,
    });
  }
}

export function distributeCards({
  deck,
  numberOfCards,
  numberOfPlayers,
  playersIndex,
}: DistributeCardsParams): Record<string, DeckType> {
  const playersObject: Record<string, DeckType> = {};
  const copyDeck = [...deck];
  if (deck instanceof Deck) {
    for (let i = 0; i < numberOfPlayers; i++) {
      const playerIndex = playersIndex?.[i] ?? `${i}`;
      playersObject[playerIndex] = deck.drawCard(numberOfCards);
      playersObject[playerIndex].forEach((card) => {
        card.ownerId = playerIndex;
      });
    }

    const cardsLeft = deck.getCardsLength;
    if (cardsLeft > 0) {
      playersObject[PILE] = deck.drawCard(cardsLeft);
    }
  } else {
    recursiveDistributeCards({
      deck: copyDeck,
      numberOfCards,
      numberOfPlayers,
      playerIndex: 0,
      playersObject,
      playersCustomIndex: playersIndex,
    });
  }

  return playersObject;
}

export function buildNumbersWithLabels({ numbers }: BuildNumbersWithLabelsParams): Record<string, string> {
  return numbers.reduce((acc, value) => {
    let numberWithLabel: Record<string, string> = {};

    switch (value) {
      case 1:
        numberWithLabel[value] = `A`;
        break;

      case 11:
        numberWithLabel[value] = `J`;
        break;

      case 12:
        numberWithLabel[value] = `Q`;
        break;

      case 13:
        numberWithLabel[value] = `K`;
        break;

      default:
        numberWithLabel[value] = `${value}`;
        break;
    }

    return { ...acc, ...numberWithLabel };
  }, {});
}

export function shuffleDeck<T>(cards: Array<T>): Array<T> {
  const copyCards = [...cards];
  let j, x, i;
  for (i = copyCards.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = copyCards[i];
    copyCards[i] = copyCards[j];
    copyCards[j] = x;
  }

  return copyCards;
}

export function drawCard({ deck, numberToDraw = 1 }: DrawCardsParams): DrawCardsReturnValues {
  if (deck.length === 0) {
    throw Error('no cards to draw');
  } else {
    const cardsDrew: Array<CardType> = [];
    const copyDeck = [...deck];

    for (let i = numberToDraw; i > 0; i--) {
      const cardToDraw = copyDeck.pop();
      if (!!cardToDraw) {
        cardsDrew.push(cardToDraw);
      }
    }

    return { cardsDrew, deckPile: copyDeck };
  }
}
