import { IGameState, IFloatingPills, IGridPos } from "../model/IGameState";
import { IGameBoard } from "../model/IGameBoard";
import { IInputActions } from "../model/IInputActions";
import { FlowState } from "../states/stateMappings";

export function getFlowState(state: IGameState): FlowState { return state.flowStateQueue.length > 0 ? state.flowStateQueue[0]: null; }
export function getFlowStateDelay(state: IGameState): number { return state.flowDelayTime; }

export function getInputState(state: IGameState): IInputActions { return state.inputs; }
export function getSlideCooldownState(state: IGameState): number { return state.slideCooldown; }

export function getGameboardState(state: IGameState): IGameBoard { return state.gameboard; }
export function getInvalidatedPositionsState(state: IGameState): IGridPos[] { return state.invalidatedPositions; }

export function getFloatingPillsState(state: IGameState): IFloatingPills { return state.floatingPills; }
export function getCurrentDropIntervalState(state: IGameState): number { return state.currentDropInterval; }
export function getRegularDropIntervalState(state: IGameState): number { return state.regularDropInterval; }
export function getDropTimeState(state: IGameState): number { return state.dropTime; }
