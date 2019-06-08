export enum InputType {
    ROTATE = "ROTATE",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
    DOWN = "DOWN",
}

/**
 * Color designator for a virus or pill half
 */
export enum ColorType {
    RED = "RED",
    YELLOW = "YELLOW",
    BLUE = "BLUE"
}

/**
 * The type of game object, and also what sprite to use.
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
 * Values for the 4 different rotation states for a pill.
 */
export enum PillRotation {
    HORIZ = 0,
    VERT,
    HORIZ_FLIPPED,
    VERT_FLIPPED,
    TOTAL_ROTATIONS,
    NO_ROTATION = 100
}

/**
 * Values for all actions regarding a rotate action of a pill. Used when
 * checking potential rotate action for a pill within a gameboard taking
 * into account collisions.
 */
export enum PillRotateAction {
    FAIL = 0,
    NO_KICK,
    KICK_LEFT,
    KICK_RIGHT,
    KICK_DOWN,
    KICK_DOWN_RIGHT
}

/**
 * Values for all game flow states during gameplay.
 */
export enum FlowState {
    THROW_IN_PILL = 0,      // Mario throws in a new pill
    CONTROL_PILL,           // Player moves and places pill
    DESTROY_OBJECTS,        // game objects go through destroy animation around newly placed pill
    FRAGMENT_FALL           // remainder pill fragments fall after destruction
}

export enum MatchDirection {
    VERTICAL = 0,
    HORIZONTAL
}
