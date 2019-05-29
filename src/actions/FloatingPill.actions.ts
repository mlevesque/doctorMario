import { IGameBoard } from "../model/IGameBoard";
import { AnyAction } from "redux";
import { IGridPos, IPill } from "../model/IGameState";
import { ColorType } from "../model/enums";

export enum FloatingPillAction {
    SET_PILL = 'SET_PILL',
    SLIDE = 'SLIDE',
    DROP = 'DROP',
    ROTATE = 'ROTATE',
    SET_DROP_INTERVAL = 'SET_DROP_INTERVAL',
}

/**
 * Action Creators
 */
export function createFloatingPillSetPillAction(pill: IPill): AnyAction {
    return { type: FloatingPillAction.SET_PILL, payload: pill };
}
export function createFloatingPillSlideAction(position: number): AnyAction {
    return { type: FloatingPillAction.SLIDE, payload: position };
}
export function createFloatingPillDropAction(position: number): AnyAction {
    return { type: FloatingPillAction.DROP, payload: position };
}
export function createFloatingPillRotateAction(gameboard: IGameBoard): AnyAction {
    return { type: FloatingPillAction.ROTATE, payload: gameboard };
}
export function createFloatingPillSetDropIntervalAction(interval: number): AnyAction {
    return { type: FloatingPillAction.SET_DROP_INTERVAL, payload: interval };
}
