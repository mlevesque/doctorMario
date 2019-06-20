import gameboardObjectLookupJson from '../data/objectLookup.json';
import animationJson from '../data/animations.json';
import spriteJson from '../data/sprites.json';

import { ColorType, ObjectType } from '../model/enums.js';
import { IGameboardObjectLookupJson, 
         IPillSpriteColorSet,
         ISprite, 
         ISpriteJson, 
         ISpriteAnimationSchema,
         ISpriteAnimationJsonSchema} from '../model/JsonScemas.js';
import { ISpriteAnimationGroup } from '../model/IGameState.js';

/**
 * Returns the animation id for a virus of the given color from Json data.
 * Returns null if color doesn't exist in Json.
 * @param color 
 */
export function getVirusAnimationId(color: ColorType): string {
    return (gameboardObjectLookupJson as IGameboardObjectLookupJson).VIRUS[color];
}

/**
 * Returns the sprite Id for a pill of the given color and type from Json data.
 * Returns null if it can't be found in Json.
 * @param color 
 * @param type 
 */
export function getPillSpriteId(color: ColorType, type: ObjectType): string {
    let json = gameboardObjectLookupJson as IGameboardObjectLookupJson;
    let colorSet: IPillSpriteColorSet = json.PILL[color];
    return colorSet != null ? colorSet[type] : null;
}

/**
 * Returns sprite data with the given sprite id.
 * @param spriteId 
 */
export function getSpriteFromId(spriteId: string): ISprite {
    return (spriteJson as ISpriteJson)[spriteId];
}

/**
 * Returns the sprite data for the given animation id and frame count. If not found, then
 * returns null.
 * @param animationId 
 * @param frameNumber 
 */
export function getSpriteFromAnimation(animationId: string, frameNumber: number): ISprite {
    const animation: ISpriteAnimationSchema = (animationJson as ISpriteAnimationJsonSchema)[animationId];
    if (animation == null || frameNumber >= animation.animationFrames.length) {
        return null;
    }
    const spriteId: string = animation.animationFrames[frameNumber].spriteId;
    return getSpriteFromId(spriteId);
}
