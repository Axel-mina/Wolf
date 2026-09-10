export type Role = 'WOLF' | 'DOCTOR' | 'CITIZEN';

export interface Player {
  id: string;
  name: string;
  role: Role;
  isAlive: boolean;
  avatarIndex: number;
}

export type GamePhase =
  | 'SETUP'           // Entering players & names
  | 'NIGHT_PASS'      // Pass phone to player X
  | 'NIGHT_ACTION'    // Player X sees their role & takes secret action
  | 'MORNING_REVEAL'  // Sunrise: announcement of night events (kill/rescue)
  | 'VOTING'          // Village voting against suspect
  | 'VOTE_RESULT'     // Revealing who was voted out and if they were the wolf
  | 'GAME_OVER';      // Game conclusion (Citizens win or Wolf wins)

export interface NightState {
  currentPlayerIndex: number;
  wolfTargetId: string | null;
  doctorTargetId: string | null;
}

export interface MorningReport {
  attackedPlayerId: string | null;
  savedByDoctor: boolean;
  eliminatedPlayerId: string | null;
}

export interface VoteRecord {
  [voterId: string]: string; // voterId -> targetPlayerId
}

export interface GameHistoryItem {
  round: number;
  nightVictimName: string | null;
  doctorSaved: boolean;
  votedOutName: string | null;
  votedOutRole: Role | null;
}
