import gameboardObjectLookupJson from '../data/objectLookup.json';
import animationJson from '../data/animations.json';
import spriteJson from '../data/sprites.json';

import { ColorType, ObjectType } from '../model/enums.js';
import { IGameboardObjectLookupJson, 
         IPillSpriteColorSet, 
         ISpriteAnimation, 
         ISpriteAnimationJson, 
         ISprite, 
         ISpriteJson } from '../model/JsonScemas.js';

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
 * Returns a sprite animation set with the given id from Json data.
 * Returns null if it can't be found in Json.
 * @param animationId 
 */
export function getAnimationSetFromId(animationId: string): ISpriteAnimation {
    return (animationJson as ISpriteAnimationJson)[animationId];
}

/**
 * Returns sprite data with the given sprite id from Json data.
 * Returns null if it can't be found in Json.
 * @param spriteId 
 */
export function getSpriteFromId(spriteId: string): ISprite {
    return (spriteJson as ISpriteJson)[spriteId];
}
