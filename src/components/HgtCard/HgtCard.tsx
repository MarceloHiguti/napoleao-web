import { SUITS_TYPES } from 'src/constants/deckCard.const';
import { DeckCardConstructor } from '../DeckCard/DeckCard.model';
import styles from './HgtCard.module.scss';
import classnames from 'classnames';

type HgtCardProps = {
  card: DeckCardConstructor;
  onClick?: (card: DeckCardConstructor) => void;
  isSelected?: boolean;
};

const BLACK_SUITS = [SUITS_TYPES.Joker, SUITS_TYPES.Spades, SUITS_TYPES.Clubs];
const RED_SUITS = [SUITS_TYPES.Diamonds, SUITS_TYPES.Hearts];
const CARD_VALUE_MAPPING: { [key: number]: string } = {
  1: 'A',
  21: 'A',
  11: 'J',
  12: 'Q',
  13: 'K',
};

const suitSymbols: Record<string, string> = {
  hearts: '\u2665', // ♥
  diamonds: '\u2666', // ♦
  clubs: '\u2663', // ♣
  spades: '\u2660', // ♠
};

const HgtCard: React.FC<HgtCardProps> = ({ card, onClick, isSelected }) => {
  const { value, suit } = card;

  const handleCardClick = () => {
    onClick?.(card);
  };

  return (
    // <div className={`card ${suit}`}>
    <div
      className={classnames(styles.card, {
        [styles.card_black]: BLACK_SUITS.includes(suit),
        [styles.card_red]: RED_SUITS.includes(suit),
        [styles.card__selected]: isSelected,
      })}
      onClick={handleCardClick}
    >
      <div className={styles.card_content}>
        <span className={styles.card_value}>{CARD_VALUE_MAPPING[value] ?? value}</span>
        <span className={styles.card_suit}>{suitSymbols[suit]}</span>
      </div>
    </div>
  );
};

export default HgtCard;
