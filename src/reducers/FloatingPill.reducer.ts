import { IPill, IFloatingPill, IGridPos } from "../model/IGameState";
import { GameboardAction } from "../actions/GameBoard.actions";
import { FloatingPillAction } from "../actions/FloatingPill.actions";
import { rotatePill } from "../gameLogic/pillRotation";
import { IGameBoard } from "../model/IGameBoard";
import { InitialGameState } from "./InitialGameState";
import { AnimationAction } from "../actions/Animation.actions";
import { number } from "prop-types";

export function floatingPillReducer(state: IFloatingPill = InitialGameState.floatingPill, action: any): IFloatingPill {
    let newFloatingPill: IFloatingPill;
    switch (action.type) {

        // ============================================================
        // when the pill is added to the gameboard, it's no longer floating, and so
        // we remove it here
        case GameboardAction.ADD_PILL_TO_GAMEBOARD:
            newFloatingPill = Object.assign({}, state);
            newFloatingPill.pill = null;
            newFloatingPill.elapsedTime = 0;
            return newFloatingPill;


        // ============================================================
        // update elapsed time for floating pill, but only if the pill exists
        case AnimationAction.UPDATE:
            if (state.pill != null) {
                newFloatingPill = Object.assign({}, state);
                newFloatingPill.elapsedTime += action.payload as number;
                return newFloatingPill;
            }
            break;


        // ============================================================
        case FloatingPillAction.SET_PILL:
            newFloatingPill = Object.assign({}, state);
            newFloatingPill.pill = action.payload as IPill;
            return newFloatingPill;


        // ============================================================
        case FloatingPillAction.SLIDE:
            if (state.pill != null) {
                let pos: number = action.payload as number;
                newFloatingPill = Object.assign({}, state);
                newFloatingPill.pill.position = Object.assign({}, state.pill.position);
                newFloatingPill.pill.position.x += pos;
                return newFloatingPill;
            }
            break;

            
        // ============================================================
        case FloatingPillAction.DROP:
            let amount: number = action.payload as number;
            if (state.pill != null && amount > 0) {
                newFloatingPill = Object.assign({}, state);
                newFloatingPill.pill.position = Object.assign({}, state.pill.position);
                newFloatingPill.pill.position.y += amount;
                newFloatingPill.elapsedTime -= newFloatingPill.dropInterval * amount;
                if (newFloatingPill.elapsedTime < 0) {
                    newFloatingPill.elapsedTime = 0;
                }
                return newFloatingPill;
            }
            break;


        // ============================================================
        case FloatingPillAction.ROTATE:
            if (state.pill != null) {
                // get gameboard (needed for rotation)
                let gameboard: IGameBoard = action.payload;

                // perform rotation
                let pill: IPill = Object.assign({}, state.pill);
                rotatePill(pill, gameboard);

                // set new pill
                newFloatingPill = Object.assign({}, state);
                newFloatingPill.pill = pill;
                return newFloatingPill;
            }
            break;


        // ============================================================
        case FloatingPillAction.SET_DROP_INTERVAL:
            newFloatingPill = Object.assign({}, state);
            newFloatingPill.dropInterval = action.payload as number;
            return newFloatingPill;
    }
    return state;
}
