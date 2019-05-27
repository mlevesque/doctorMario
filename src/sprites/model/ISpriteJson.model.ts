/**
 * Describes the slice data for a sprite from an atlas.
 */
export interface ISprite {
    x: number,
    y: number,
    w: number;
    h: number;
}

/**
 * Describes a schema for a json file describing sprite slices.
 */
export interface ISpriteJson {
    [spriteId: string]: ISprite;
}
