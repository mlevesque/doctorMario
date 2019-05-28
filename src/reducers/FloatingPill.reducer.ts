import { IPill, IFloatingPill } from "../model/IGameState";
import { GameboardAction } from "../actions/GameBoard.actions";
import { FloatingPillAction } from "../actions/FloatingPill.actions";
import { rotatePill } from "../gameLogic/pillRotation";
import { IGameBoard } from "../model/IGameBoard";
import { InitialGameState } from "./InitialGameState";

export function floatingPillReducer(state: IFloatingPill = InitialGameState.floatingPill, action: any): IFloatingPill {
    let newFloatingPill: IFloatingPill;
    switch (action.type) {

        // ============================================================
        // when the pill is added to the gameboard, it's no longer floating, and so
        // we remove it here
        case GameboardAction.ADD_PILL_TO_GAMEBOARD:
            return null;


        // ============================================================
        case FloatingPillAction.ROTATE:
            // get gameboard (needed for rotation)
            let gameboard: IGameBoard = action.payload;

            // perform rotation
            let pill: IPill = Object.assign({}, state.pill);
            rotatePill(pill, gameboard);

            // set new pill
            newFloatingPill = Object.assign({}, state);
            newFloatingPill.pill = pill;
            return newFloatingPill;


        // ============================================================
        case FloatingPillAction.SET_DROP_INTERVAL:
            newFloatingPill = Object.assign({}, state);
            newFloatingPill.dropInterval = action.payload as number;
            return newFloatingPill;
    }
    return state;
}