import { ISprite, ISpriteAnimation } from "../model/JsonScemas";
import { ColorType, ObjectType } from "../model/enums";
import { getAnimationSetFromId, getVirusAnimationId, getSpriteFromId, getPillSpriteId } from "./JsonDataMethods";
import { IGridSpace, IGameBoard } from "../model/IGameBoard";
import { GRID_SIZE } from "../constants";
import { IPill, IGameObject, IGridPos } from "../model/IGameState";


export interface IRenderGameParams {
    gameboard: IGameBoard;
    pills: IPill[];
    pillVerticalOffset: number;
    virusAnimationFrame: number;
}


/**
 * Returns the sprite data for a virus with the given color and of the given frame index
 * @param color 
 * @param frameIndex 
 */
function getSpriteForVirus(color: ColorType, frameIndex: number): ISprite {
    let animation: ISpriteAnimation = getAnimationSetFromId(getVirusAnimationId(color));
    return getSpriteFromId(animation.sprites[frameIndex]);
}

/**
 * Renders a sprite.
 * @param ctx 
 * @param spriteSheet 
 * @param sprite 
 * @param posX 
 * @param posY 
 */
function renderSprite(  ctx: CanvasRenderingContext2D, 
                        spriteSheet: HTMLImageElement, 
                        sprite: ISprite, 
                        posX: number, 
                        posY: number) {
    ctx.drawImage(spriteSheet, sprite.x, sprite.y, sprite.w, sprite.h, posX, posY, sprite.w, sprite.h);
}

function renderGameboard(   ctx: CanvasRenderingContext2D,
                            spriteSheet: HTMLImageElement,
                            params: IRenderGameParams) {
    // get sprites for viruses
    let redVirus: ISprite = getSpriteForVirus(ColorType.RED, params.virusAnimationFrame);
    let yellowVirus: ISprite = getSpriteForVirus(ColorType.YELLOW, params.virusAnimationFrame);
    let blueVirus: ISprite = getSpriteForVirus(ColorType.BLUE, params.virusAnimationFrame);

    // render grid objects
    params.gameboard.grid.forEach((row: IGridSpace[], y:number) => {
        row.forEach((space: IGridSpace, x:number) => {
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
                        renderSprite(ctx, spriteSheet, redVirus, posX, posY);
                        return;
                    case ColorType.YELLOW:
                        renderSprite(ctx, spriteSheet, yellowVirus, posX, posY);
                        return;
                    case ColorType.BLUE:
                        renderSprite(ctx, spriteSheet, blueVirus, posX, posY);
                        return;
                }
            }

            // render pill
            else {
                let pillSprite: ISprite = getSpriteFromId(getPillSpriteId(space.color, space.type));
                if (pillSprite != null) {
                    renderSprite(ctx, spriteSheet, pillSprite, posX, posY);
                }
            }
        });
    });
}

function renderFloatingPill(ctx: CanvasRenderingContext2D,
                            spriteSheet: HTMLImageElement,
                            pill: IPill,
                            yOffset: number): void {
    pill.parts.forEach((part: IGameObject) => {
        let sprite: ISprite = getSpriteFromId(getPillSpriteId(part.color, part.type));
        let pos: IGridPos = {
            x: (part.position.x + pill.position.x) * GRID_SIZE,
            y: (part.position.y + pill.position.y) * GRID_SIZE + yOffset
        };
        renderSprite(ctx, spriteSheet, sprite, pos.x, pos.y);
    });
}

/**
 * Performs a full render of the game.
 * @param ctx 
 * @param spriteSheet 
 * @param params 
 */
export function renderGame( ctx: CanvasRenderingContext2D,
                            spriteSheet: HTMLImageElement,
                            params: IRenderGameParams): void {

    ctx.save();

    // clear
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 10000, 10000);

    renderGameboard(ctx, spriteSheet, params);
    params.pills.forEach((pill: IPill) => {
        renderFloatingPill(ctx, spriteSheet, pill, params.pillVerticalOffset);
    });

    ctx.restore();
}
