import { InitialGameState } from "./InitialGameState";
import { ScoreAction } from "../actions/score.actions";
import { AnyAction } from "redux";

export function scoreReducer(state: number = InitialGameState.score, action: AnyAction): number {
    switch(action.type) {
        case ScoreAction.SET_SCORE:
            return action.payload;
    }
    return state;
}
