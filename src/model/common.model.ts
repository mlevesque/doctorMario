/**
 * Color designator for a virus or pill half
 */
export enum TypeColor {
    RED = 1,
    YELLOW,
    BLUE
}

/**
 * Positional data within the gameboard.
 */
export interface GridPos {
    x: number;
    y: number;
}
