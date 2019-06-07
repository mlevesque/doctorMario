import { InitialGameState } from "./InitialGameState";
import { GameAction } from "../actions/Game.actions";

export function gameboardRenderReducer(state: number = InitialGameState.gameboardRenderCount, action: any): number {
    switch(action.type) {
        case GameAction.RENDER_GAMEBOARD:
            return state + 1;
    }
    return state;
}
