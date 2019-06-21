import { IVirusCounts } from "../model/IGameState";
import { GameSpeed } from "../model/enums";
import { AnyAction } from "redux";

export enum LevelAction {
    SET_LEVEL = "SET_LEVEL",
    UPDATE_REMAINING_VIRUSES = "UPDATE_REMAINING_VIRUSES"
}

export function createSetLevelAction(level: number, gameSpeed: GameSpeed): AnyAction {
    return {type: LevelAction.SET_LEVEL, payload: {
        level: level,
        gameSpeed: gameSpeed
    }};
}
export function createUpdateRemaningVirusesAction(virusesRemaining: IVirusCounts): AnyAction {
    return {type: LevelAction.UPDATE_REMAINING_VIRUSES, payload:virusesRemaining};
}
