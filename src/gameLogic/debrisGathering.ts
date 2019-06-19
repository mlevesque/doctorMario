import { IGameBoard, IGridSpace } from "../model/IGameBoard";
import { IGridPos, IPill, IGameObject } from "../model/IGameState";
import { Table } from "../model/Table";
import { Queue } from "../model/Queue";
import { convertGameboardToTable } from "./helpers";
import { ObjectType, PillRotation } from "../model/enums";

interface IMatchingSet {
    [key: string]: ObjectType;
}

const matchingSet: IMatchingSet = {
    [ObjectType.PILL_LEFT]: ObjectType.PILL_RIGHT,
    [ObjectType.PILL_BOTTOM]: ObjectType.PILL_TOP
}

function isValidObjectType(type: ObjectType): boolean {
    return type != ObjectType.DESTROYED && type != ObjectType.VIRUS;
}

function shouldConsiderSpace(space: IGridSpace, position: IGridPos, visited: Table<boolean>): boolean {
    return space 
        && !visited.getValue(position.x, position.y) 
        && isValidObjectType(space.type);
}

function getOffsetFromType(type: ObjectType): IGridPos {
    switch(type) {
        case ObjectType.PILL_RIGHT:
            return {x: 1, y: 0};
        case ObjectType.PILL_TOP:
            return {x: 0, y: -1};
        case ObjectType.PILL_BOTTOM:
        case ObjectType.PILL_LEFT:
        case ObjectType.PILL_SINGLE:
        default:
            return {x: 0, y: 0};
    }
}

function getPositionOfOtherHalf(position: IGridPos, type: ObjectType): IGridPos {
    switch(type) {
        case ObjectType.PILL_BOTTOM:
            return {x: position.x, y: position.y - 1};
        case ObjectType.PILL_TOP:
                return {x: position.x, y: position.y + 1};
        case ObjectType.PILL_LEFT:
                return {x: position.x + 1, y: position.y};
        case ObjectType.PILL_RIGHT:
                return {x: position.x - 1, y: position.y};
    }
    return {x: -1, y: -1};
}

function isMatchingSet(firstType: ObjectType, secondType: ObjectType): boolean {
    return matchingSet[firstType] == secondType || matchingSet[secondType] == firstType;
}

function getPillRotationByFirstPartType(firstType: ObjectType): PillRotation {
    switch(firstType) {
        case ObjectType.PILL_BOTTOM:
        case ObjectType.PILL_TOP:
            return PillRotation.VERT;
        default:
            return PillRotation.HORIZ;
    }
}

function isPivotPart(type: ObjectType): boolean {
    return type == ObjectType.PILL_BOTTOM || type == ObjectType.PILL_LEFT || type == ObjectType.PILL_SINGLE;
}

function buildPill( position: IGridPos, 
                    gameTable: Table<IGridSpace>, 
                    visited: Table<boolean>, 
                    queue: Queue<IGridPos>, 
                    positionList: IGridPos[]): IPill {
    let firstSpace: IGridSpace = gameTable.getValue(position.x, position.y);
    if (firstSpace == null) {
        return null;
    }

    // this is the main position of the pill. This may shift if the second
    // part is in the pivot position
    let pillPosition: IGridPos = {x: position.x, y: position.y};

    // build part with starting position
    let parts: IGameObject[] = [{
        color: firstSpace.color,
        type: firstSpace.type,
        position: null // will be set later
    }];
    visited.setValue(position.x, position.y, true);
    queue.push({x: position.x, y: position.y});
    positionList.push({x: position.x, y: position.y});

    // build other part
    // if other part is valid, we mark it as visited
    let otherPos: IGridPos = getPositionOfOtherHalf(position, firstSpace.type);
    let otherSpace: IGridSpace = gameTable.getValue(otherPos.x, otherPos.y);
    if (shouldConsiderSpace(otherSpace, otherPos, visited) 
        && isMatchingSet(firstSpace.type, otherSpace.type)) {
        parts.push({
            color: otherSpace.color,
            type: otherSpace.type,
            position: getOffsetFromType(otherSpace.type)
        });
        visited.setValue(otherPos.x, otherPos.y, true);
        queue.push({x: otherPos.x, y: otherPos.y});
        positionList.push({x: otherPos.x, y: otherPos.y});

        // if this part is the pivot part, set pill position to
        //  this position
        if (isPivotPart(parts[1].type)) {
            pillPosition = {x: otherPos.x, y: otherPos.y};
        }
    }

    // if there is no other part, change first part type to single
    if (parts.length < 2) {
        parts[0].type = ObjectType.PILL_SINGLE;
    }
    
    // set position offset for first part
    // we do this here because the object type may have changed
    parts[0].position = getOffsetFromType(parts[0].type);

    // return pill
    return {
        parts: parts,
        position: pillPosition,
        rotationState: getPillRotationByFirstPartType(parts[0].type)
    };
}

function resolveSpace(
            pos: IGridPos, 
            gameTable: Table<IGridSpace>, 
            queue: Queue<IGridPos>, 
            visited: Table<boolean>,
            pillList: IPill[],
            positionList: IGridPos[]): void {
    pillList.push(buildPill(pos, gameTable, visited, queue, positionList));
}


export interface IDebrisResults {
    pills: IPill[];
    positions: IGridPos[];
}

export function gatherDebris(gameboard: IGameBoard, dirtySpaces: IGridPos[]): IDebrisResults {
    let pills: IPill[] = [];
    let positions: IGridPos[] = [];
    let gameTable: Table<IGridSpace> = convertGameboardToTable(gameboard);
    let visited: Table<boolean> = new Table<boolean>(gameboard.width, gameboard.height, false);
    let queue: Queue<IGridPos> = new Queue<IGridPos>();
    
    // add all dirty spaces to queue and mark as visited
    dirtySpaces.forEach((value: IGridPos) => {
        queue.push(value);
        visited.setValue(value.x, value.y, true);
    });

    // handle special case for side pill halves that were connected to pills that got destroyed
    let space: IGridSpace;
    let pos: IGridPos;
    dirtySpaces.forEach((value: IGridPos) => {
        // build pill on left if connected
        pos = {x: value.x - 1, y: value.y};
        space = gameTable.getValue(pos.x, pos.y);
        if (shouldConsiderSpace(space, pos, visited)
                && space.type == ObjectType.PILL_LEFT) {
            resolveSpace(pos, gameTable, queue, visited, pills, positions);
        }

        // build pill on right if connected
        pos = {x: value.x + 1, y: value.y};
        space = gameTable.getValue(pos.x, pos.y);
        if (shouldConsiderSpace(space, pos, visited)
                && space.type == ObjectType.PILL_RIGHT) {
            resolveSpace(pos, gameTable, queue, visited, pills, positions);
        }
    });

    // now we perform a search and build pills for everything existing above every position in the
    //  queue
    while (!queue.isEmpty()) {
        // pop position from queue
        pos = queue.pop();

        // consider space above position
        pos = {x: pos.x, y: pos.y - 1};
        space = gameTable.getValue(pos.x, pos.y);
        if (shouldConsiderSpace(space, pos, visited)) {
            resolveSpace(pos, gameTable, queue, visited, pills, positions);
        }
    }// end while

    return {
        pills: pills,
        positions: positions
    };
}
