import { GridPos } from "../../model/common.model";

/**
 * Schema for a set of pill sprite types for a given color.
 */
export interface IPillSpriteColorSet {
    [typeKey: string]: string;
}

/**
 * Schema for the gameboard object lookup Json file.
 */
export interface IGameboardObjectLookupJson {
    VIRUS: {
        [colorKey: string]: string;
    };

    PILL: {
        [colorKey: string]: IPillSpriteColorSet;
    };
}
