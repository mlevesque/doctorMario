import { IGameState, IFloatingPill } from "../model/IGameState";
import { IGameBoard } from "../model/IGameBoard";
import { FlowState } from "../model/enums";
import { IInputActions } from "../model/IInputActions";

export function getFlowState(state: IGameState): FlowState { return state.flowState; }
export function getInputState(state: IGameState): IInputActions { return state.inputs; }
export function getGameboardState(state: IGameState): IGameBoard { return state.gameboard; }
export function getFloatingPillState(state: IGameState): IFloatingPill { return state.controlPill; }
