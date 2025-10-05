export type TermType = '基础' | '特殊' | '限定';
export type CardType = '法术牌' | '造物牌'; // Spell or Creature

export interface Term {
  id: string;
  name: string;
  type: TermType;
  cost: number | string; // number for cost, string for modifier like '*2' or '/2'
  description: {
    spell: string;
    creature: string;
  };
  artId: string;
}

export interface Card {
  id: string;
  name: string;
  terms: Term[];
  finalCost: number;
  type: CardType;
  description: string;
  attack?: number;
  health?: number;
  artId: string;
}

export interface Creature {
  id: string; // unique instance ID
  cardId: string; // reference to the card it was created from
  name: string;
  attack: number;
  health: number;
  maxHealth: number;
  type: '造物牌'; // To distinguish it on the board
  artId:string;
  canAttack: boolean; // Summoning sickness
}

export interface Player {
  id:string;
  name: string;
  health: number;
  maxHealth: number;
  deck: Card[];
  hand: Card[];
  graveyard: Card[];
  board: (Creature | null)[];
  playedCardThisTurn: boolean;
  turnHasSwappedCard: boolean; // Add this
}

export type GamePhase = 
  | 'main' // Player can play a card or end turn
  | 'selectingHandCard' // Player is choosing a card from deck to swap
  | 'selectingTarget' // Player has played a spell and must select a target
  | 'selectingBoardSlot' // Player has played a creature and must select a slot
  | 'resolution' // Cards in settlement zone are resolving
  | 'combat' // Creatures are fighting
  | 'end'; // Game has ended

export type SettlementAction = {
    card: Card;
    playerId: string;
    action: {
        type: 'place_creature';
        playerIndex: number;
        slotIndex: number;
    } | {
        type: 'cast_spell';
        target: { type: 'player' | 'creature'; playerIndex: number; slotIndex?: number } | null;
    }
};

export interface GameState {
  players: [Player, Player];
  turnCount: number;
  pvpScore: [number, number];
  currentEnvironment: string | null;
  activePlayerIndex: 0 | 1;
  settlementZone: SettlementAction[];
  gamePhase: GamePhase;
  selectedHandCardIndex: number | null; // index of card in hand selected to be played
  selectedDeckCardIndex: number | null; // index of card in deck selected to be swapped
  winner: Player | null;
}
