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
}

export interface GameState {
  players: [Player, Player];
  turnCount: number;
  pvpScore: [number, number];
  currentEnvironment: string | null;
  activePlayerIndex: 0 | 1;
  settlementZone: {card: Card, playerId: string}[];
  gamePhase: 'main' | 'combat' | 'end' | 'placement';
  selectedHandCardIndex: number | null;
  turnHasSwappedCard: boolean; // Each player has one chance to swap/select card per turn
}
