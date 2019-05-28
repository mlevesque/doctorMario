import { GridPos } from '../model/common.model';
import { IGameBoardDimensions } from '../model/Gameboard.model';
import { Pill, ColorType } from '../model/gameObject.model';
import { GameBoardBuildData } from './model/GameboardActions.model';

/**
 * Action Types
 */
export const BUILD_GAMEBOARD: string = 'BUILD_GAMEBOARD';
export const ADD_PILL_TO_GAMEBOARD: string = 'ADD_PILL_TO_GAMEBOARD';
export const REMOVE_FROM_GAMEBOARD: string = 'REMOVE_FROM_GAMEBOARD';
export const CLEAR_GAMEBOARD: string = 'CLEAR_GAMEBOARD';


/**
 * Action Creators
 */
export function createBuildGameboardAction(data: GameBoardBuildData<string>) {
    return { type: BUILD_GAMEBOARD, payload:data };
}

export function createAddPillToGameboardAction(pill: Pill) {
    return { type: ADD_PILL_TO_GAMEBOARD, payload:pill };
}

export function createRemoveFromGameboardAction(gridPos: GridPos) {
    return { type: REMOVE_FROM_GAMEBOARD, payload:gridPos };
}

export function createClearGameboardAction() {
    return { type: CLEAR_GAMEBOARD };
}
