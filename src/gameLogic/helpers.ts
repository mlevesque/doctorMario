import { IGridPos } from "../model/IGameState";
import { IGridSpace, IGameBoard } from "../model/IGameBoard";

export function isOutOfBounds(pos: IGridPos, gameboard: IGameBoard): boolean {
    return pos.x < 0 || pos.y < 0 || pos.x >= gameboard.width || pos.y >= gameboard.height;
}

export function getGridSpace(pos: IGridPos, gameboard: IGameBoard): IGridSpace {
    if (isOutOfBounds(pos, gameboard)) {
        return null;
    }
    let result: IGridSpace = gameboard.grid[pos.y][pos.x];
    return result;
}
