import { Table } from '../model/Table';
import { IPill, IGridPos } from '../model/IGameState';
import { ColorType } from '../model/enums';
import { AnyAction } from 'redux';

/**
 * Action Types
 */
export enum GameboardAction {
    BUILD_GAMEBOARD = 'BUILD_GAMEBOARD',
    ADD_PILL_TO_GAMEBOARD = 'ADD_PILL_TO_GAMEBOARD',
    DESTROY_OBJECTS_IN_GAMEBOARD = 'DESTROY_OBJECTS_IN_GAMEBOARD',
    PURGE_DESTROY_OBJECTS = 'PURGE_DESTROY_OBJECTS',
    CLEAR_GAMEBOARD = 'CLEAR_GAMEBOARD',
    ADD_INVALIDATED_POSITIONS = 'ADD_INVALIDATED_POSITIONS',
    CLEAR_INVALIDATED_POSITIONS = 'CLEAR_INVALIDATED_POSITIONS'
}

/**
 * Action Creators
 */
export function createBuildGameboardAction(data: Table<ColorType>): AnyAction {
    return { type: GameboardAction.BUILD_GAMEBOARD, payload: data };
}
export function createAddPillToGameboardAction(pill: IPill): AnyAction {
    return { type: GameboardAction.ADD_PILL_TO_GAMEBOARD, payload: pill };
}
export function createDestroyObjectsInGameboardAction(positions: IGridPos[]): AnyAction {
    return { type: GameboardAction.DESTROY_OBJECTS_IN_GAMEBOARD, payload: positions };
}
export function createPurgeDestroyObjectsAction(): AnyAction {
    return { type: GameboardAction.PURGE_DESTROY_OBJECTS };
}
export function createClearGameboardAction(): AnyAction {
    return { type: GameboardAction.CLEAR_GAMEBOARD };
}
export function createAddInvalidatedPositionsAction(positions: IGridPos[]): AnyAction {
    return { type: GameboardAction.ADD_INVALIDATED_POSITIONS, payload: positions };
}
export function createClearInvalidatedPositionsAction(): AnyAction {
    return { type: GameboardAction.CLEAR_INVALIDATED_POSITIONS };
}
