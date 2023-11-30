import {
  CalculateCardStrengthParams,
  GetCopinhoCardKeyParams,
  IncludeSuperSuitAndCopinhoInCardsParams,
  NapoleaoDeckModifierParams,
  NapoleaoRoundWinnerParams,
} from 'src/models/napoleaoRules.util.model';
import { ACE_AMPLIFIER, COPINHO_AMPLIFIER, SUPER_SUIT_AMPLIFIER } from '../constants/deckCard.const';

export function napoleaoRoundWinner({ selectedCards }: NapoleaoRoundWinnerParams) {
  const cardsArray = Object.values(selectedCards);
  const numberOfSelectedCards = cardsArray?.length;
  if (numberOfSelectedCards !== 5) {
    return -1;
  }

  cardsArray.reduce(
    ({ winnerIndex, winnerCardStregth, winnerCard }, cardByPlayer, playerIndex) => {
      const cardStrength = calculateCardStrength({ card: cardByPlayer, validSuit: cardByPlayer.getSuit });
      const isNewCardStronger = cardStrength > winnerCardStregth;
      const newWinnerIndex = isNewCardStronger ? playerIndex : winnerIndex;
      const newWinnerCard = isNewCardStronger ? cardByPlayer : winnerCard;
      const newwinnerCardStregth = isNewCardStronger ? cardStrength : winnerCardStregth;

      return { winnerIndex: newWinnerIndex, winnerCard: newWinnerCard, winnerCardStregth: newwinnerCardStregth };
    },
    { winnerIndex: 0, winnerCard: { key: '', suit: '', value: 0 }, winnerCardStregth: 0 },
  );

  return 1;
}

export function includeSuperSuitAndCopinhoInCards({
  splitedCards,
  superSuit,
  copinho,
}: IncludeSuperSuitAndCopinhoInCardsParams) {
  const splitedCardsWithSuperSuit = new Map();
  for (const [key, playerHand] of splitedCards) {
    const playerCardsWithSuperSuit = playerHand.map((handCard) => {
      if (handCard.getSuit === superSuit) {
        handCard.setExtraParams = {
          isSuperSuit: true,
        };
      }

      if (handCard.getKey === copinho) {
        handCard.setExtraParams = {
          isCopinho: true,
        };
      }

      return handCard;
    });

    splitedCardsWithSuperSuit.set(key, playerCardsWithSuperSuit);
  }

  return splitedCardsWithSuperSuit;
}

export function getCopinhoCardKey({ number, suit, deckNumber = 1 }: GetCopinhoCardKeyParams) {
  return `${number}_${suit}_deck_${deckNumber}`;
}

export function calculateCardStrength({ card, validSuit }: CalculateCardStrengthParams) {
  const simpleValue = card.getValue;
  const cardIsSuperSuit = card.getExtraParams?.isSuperSuit;
  const cardIsCopinho = card.getExtraParams?.isCopinho;
  const valueAfterCheckSuit = cardIsSuperSuit ? simpleValue + SUPER_SUIT_AMPLIFIER : simpleValue;
  const valueAfterCheckCopinho = cardIsCopinho ? valueAfterCheckSuit + COPINHO_AMPLIFIER : valueAfterCheckSuit;
  const cardHasValidSuit = card.getSuit === validSuit || cardIsSuperSuit || cardIsCopinho;
  const finalValue = cardHasValidSuit ? valueAfterCheckCopinho : valueAfterCheckCopinho * -1;

  return finalValue;
}

export function napoleaoDeckModifier({ cards }: NapoleaoDeckModifierParams) {
  const deckAcesChanged = cards.map((card) => {
    if (card.getValue === 1) {
      card.setValue = card.getValue + ACE_AMPLIFIER;
    }

    return card;
  });

  return deckAcesChanged;
}
