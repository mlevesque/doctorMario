import { GridSpaceData } from "../model/Gameboard.model";
import { GRID_SIZE } from "../constants";
import { GridPos } from "../model/common.model";
import {    getGameboardVirusSpriteData, 
            getGameboardPillSpriteData, 
            GAMEBOARD_SPRITE_SIZE } from "../spriteData/gameboard-objects";
import { createContext } from "react";

export interface DataForGameBoardRender {
    ctx: CanvasRenderingContext2D;
    spriteSheet: HTMLImageElement;
    grid: GridSpaceData[][];
}

export function renderGameBoard(data: DataForGameBoardRender) {
    data.ctx.fillStyle = 'black';
    data.ctx.fillRect(0, 0, 1000, 1000);

    data.grid.forEach((row: GridSpaceData[], y:number) => {
        row.forEach((space: GridSpaceData, x:number) => {
            if (space != null) {
                let spriteOffset: GridPos = (space.isVirus) 
                    ? getGameboardVirusSpriteData(space.color, 0)
                    : getGameboardPillSpriteData(space.color, space.connector);
                console.log("MLEVESQUE " + JSON.stringify(spriteOffset));
                // data.ctx.drawImage(
                //     data.spriteSheet, 
                //     spriteOffset.x, 
                //     spriteOffset.y);
                data.ctx.drawImage(
                    data.spriteSheet,
                    0,
                    0,
                    32,
                    32,
                    x * 32,
                    y * 32,
                    32,
                    32);
                // data.ctx.drawImage(
                //     data.spriteSheet, 
                //     spriteOffset.x, 
                //     spriteOffset.y, 
                //     GAMEBOARD_SPRITE_SIZE, 
                //     GAMEBOARD_SPRITE_SIZE, 
                //     x*GRID_SIZE, 
                //     y*GRID_SIZE, 
                //     GRID_SIZE, 
                //     GRID_SIZE);
                /*data.ctx.fillRect(
                    x*GRID_SIZE,
                    y*GRID_SIZE,
                    GRID_SIZE,
                    GRID_SIZE
                )*/
            }
        });
    });
}
