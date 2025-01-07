import { Box, Button } from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { DeckCard } from 'src/components/DeckCard/DeckCard.class';
import { HgtAvatar } from 'src/components/HgtAvatar/HgtAvatar';
import { HgtCardsHand } from 'src/components/HgtCardsHand/HgtCardsHand';
import { useNapoleaoGameOnlineContext } from './NapoleaoGameOnlineContext';
import { DeckCardComponent } from 'src/components/DeckCard/DeckCardComponent';
import { setNextTurn, updateOnlineGameProps, updateSplitedCardsInFirebase } from 'src/utils/napoleaoGame.util';
import { GAME_STEPS, PlayersInLobby } from 'src/models/napoleaoGame.model';
import { SUITS, SUITS_TYPES } from 'src/constants/deckCard.const';
import { CARD_MASK_TYPE, DeckCardConstructor } from 'src/components/DeckCard/DeckCard.model';
import { findCardBySuitAndValue } from 'src/utils/card.util';
import lodash from 'lodash';

type ChooseNapoleaoProps = {
  userCards?: ReadonlyArray<DeckCard>;
};

export const ChooseNapoleao: FC<ChooseNapoleaoProps> = () => {
  const { lobbyId, splitedCards, playersOnline, currentUser, onlineGameProps } = useNapoleaoGameOnlineContext();
  // console.log('splitedCards', splitedCards);
  // console.log('playersOnline', playersOnline);
  // console.log('currentUser', currentUser);
  // console.log('onlineGameProps', onlineGameProps);
  const [selectedSuperSuit, setSelectedSuperSuit] = useState(SUITS_TYPES.NoSuit);
  const [discardToPile, setDiscardToPile] = useState<DeckCardConstructor[]>([]);
  const [copinhoCardAndOwner, setCopinhoCardAndOwner] = useState<{ ownerId?: string; card?: DeckCardConstructor }>({});
  const currentPlayer = useMemo(() => {
    return playersOnline.find(({ uid }) => uid === currentUser.uid) as PlayersInLobby;
  }, []);
  const user = playersOnline.find(({ uid }) => uid === currentPlayer.uid);
  const initialPlayerNapoleao = playersOnline.find(({ index }) => index === 0);

  const napoleaoPlayerUid = onlineGameProps.napoleao?.playerUid ?? initialPlayerNapoleao?.uid ?? '';
  const napoleaoNumber = onlineGameProps.napoleao?.honrasQuantity ?? '10';
  const gameStep = onlineGameProps.gameStep;

  const pileOfCards = splitedCards?.['pile'] ?? [];
  const myHandOfCards: DeckCard[] = useMemo(() => {
    const myHand = splitedCards?.[currentUser?.uid];
    for (let handCard of myHand) {
      if (discardToPile.some(({ key: handCardKey }) => handCardKey === handCard.key)) {
        handCard.extraProps = {
          mask: CARD_MASK_TYPE.Discard,
        };
      }
      // clean mask after changing pile of cards
      if (gameStep === GAME_STEPS.ChooseCopinho) {
        handCard.extraProps = {};
      }
    }

    return myHand;
  }, [discardToPile, splitedCards]);

  if (!user) {
    return null;
  }

  const isChooseNapoleaoDisabled = gameStep !== GAME_STEPS.ChooseNapoleao;
  const isChooseSuperSuitDisabled = gameStep !== GAME_STEPS.ChooseSuperSuit || napoleaoPlayerUid !== currentUser?.uid;
  const isChangePileOfCardsDisabled = gameStep !== GAME_STEPS.ChangePile;
  const isChooseCopinhoDisabled = gameStep !== GAME_STEPS.ChooseCopinho;
  const isStartGameDisabled = gameStep !== GAME_STEPS.GameStarted;
  const isNapoleaoButtonDisabled = (napoleaoQuantity: string) =>
    onlineGameProps.turnFromPlayerIndex !== user.index ||
    napoleaoQuantity <= napoleaoNumber ||
    isChooseNapoleaoDisabled;

  const handleNapoleaoChoice = (quantity: string) => {
    setNextTurn({
      idToConnect: lobbyId,
      currentPlayerIndex: user.index,
      newGameProps: quantity !== 'mesa' ? { napoleao: { playerUid: currentPlayer.uid, honrasQuantity: quantity } } : {},
    });
  };

  const handleSelectDiscard = (cardToDiscard: DeckCardConstructor) => {
    if (GAME_STEPS.ChangePile) {
      if (discardToPile.some(({ key }) => key === cardToDiscard.key)) {
        setDiscardToPile((discardPileToFilter) =>
          discardPileToFilter.filter(({ key: cardKey }) => cardKey !== cardToDiscard.key),
        );
      } else {
        if (discardToPile.length < 3) {
          setDiscardToPile((existingDiscardPile) => [...existingDiscardPile, cardToDiscard]);
        }
      }
    }
  };

  const handleSelectCopinho = (cardToDiscard: DeckCardConstructor) => {
    if (GAME_STEPS.ChooseCopinho) {
      const copinhoCard = findCardBySuitAndValue(splitedCards, cardToDiscard);
      setCopinhoCardAndOwner({
        ownerId: copinhoCard?.ownerId ?? '',
        card: cardToDiscard,
      });
    }
  };

  const handleClickCard = (cardToDiscard: DeckCardConstructor) => {
    handleSelectDiscard(cardToDiscard);
    handleSelectCopinho(cardToDiscard);
  };

  const handleChooseNapoleao = () => {
    updateOnlineGameProps({ idToConnect: lobbyId, newGameProps: { gameStep: GAME_STEPS.ChooseSuperSuit } });
  };

  const handleChooseSuperSuit = () => {
    updateOnlineGameProps({
      idToConnect: lobbyId,
      newGameProps: { superSuit: selectedSuperSuit, gameStep: GAME_STEPS.ChangePile },
    });
  };

  const handleChoosePileCards = () => {
    if (discardToPile.length === 3) {
      const thirteenCards = [...myHandOfCards, ...pileOfCards];
      const newNapoleaoHand = thirteenCards.filter(
        ({ key }) => !discardToPile.some(({ key: discardKey }) => discardKey === key),
      );

      for (let napoleaoCard of newNapoleaoHand) {
        napoleaoCard.ownerId = currentUser?.uid;
      }

      for (let discardCard of discardToPile) {
        discardCard.ownerId = '5';
      }

      const newPlayersCards = {
        ['pile']: discardToPile,
        [currentUser?.uid]: newNapoleaoHand,
      };

      updateSplitedCardsInFirebase({
        idToConnect: lobbyId,
        newPlayersCards,
        newGameProps: { gameStep: GAME_STEPS.ChooseCopinho },
      });
    }
  };

  const handleChooseCopinho = () => {
    const updatedSplitedCards = lodash.mapValues(splitedCards, (group: DeckCard[]) => {
      // Find the card that matches both the suit and value
      const updatedGroup = group.map((card) => {
        if (card.suit === copinhoCardAndOwner?.card?.suit && card.value === copinhoCardAndOwner?.card?.value) {
          return {
            ...card,
            extraProps: {
              mask: CARD_MASK_TYPE.Copinho,
            },
          };
        }
        return card;
      });

      return updatedGroup;
    });

    updateSplitedCardsInFirebase({
      idToConnect: lobbyId,
      newPlayersCards: updatedSplitedCards,
      newGameProps: copinhoCardAndOwner?.card
        ? {
            copinho: { playerUid: copinhoCardAndOwner?.ownerId ?? '', card: copinhoCardAndOwner.card },
            gameStep: GAME_STEPS.GameStarted,
          }
        : undefined,
    });
  };

  const handleStartGame = () => {};

  return (
    <Box sx={{ padding: '16px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {playersOnline
          .filter(({ uid: otherUid }) => otherUid !== currentUser.uid)
          .map(({ name, uid: otherPlayerUid }) => {
            return (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <HgtAvatar initials={name.substring(0, 2)?.toUpperCase()} />
                {napoleaoPlayerUid === otherPlayerUid && `Napoleão: ${napoleaoNumber}`}
              </Box>
            );
          })}
      </Box>

      <Box
        sx={{
          height: '500px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        {pileOfCards.map((card) => (
          <DeckCardComponent
            key={card.key}
            card={card}
            onClick={handleSelectDiscard}
            mask={
              discardToPile.some(({ key: pileCardKey }) => pileCardKey === card.key)
                ? CARD_MASK_TYPE.Discard
                : undefined
            }
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        {napoleaoPlayerUid === currentPlayer.uid && `Napoleão: ${napoleaoNumber}`}
        <HgtCardsHand cards={myHandOfCards} onClick={handleClickCard} />
        <HgtAvatar initials={'EU'} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {['11', '12', '13', '14', '15', '16', 'mesa'].map((napoleaoQuantity) => (
            <Button
              variant="contained"
              onClick={() => handleNapoleaoChoice(napoleaoQuantity)}
              disabled={isNapoleaoButtonDisabled(napoleaoQuantity)}
            >
              {napoleaoQuantity}
            </Button>
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {[...SUITS, SUITS_TYPES.NoSuit].map((suitValue) => (
            <Button
              variant="contained"
              sx={{ backgroundColor: suitValue === selectedSuperSuit ? 'red' : 'blue' }}
              onClick={() => setSelectedSuperSuit(suitValue)}
              disabled={isChooseSuperSuitDisabled}
            >
              {suitValue}
            </Button>
          ))}
        </Box>
      </Box>

      <Box sx={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
        <Button variant="contained" onClick={handleChooseNapoleao} disabled={isChooseNapoleaoDisabled}>
          Choose Napoleao
        </Button>
        <Button variant="contained" onClick={handleChooseSuperSuit} disabled={isChooseSuperSuitDisabled}>
          Choose Super Suit
        </Button>
        <Button variant="contained" onClick={handleChoosePileCards} disabled={isChangePileOfCardsDisabled}>
          Choose Pile Cards
        </Button>
        <Button variant="contained" onClick={handleChooseCopinho} disabled={isChooseCopinhoDisabled}>
          Choose Copinho
        </Button>
        <Button variant="contained" onClick={handleStartGame} disabled={isStartGameDisabled}>
          Start Game
        </Button>
      </Box>
    </Box>
  );
};
