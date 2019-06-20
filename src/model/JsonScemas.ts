/////////////////////////////////////////////////////////////////////////
// OBJECT LOOKUP JSON
/**
 * Schema for a set of pill sprite types for a given color.
 */
export interface IPillSpriteColorSet {
    [typeKey: string]: string;
}

/**
 * Schema for the gameboard object lookup Json file.
 */
export interface IGameboardObjectLookupJson {
    VIRUS: {
        [colorKey: string]: string;
    };

    PILL: {
        [colorKey: string]: IPillSpriteColorSet;
    };
}


/////////////////////////////////////////////////////////////////////////
// ANIMATION JSON
const INFINITE_LOOPS: number = -1;
/**
 * Schema for a single animation frame.
 */
export interface ISpriteAnimationFrameSchema {
    spriteId: string;
    frameInterval: number;
}

/**
 * Schema for a single animation.
 */
export interface ISpriteAnimationSchema {
    animationFrames: ISpriteAnimationFrameSchema[];
    numberOfLoops: number;
}

/**
 * Schema for all defined animations.
 */
export interface ISpriteAnimationJsonSchema {
    [animationId: string]: ISpriteAnimationSchema;
}



/////////////////////////////////////////////////////////////////////////
// SPRITE JSON
/**
 * Describes the slice data for a sprite from an atlas.
 */
export interface ISprite {
    x: number;
    y: number;
    w: number;
    h: number;
}

/**
 * Describes a schema for a json file describing sprite slices.
 */
export interface ISpriteJson {
    [spriteId: string]: ISprite;
}


/////////////////////////////////////////////////////////////////////////
// CONFIG JSON
export interface IConfigJson {
    acceleratedDropInterval: number;
    destroyDelay: number;
    debrisDropInterval: number;
}
