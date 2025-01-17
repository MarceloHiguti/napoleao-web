import { DeckCardConstructor } from '../DeckCard/DeckCard.model';
import HgtCard from './HgtCard';
import styles from './HgtCard.module.scss';

type HgtCardsHandProps = {
  cards: ReadonlyArray<DeckCardConstructor>;
  cardSelected?: DeckCardConstructor;
  onClick?: (card: DeckCardConstructor) => void;
};

const HgtCardsHand: React.FC<HgtCardsHandProps> = ({ cards, onClick, cardSelected }) => {
  return (
    <div className={styles.card_hand}>
      {cards.map((card, index) => (
        <HgtCard key={index} card={card} onClick={onClick} isSelected={card === cardSelected} />
      ))}
    </div>
  );
};

export default HgtCardsHand;
