import CheckIcon from '@mui/icons-material/Check';
import { Box, Button, Divider, Grid, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Deck as DeckClass } from '../../components/Deck/Deck.class';
import { DeckCardComponent } from '../../components/DeckCard/DeckCardComponent';
import { distributeCards } from '../../utils/card.util';
import { BoardCenter } from '../BoardCenter/BoardCenter';
import {
  getCopinhoCardKey,
  includeSuperSuitAndCopinhoInCards,
  napoleaoRoundWinner,
} from '../../utils/napoleaoRules.util';
import { JOKER } from '../../constants/deckCard.const';
import { isEmpty } from 'lodash';
import { HgtDropdown } from '../../components/HgtDropdown/HgtDropdown';
import { NUMBERS_OPTIONS, SUITS_OPTIONS } from '../../constants/deckDropdown.const';

export const NapoleaoGame = () => {
  const [selectedCards, setSelectedCards] = useState({});
  const [roundWinner, setRoundWinner] = useState();
  const [superSuit, setSuperSuit] = useState('joker');
  const [copinho, setCopinho] = useState('joker');
  const [splitedCards, setSplitedCards] = useState();

  const copinhoNumberRef = useRef();
  const copinhoSuitRef = useRef();

  const handleClickCard = useCallback(
    (playerNumber, card) => {
      setSelectedCards({
        ...selectedCards,
        [playerNumber]: card,
      });
    },
    [selectedCards],
  );

  const checkRoundWinner = useCallback(() => {
    const playerIndexRoundWinner = napoleaoRoundWinner({ selectedCards });
    setRoundWinner(playerIndexRoundWinner);
  }, [selectedCards]);

  const selectSuperSuit = useCallback((superSuitChosen) => {
    return () => setSuperSuit(superSuitChosen);
  }, []);

  const updateDeckWithSuperSuit = useCallback(() => {
    const splitedCardsSuperSuit = includeSuperSuitAndCopinhoInCards({ splitedCards, superSuit, copinho });
    setSplitedCards(splitedCardsSuperSuit);
  }, [splitedCards, superSuit, copinho]);

  const defineCopinho = useCallback(() => {
    const splitedCardsSuperSuit = getCopinhoCardKey({
      number: copinhoNumberRef?.current?.currentValue,
      suit: copinhoSuitRef?.current?.currentValue,
    });
    setCopinho(splitedCardsSuperSuit);
  }, [copinhoNumberRef?.current, copinhoSuitRef?.current]);

  useEffect(() => {
    const deck = new DeckClass({ extraCards: JOKER });
    const distributedCards = distributeCards({ deck, numberOfCards: 10, numberOfPlayers: 5 });
    setSplitedCards(distributedCards);
  }, []);

  return (
    <Box sx={{ padding: '16px' }}>
      {!isEmpty(splitedCards) && (
        <>
          <Grid container sx={{ marginBottom: '24px' }}>
            <Grid item xs={6} sx={{ border: '1px solid' }}>
              <DeckCardComponent
                key={'player_01'}
                card={splitedCards.get(1)[0]}
                onClick={(card) => handleClickCard(1, card)}
              />
            </Grid>
            <Grid item xs={6} sx={{ border: '1px solid' }}>
              <DeckCardComponent
                key={'player_02'}
                card={splitedCards.get(2)[0]}
                onClick={(card) => handleClickCard(2, card)}
              />
            </Grid>
          </Grid>

          <Grid container sx={{ marginBottom: '24px' }}>
            <Grid item xs={2} sx={{ border: '1px solid' }}>
              <DeckCardComponent
                key={'player_03'}
                card={splitedCards.get(3)[0]}
                onClick={(card) => handleClickCard(3, card)}
              />
            </Grid>
            <Grid item xs={8} sx={{ border: '1px solid' }}>
              <BoardCenter selectedCards={selectedCards} />
            </Grid>
            <Grid item xs={2} sx={{ border: '1px solid' }}>
              <DeckCardComponent
                key={'player_04'}
                card={splitedCards.get(4)[0]}
                onClick={(card) => handleClickCard(4, card)}
              />
            </Grid>
          </Grid>

          <Grid container sx={{ marginBottom: '24px' }}>
            <Grid item xs={5}></Grid>
            {selectedCards[0] && (
              <Grid item xs={2} sx={{ border: '1px solid' }}>
                <DeckCardComponent key={selectedCards[0].key} card={selectedCards[0]} />
              </Grid>
            )}
          </Grid>

          <Grid container sx={{ marginBottom: '24px', marginTop: '96px' }}>
            <Grid item xs={12} sx={{ border: '1px solid' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }} gap={2}>
                {splitedCards.get(0).map((card) => (
                  <DeckCardComponent key={card.key} card={card} onClick={(card) => handleClickCard(0, card)} />
                ))}
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
              <Button
                startIcon={superSuit === 'diamonds' && <CheckIcon />}
                variant="outlined"
                onClick={selectSuperSuit('diamonds')}
              >
                diamonds
              </Button>
              <Button
                startIcon={superSuit === 'spades' && <CheckIcon />}
                variant="outlined"
                onClick={selectSuperSuit('spades')}
              >
                spades
              </Button>
              <Button
                startIcon={superSuit === 'hearts' && <CheckIcon />}
                variant="outlined"
                onClick={selectSuperSuit('hearts')}
              >
                hearts
              </Button>
              <Button
                startIcon={superSuit === 'clubs' && <CheckIcon />}
                variant="outlined"
                onClick={selectSuperSuit('clubs')}
              >
                clubs
              </Button>
              <Button
                startIcon={superSuit === 'joker' && <CheckIcon />}
                variant="outlined"
                onClick={selectSuperSuit('joker')}
              >
                none
              </Button>
            </Box>
            <Box>
              <Button variant="outlined" onClick={updateDeckWithSuperSuit}>
                Choose super suit
              </Button>
            </Box>
          </Box>

          <Divider sx={{ marginTop: '24px', marginBottom: '24px' }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Typography>Copinho</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
              <HgtDropdown ref={copinhoNumberRef} title="Number" options={NUMBERS_OPTIONS} />
              <HgtDropdown ref={copinhoSuitRef} title="Suit" options={SUITS_OPTIONS} />
            </Box>
            <Box>
              <Button variant="outlined" onClick={defineCopinho}>
                Choose copinho
              </Button>
            </Box>
          </Box>

          <Divider sx={{ marginTop: '24px', marginBottom: '24px' }} />

          <Box>
            <Button sx={{ marginTop: '12px' }} variant="outlined" onClick={checkRoundWinner}>
              Point
            </Button>
            {roundWinner && <Typography sx={{ marginTop: '12px' }}>Winner: {roundWinner}</Typography>}
          </Box>
        </>
      )}
    </Box>
  );
};
