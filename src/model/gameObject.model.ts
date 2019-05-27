import { GridPos } from "./common.model";

/**
 * Color designator for a virus or pill half
 */
export enum ColorType {
    RED = "RED",
    YELLOW = "YELLOW",
    BLUE = "BLUE"
}

/**
 * Describes if the given grid space is connected to an adjacent grid space.
 * This is used to maintain connections for pills.
 */
export enum ObjectType {
    VIRUS = "VIRUS",
    PILL_SINGLE = "PILL_SINGLE",
    PILL_LEFT = "PILL_LEFT",
    PILL_RIGHT = "PILL_RIGHT",
    PILL_TOP = "PILL_TOP",
    PILL_BOTTOM = "PILL_BOTTOM",
    DESTROYED = "DESTROYED"
}

/**
 * Describes one half of a pill.
 */
export interface IGameObject {
    color: ColorType;
    type: ObjectType;
    position: GridPos;
}

/**
 * Describes a single full pill.
 */
export class Pill {
    parts: IGameObject[];
}
