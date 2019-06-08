import { AnyAction } from "redux";
import { FlowState } from "../model/enums";

/**
 * General game actions.
 */
export enum GameAction {
    UPDATE = 'UPDATE',
    SET_FLOW_STATE = 'SET_FLOW_STATE',
    RENDER_GAMEBOARD = 'RENDER_GAMEBOARD',
}

/**
 * Action Creators
 */
export function createGameUpdateAction(deltaTime: number): AnyAction {
    return { type: GameAction.UPDATE, payload: deltaTime };
}
export function createGameRenderGameboard(): AnyAction {
    return { type: GameAction.RENDER_GAMEBOARD };
}
export function createGameSetFlowStateAction(flowState: FlowState): AnyAction {
    return { type: GameAction.SET_FLOW_STATE, payload: flowState };
}
