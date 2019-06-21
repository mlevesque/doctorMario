import { ILevelData } from "../model/IGameState";
import { InitialGameState } from "./InitialGameState";
import { AnyAction } from "redux";
import { LevelAction } from "../actions/level.actions";

export function levelReducer(state: ILevelData = InitialGameState.levelData, action: AnyAction): ILevelData {
    switch(action.type) {
        case LevelAction.SET_LEVEL:
            return {
                level: action.payload.level,
                gameSpeed: action.payload.gameSpeed,
                remainingCounts: {
                    red: 0,
                    yellow: 0,
                    blue: 0
                }
            };
        case LevelAction.UPDATE_REMAINING_VIRUSES:
            return Object.assign({}, state, {
                remainingCounts: Object.assign({}, action.payload)
            });
    }
    return state;
}
