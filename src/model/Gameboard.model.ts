import { TypeColor } from "./common.model"

/**
 * Describes if the given grid space is connected to an adjacent grid space.
 * This is used to maintain connections for pills.
 */
export enum ConnectorDirection {
    NONE = 1,
    LEFT,
    RIGHT,
    UP,
    DOWN
}

/**
 * Data associated to a single grid space on our gameboard.
 */
export class GridSpaceData {
    color: TypeColor;
    connector: ConnectorDirection;
    isVirus: boolean
}

/**
 * Describes the dimensions for a game board.
 */
export interface GameBoardDimensions {
    width: number;
    height: number;
}

/**
 * Description of the gameboard grid
 */
interface GameBoardGrid {
    grid: GridSpaceData[][];
}

/**
 * Data for a gameboard
 */
export type GameBoardData = GameBoardDimensions & GameBoardGrid;
