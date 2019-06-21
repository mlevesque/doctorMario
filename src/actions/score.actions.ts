import { AnyAction } from "redux";

export enum ScoreAction {
    SET_SCORE = "SET_SCORE"
}

export function createSetScoreAction(score: number): AnyAction {
    return {type: ScoreAction.SET_SCORE, payload: score};
}
