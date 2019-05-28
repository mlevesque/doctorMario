import { IGameBoard } from "../model/IGameBoard";
import { AnyAction } from "redux";

export enum FloatingPillAction {
    ROTATE = 'ROTATE',
    SET_DROP_INTERVAL = 'SET_DROP_INTERVAL',
}

/**
 * Action Creators
 */
export function createFloatingPillRotateAction(gameboard: IGameBoard): AnyAction {
    return { type: FloatingPillAction.ROTATE, payload: gameboard };
}
export function createFloatingPillSetDropIntervalAction(value: number): AnyAction {
    return { type: FloatingPillAction.SET_DROP_INTERVAL, payload: value };
}
