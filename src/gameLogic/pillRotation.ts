import { IPill, IGameObject, IGridPos } from "../model/IGameState";
import { PillRotation, ObjectType, PillRotateAction } from "../model/enums";
import { IGameBoard } from "../model/IGameBoard";
import { isCollision } from "./collisionChecks";

/**
 * Returns if the given rotation is a vertical one.
 * @param rotation 
 */
function __isVertical(rotation: PillRotation): boolean {
    return rotation == PillRotation.VERT 
        || rotation == PillRotation.VERT_FLIPPED;
}

/**
 * Returns true if the given rotation value is a valid rotation, ie VERT, HORIZ, VERT_FLIPPED,
 * or HORIZ_FLIPPED.
 * @param rotation 
 */
function __isValidRotation(rotation: PillRotation): boolean {
    return rotation < PillRotation.TOTAL_ROTATIONS;
}

/**
 * Returns if the given pill can have it's rotation set. Rotation cannot be set on a pill unless
 * it consists of two parts.
 * @param pill 
 */
function __canSetRotation(pill: IPill): boolean {
    return pill.parts.length == 2;
}

/**
 * Returns if the given pill can be rotated 90 degrees from its current rotation. It can rotate
 * only if the pill is in two parts and it's current rotation value is valid.
 * @param pill 
 */
function __canRotate(pill: IPill): boolean {
    return __canSetRotation(pill) && __isValidRotation(pill.rotationState);
}

/**
 * Sets the position values and object types the given pill when rotated to the given rotation.
 * @param pill
 * @param rotation 
 */
function __setRotationForPill(pill: IPill, rotation: PillRotation): void {
    let part1: IGameObject = pill.parts[0];
    let part2: IGameObject = pill.parts[1];

    switch (rotation) {
        case PillRotation.HORIZ:
            part1.position = {x:0, y:0}
            part2.position = {x:1, y:0}
            part1.type = ObjectType.PILL_LEFT;
            part2.type = ObjectType.PILL_RIGHT;
            break;
        case PillRotation.VERT:
            part1.position = {x:0, y:1}
            part2.position = {x:0, y:0}
            part1.type = ObjectType.PILL_BOTTOM;
            part2.type = ObjectType.PILL_TOP;
            break;
        case PillRotation.HORIZ_FLIPPED:
            part1.position = {x:1, y:0}
            part2.position = {x:0, y:0}
            part1.type = ObjectType.PILL_RIGHT;
            part2.type = ObjectType.PILL_LEFT;
            break;
        case PillRotation.VERT_FLIPPED:
            part1.position = {x:0, y:0}
            part2.position = {x:0, y:1}
            part1.type = ObjectType.PILL_TOP;
            part2.type = ObjectType.PILL_BOTTOM;
            break;
    }

    pill.rotationState = rotation;
}

/**
 * Rotates the pill clockwise.
 * @param pill 
 */
function __rotatePill(pill: IPill): void {
    __setRotationForPill(pill, (pill.rotationState + 1) % PillRotation.TOTAL_ROTATIONS);
}

/**
 * This returns a rotation action that would need to be taken if the given pill is to
 * rotate clockwise at its current position in the given gameboard. This checks gameboard
 * collisions to determine is a rotation is possible or if a kick needs to happen. A kick
 * means that the pill will need to shift in a certain direction in oder to avoid
 * colliding with something in the gameboard.
 * @param pill 
 * @param gameboard 
 */
function __determineRotateAction(pill: IPill, gameboard: IGameBoard): PillRotateAction {
    let pos: IGridPos = pill.position;
    
    // If pill is vertical, then we check both sides for collision.
    // if collision on both sides: fail.
    // if collision on right side: kick left.
    if (__isVertical(pill.rotationState)) {
        let right: boolean = isCollision({x:pos.x+1, y:pos.y}, gameboard);
        let left: boolean = isCollision({x:pos.x-1, y:pos.y}, gameboard);
        if (right && left) {
            return PillRotateAction.FAIL;
        }
        else if (right) {
            return PillRotateAction.KICK_LEFT;
        }
    }

    // If pill is horizontal...
    // if collision on top, but top is out-of-bounds: no kick
    // if collision on top only: kick right.
    // if collision on top and top-right: kick down.
    // if collision on top, top-right, and bottom: kick down-right
    // if collision on top, top-right, bottom, and bottom-right: fail
    else {
        // check top out-of-bounds
        if (pos.y == 0) {
            return PillRotateAction.NO_KICK;
        }
        let top: boolean = isCollision({x:pos.x, y:pos.y-1}, gameboard);
        let top_right: boolean = isCollision({x:pos.x+1, y:pos.y-1}, gameboard);
        let bottom: boolean = isCollision({x:pos.x, y:pos.y+1}, gameboard);
        let bottom_right: boolean = isCollision({x:pos.x+1, y:pos.y+1}, gameboard);
        if (top && top_right && bottom && bottom_right) {
            return PillRotateAction.FAIL;
        }
        else if (top && top_right && bottom) {
            return PillRotateAction.KICK_DOWN_RIGHT;
        }
        else if (top && top_right) {
            return PillRotateAction.KICK_DOWN;
        }
        else if (top) {
            return PillRotateAction.KICK_RIGHT;
        }
    }

    //if none of the checks passed, then no kick
    return PillRotateAction.NO_KICK;
}


/**
 * Attempts to rotate the given pill in the given gameboard. Returns true if the rotation was
 * successful.
 * When rotating, the pill may be shifted left, right, or down in order to avoid colliding with
 * something in gameboard.
 * It is possible that the rotation fails and won't happen if there is no room for the pill to
 * rotate in it's current position in teh gameboard due to too many collisions surrounding it.
 * If the rotation fails, the pill is left unchanged.
 * @param pill 
 * @param gameboard 
 */
export function rotatePill(pill: IPill, gameboard: IGameBoard): boolean {
    // we can't rotate if the pill can't be rotated as it is:
    //  current rotation is invalid or is not in two parts
    if (!__canRotate(pill)) {
        return false;
    }

    // get rotation action
    let action: PillRotateAction = __determineRotateAction(pill, gameboard);

    // if action is fail, then we can't rotate, so we are done
    if (action == PillRotateAction.FAIL) {
        return false;
    }

    // perform rotation
    __rotatePill(pill);

    // perform kick if we need to
    switch (action) {
        case PillRotateAction.KICK_DOWN:
            pill.position.y--;
            break;
        case PillRotateAction.KICK_DOWN_RIGHT:
            pill.position.y--;
            pill.position.x++;
            break;
        case PillRotateAction.KICK_LEFT:
            pill.position.x--;
            break;
        case  PillRotateAction.KICK_RIGHT:
            pill.position.x++;
            break;
    }

    // we are done!
    return true;
}
