/**
 * Describes data for a sprite animation.
 */
export interface ISpriteAnimation {
    loop: boolean;
    interval: number;
    sprites: string[];
}

/**
 * Schema for a sprite animation Json file.
 */
export interface ISpriteAnimationJson {
    [animationId: string]: ISpriteAnimation;
}
