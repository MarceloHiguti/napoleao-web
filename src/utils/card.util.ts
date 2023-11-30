import { DeckCardConstructor } from 'src/components/DeckCard/DeckCard.model';
import { BuildNumbersWithLabelsParams, CreateDeckParams, DistributeCardsParams } from 'src/models/card.util.model';

export function createDeck({ numbers, suits, extraCards, deckModifierCallback, deckNumber = 1 }: CreateDeckParams) {
  const deck: DeckCardConstructor[] = [];

  for (let suit of suits) {
    for (let number of numbers) {
      deck.push({
        key: `${number}_${suit}_deck_${deckNumber}`,
        value: number,
        suit: suit,
      });
    }
  }

  if (!!extraCards) {
    deck.push({
      key: `${extraCards.value}_${extraCards.suit}`,
      value: extraCards.value,
      suit: extraCards.suit,
      extraParams: extraCards.extraParams,
    });
  }

  const finalDeck = deckModifierCallback?.(deck) ?? deck;

  return finalDeck;
}

export function distributeCards({ deck, numberOfCards, numberOfPlayers }: DistributeCardsParams) {
  const playersObject = new Map();

  for (let i = 0; i < numberOfPlayers; i++) {
    playersObject.set(i, deck.drawCard(numberOfCards));
  }

  const cardsLeft = deck.getCardsLength;
  if (cardsLeft > 0) {
    playersObject.set('pile', deck.drawCard(cardsLeft));
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
