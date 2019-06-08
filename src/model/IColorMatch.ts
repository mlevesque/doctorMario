import { IGridPos } from "./IGameState";
import { MatchDirection, ColorType } from "./enums";

export interface IColorMatch {
    color: ColorType;
    startPos: IGridPos;
    length: number;
    direction: MatchDirection;
}
