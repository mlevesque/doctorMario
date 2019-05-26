import { GridSpaceData } from "../model/Gameboard.model";
import { GRID_SIZE } from "../constants";

export function renderGameBoard(ctx:CanvasRenderingContext2D, grid:GridSpaceData[][]) {
    grid.forEach((row: GridSpaceData[], y:number) => {
        row.forEach((data: GridSpaceData, x:number) => {
            if (data != null) {
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(x*GRID_SIZE, y*GRID_SIZE, GRID_SIZE, GRID_SIZE);
            }
        });
    });
}
