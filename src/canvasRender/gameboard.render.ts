import { GridSpaceData } from "../model/Gameboard.model";
import { GRID_SIZE } from "../constants";
import { ISprite } from "../sprites/model/ISpriteJson.model";
import { getSpriteFromId, getAnimationSetFromId, getVirusAnimationId, getPillSpriteId } from "../sprites/gameboardMethods";
import { ColorType, ObjectType } from "../model/gameObject.model";
import { ISpriteAnimation } from "../sprites/model/ISpriteAnimationJson.model";

export interface DataForGameBoardRender {
    virusAnimationIndex: number;
    spriteSheet: HTMLImageElement;
    grid: GridSpaceData[][];
}

function getSpriteForVirus(color: ColorType, index: number): ISprite {
    let animation: ISpriteAnimation = getAnimationSetFromId(getVirusAnimationId(color));
    return getSpriteFromId(animation.sprites[index]);
}

function renderSprite(  ctx: CanvasRenderingContext2D, 
                        spriteSheet: HTMLImageElement, 
                        sprite: ISprite, 
                        posX: number, 
                        posY: number) {
    ctx.drawImage(spriteSheet, sprite.x, sprite.y, sprite.w, sprite.h, posX, posY, sprite.w, sprite.h);
}

export function renderGameBoard(ctx: CanvasRenderingContext2D, data: DataForGameBoardRender) {

    // clear
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 10000, 10000);

    // determine sprites for viruses
    let redVirus: ISprite = getSpriteForVirus(ColorType.RED, data.virusAnimationIndex);
    let yellowVirus: ISprite = getSpriteForVirus(ColorType.YELLOW, data.virusAnimationIndex);
    let blueVirus: ISprite = getSpriteForVirus(ColorType.BLUE, data.virusAnimationIndex);

    // render grid objects
    data.grid.forEach((row: GridSpaceData[], y:number) => {
        row.forEach((space: GridSpaceData, x:number) => {

            // skip if there is nothing in the grid space
            if (space == null) {
                return;
            }

            let posX: number = x * GRID_SIZE;
            let posY: number = y * GRID_SIZE;

            // render virus
            if (space.type == ObjectType.VIRUS) {
                switch (space.color) {
                    case ColorType.RED:
                        renderSprite(ctx, data.spriteSheet, redVirus, posX, posY);
                        return;
                    case ColorType.YELLOW:
                        renderSprite(ctx, data.spriteSheet, yellowVirus, posX, posY);
                        return;
                    case ColorType.BLUE:
                        renderSprite(ctx, data.spriteSheet, blueVirus, posX, posY);
                        return;
                }
            }

            // render pill
            else {
                let pillSprite: ISprite = getSpriteFromId(getPillSpriteId(space.color, space.type));
                if (pillSprite != null) {
                    renderSprite(ctx, data.spriteSheet, pillSprite, posX, posY);
                }
            }


            // if (space != null) {
            //     let spriteOffset: GridPos = (space.isVirus) 
            //         ? getGameboardVirusSpriteData(space.color, 0)
            //         : getGameboardPillSpriteData(space.color, space.type);
            //     console.log("MLEVESQUE " + JSON.stringify(spriteOffset));
            //     // data.ctx.drawImage(
            //     //     data.spriteSheet, 
            //     //     spriteOffset.x, 
            //     //     spriteOffset.y);
            //     data.ctx.drawImage(
            //         data.spriteSheet,
            //         0,
            //         0,
            //         32,
            //         32,
            //         x * 32,
            //         y * 32,
            //         32,
            //         32);
            //     // data.ctx.drawImage(
            //     //     data.spriteSheet, 
            //     //     spriteOffset.x, 
            //     //     spriteOffset.y, 
            //     //     GAMEBOARD_SPRITE_SIZE, 
            //     //     GAMEBOARD_SPRITE_SIZE, 
            //     //     x*GRID_SIZE, 
            //     //     y*GRID_SIZE, 
            //     //     GRID_SIZE, 
            //     //     GRID_SIZE);
            //     /*data.ctx.fillRect(
            //         x*GRID_SIZE,
            //         y*GRID_SIZE,
            //         GRID_SIZE,
            //         GRID_SIZE
            //     )*/
            // }
        });
    });
}
