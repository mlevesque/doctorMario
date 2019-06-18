import { AnyAction } from "redux";

/**
 * General game actions.
 */
export enum GameAction {
    UPDATE = 'UPDATE',
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
