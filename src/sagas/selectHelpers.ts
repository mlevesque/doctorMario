import { IGameState, IFloatingPills } from "../model/IGameState";
import { IGameBoard } from "../model/IGameBoard";
import { FlowState } from "../model/enums";
import { IInputActions } from "../model/IInputActions";

export function getFlowState(state: IGameState): FlowState { return state.flowState; }
export function getFlowStateDelay(state: IGameState): number { return state.flowDelayTime; }

export function getInputState(state: IGameState): IInputActions { return state.inputs; }
export function getSlideCooldownState(state: IGameState): number { return state.slideCooldown; }

export function getGameboardState(state: IGameState): IGameBoard { return state.gameboard; }

export function getFloatingPillsState(state: IGameState): IFloatingPills { return state.floatingPills; }
export function getCurrentDropIntervalState(state: IGameState): number { return state.currentDropInterval; }
export function getRegularDropIntervalState(state: IGameState): number { return state.regularDropInterval; }
export function getDropTimeState(state: IGameState): number { return state.dropTime; }
