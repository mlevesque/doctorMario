import { TypeColor, GridPos } from './common.model'

/**
 * Describes one half of a floating pill.
 */
export interface HalfPillData {
    color: TypeColor;
    pos: GridPos;
}

/**
 * Describes a floating pill over the gameboard.
 */
export interface PillData {
    firstHalf: HalfPillData;
    secondHalf: HalfPillData;
}
