import { ColorType, ObjectType } from "./enums";

/**
 * Data associated to a single grid space on our gameboard.
 */
export interface IGridSpace {
    color: ColorType;
    type: ObjectType;
}

/**
 * Describes the dimensions for a game board.
 */
export interface IGridDimensions {
    width: number;
    height: number;
}

/**
 * Description of the gameboard grid
 */
interface IGameBoardGrid {
    grid: IGridSpace[][];
}

/**
 * Data for a gameboard.
 */
export type IGameBoard = IGridDimensions & IGameBoardGrid;
