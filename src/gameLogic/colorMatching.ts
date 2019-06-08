import { IGameBoard, IGridSpace } from "../model/IGameBoard";
import { IGridPos } from "../model/IGameState";
import { IColorMatch } from "../model/IColorMatch";
import { Table } from "../model/Table";
import { ColorType, MatchDirection } from "../model/enums";
import { getGridSpace } from "./helpers";

const MATCH_LENGTH: number = 4;
const X: number = 0;
const Y: number = 1;
const LEFT: number = -1;
const RIGHT: number = 1;
const UP: number = -1;
const DOWN: number = 1;

interface IUniqueMatches {
    [id: string]: IColorMatch;
}

function getBound(gameboard: IGameBoard, direction: number, startPos: number[], posIndex: number): number {
    let p: number[] = Object.assign([], startPos);
    let space: IGridSpace = getGridSpace({x: p[0], y: p[1]}, gameboard);
    let color: ColorType = space.color;

    // start bound at -1 to counter-act extra increment that will occur in loop
    let bound: number = -1;

    // loop until we stop finding a matching color
    do {
        bound++;
        p[posIndex] += direction;
        space = getGridSpace({x: p[0], y: p[1]}, gameboard);
    } while(space !== null && space.color == color);

    return bound;
}

function constructMatchObject(color: ColorType, minBound: number, maxBound: number, pos: number[], posIndex: number, direction: MatchDirection): IColorMatch {
    let startPos: number[] = Object.assign([], pos);
    startPos[posIndex] += minBound;
    return {
        color: color,
        startPos: {x: startPos[0], y: startPos[1]},
        length: maxBound - minBound + 1,
        direction: direction,
    }
}

function constructMatchKey(colorMatch: IColorMatch): string {
    return colorMatch.startPos.x.toString() + '-' + colorMatch.startPos.y.toString() + '-' + colorMatch.direction.toString();
}

export function findColorMatches(gameboard: IGameBoard, dirtySpaces: IGridPos[]): IColorMatch[] {
    let allUniqueMatches: IUniqueMatches = {};
    dirtySpaces.forEach((pos: IGridPos) => {
        // do nothing if there is no data at this position
        let space: IGridSpace = getGridSpace(pos, gameboard);
        if (space == null) {
            return;
        }

        let bounds: number[] = new Array<number>(4).fill(0);
        let startPos: number[] = [pos.x, pos.y];

        // search left
        bounds[0] = -getBound(gameboard, LEFT, startPos, X);
        // search right
        bounds[1] = getBound(gameboard, RIGHT, startPos, X);
        //search up
        bounds[2] = -getBound(gameboard, UP, startPos, Y);
        // search down
        bounds[3] = getBound(gameboard, DOWN, startPos, Y);

        // assemble matches
        let potentialMatches: IColorMatch[] = [];
        potentialMatches.push(constructMatchObject(space.color, bounds[0], bounds[1], startPos, X, MatchDirection.HORIZONTAL));
        potentialMatches.push(constructMatchObject(space.color, bounds[2], bounds[3], startPos, Y, MatchDirection.VERTICAL));

        // determine if they are real matches and only store unique matches
        potentialMatches.forEach((match: IColorMatch) => {
            if (match.length >= MATCH_LENGTH) {
                allUniqueMatches[constructMatchKey(match)] = match;
            }
        });
    });

    // pull all matches from our dictionary and return them as an array
    return Object.keys(allUniqueMatches).map((key: string) => {
        return allUniqueMatches[key];
    });
}
