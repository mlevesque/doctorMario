import { AnyAction } from "redux";
import { IGridPos, IPill } from "../model/IGameState";

export enum FloatingPillAction {
    ADD_PILL = 'ADD_PILL',
    REMOVE_PILL = 'REMOVE_PILL',
    UPDATE_PILL = 'UPDATE_PILL',
    SET_CURRENT_DROP_INTERVAL = 'SET_CURRENT_DROP_INTERVAL',
    SET_REGULAR_DROP_INTERVAL = 'SET_REGULAR_DROP_INTERVAL',
    SET_DROP_TIME = 'SET_DROP_TIME',
    SET_PILL_WORLD_Y_OFFSET = 'SET_PILL_WORLD_Y_OFFSET',
}

/**
 * Action Creators
 */
export function createFloatingPillAddPillAction(pill: IPill): AnyAction {
    return { type: FloatingPillAction.ADD_PILL, payload: pill };
}
export function createFloatingPillRemovePillAction(pillIndex: number): AnyAction {
    return { type: FloatingPillAction.REMOVE_PILL, payload: pillIndex };
}
export function createFloatingPillUpdatePillAction(pillIndex: number, pill: IPill): AnyAction {
    return { type: FloatingPillAction.UPDATE_PILL, payload: {pillIndex: pillIndex, pill: pill} };
}
export function createSetCurrentDropIntervalAction(interval: number): AnyAction {
    return { type: FloatingPillAction.SET_CURRENT_DROP_INTERVAL, payload: interval };
}
export function createSetRegularDropIntervalAction(interval: number): AnyAction {
    return { type: FloatingPillAction.SET_REGULAR_DROP_INTERVAL, payload: interval };
}
export function createSetDropTimeAction(value: number): AnyAction {
    return { type: FloatingPillAction.SET_DROP_TIME, payload: value };
}
export function createPillWorldYOffsetAction(offset: number): AnyAction {
    return { type: FloatingPillAction.SET_PILL_WORLD_Y_OFFSET, payload: offset };
}
