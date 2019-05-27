import { ObjectType, ColorType } from "./gameObject.model";

/**
 * Data associated to a single grid space on our gameboard.
 */
export class GridSpaceData {
    color: ColorType;
    type: ObjectType;
}

/**
 * Describes the dimensions for a game board.
 */
export interface IGameBoardDimensions {
    width: number;
    height: number;
}

/**
 * Description of the gameboard grid
 */
interface IGameBoardGrid {
    grid: GridSpaceData[][];
}

/**
 * Data for a gameboard.
 */
export type GameBoardData = IGameBoardDimensions & IGameBoardGrid;
