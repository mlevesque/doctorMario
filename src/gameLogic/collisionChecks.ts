import { IGridPos, IPill, IGameObject } from "../model/IGameState";
import { IGameBoard } from "../model/IGameBoard";

/**
 * Returns if there is a collision at the given position in the given gameboard.
 * A collision is defined as something inhabiting that grid space position or if
 * the position is out of bounds.
 * @param pos 
 * @param gameboard 
 */
export function isCollision(pos: IGridPos, gameboard: IGameBoard): boolean {
    return pos.x < 0 
        || pos.y < 0 
        || pos.x >= gameboard.width 
        || pos.y >= gameboard.height
        || gameboard.grid[pos.y][pos.x] != null;
}

export function hasPillLanded(pill: IPill, gameboard: IGameBoard): boolean {
    let result: boolean = false;
    pill.parts.forEach((part: IGameObject) => {
        let pos = {
            x: part.position.x + pill.position.x, 
            y: part.position.y + pill.position.y + 1};
        if (isCollision(pos, gameboard)) {
            result = true;
        }
    });
    return result;
}
