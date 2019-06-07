import { IGameState, IFloatingPill } from "../model/IGameState";
import { IGameBoard } from "../model/IGameBoard";

export function getInputState(state: IGameState) { return state.inputs; }
export function getGameboardState(state: IGameState): IGameBoard {return state.gameboard;}
export function getFloatingPillState(state: IGameState): IFloatingPill {return state.controlPill;}
