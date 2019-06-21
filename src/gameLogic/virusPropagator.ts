import { Table } from "../model/Table";
import { ColorType } from "../model/enums";
import { IGridPos } from "../model/IGameState";
import configJson from "../data/config.json";

/**
 * Masks used for indicating where a given space is restricted to a set of colors.
 */
enum ColorMask {
    CLEAR   = 0b000,  
    RED     = 0b100,
    YELLOW  = 0b010,
    BLUE    = 0b001,
    ALL     = 0b111
}

interface IVirusDataPair {
    color: ColorType;
    colorMask: ColorMask;
}

function randomlyChooseGridSpace(width: number, height: number, virusCeiling: number): IGridPos {
    return {
        x: Math.floor(Math.random() * width),
        y: virusCeiling + Math.floor(Math.random() * (height - virusCeiling))
    }
}

function isAvailable(maskGrid: Table<number>, width: number, height: number, pos: IGridPos, virusCeiling: number): boolean {
    return pos.x >= 0
        && pos.y > virusCeiling
        && pos.x < width
        && pos.y < height
        && maskGrid.getValue(pos.x, pos.y) != ColorMask.ALL;
}

function findAvailable(maskGrid: Table<number>, width: number, height: number, startPos: IGridPos, virusCeiling: number): IGridPos {
    let potentialPos: IGridPos = Object.assign({}, startPos);
    let step: number = 1;
    let direction: number = 0;
    let attempts: number = 0;
    while (attempts < configJson.propagationPositionFindLimit 
        && !isAvailable(maskGrid, width, height, potentialPos, virusCeiling)) {
        potentialPos = Object.assign({}, startPos);
        switch (direction) {
            case 0:
                potentialPos.x += step;
                break;
            case 1:
                potentialPos.x -= step;
                break;
            case 2:
                potentialPos.y += step;
                break;
            case 3:
                potentialPos.y -= step;
                break;
        }

        // change cardinal direction. When we have hit all 4 directions, then we reset direction and start stepping
        // out one more space farther in our search for an available grid space
        direction++;
        if (direction > 3) {
            direction = 0;
            step++;
        }
        attempts++;
    }
    return (attempts >= configJson.propagationPositionFindLimit) ? null : potentialPos;
}

function chooseVirus(mask: number): IVirusDataPair {
    if ((mask & ColorMask.ALL) == ColorMask.ALL) {
        return null;
    }

    // build list
    let list: IVirusDataPair[] = [];
    if ((mask & ColorMask.RED) == 0) list.push({color: ColorType.RED, colorMask: ColorMask.RED});
    if ((mask & ColorMask.YELLOW) == 0) list.push({color: ColorType.YELLOW, colorMask: ColorMask.YELLOW});
    if ((mask & ColorMask.BLUE) == 0) list.push({color: ColorType.BLUE, colorMask: ColorMask.BLUE});

    // choose one
    let index: number = Math.floor(Math.random() * list.length);
    return list[index];
}


export interface IAddVirusResult {
    successful: boolean;
    position?: IGridPos;
    color?: ColorType;
}

export function attemptToAddVirus(maskBoard: Table<number>, considerRed: boolean, considerYellow: boolean, considerBlue: boolean, virusCeiling: number): IAddVirusResult {
    // randomly choose position position
    const width: number = maskBoard.width;
    const height: number = maskBoard.height;
    let pos: IGridPos = randomlyChooseGridSpace(width, height, virusCeiling);
    pos = findAvailable(maskBoard, width, height, pos, virusCeiling);
    if (pos == null) {
        return {
            successful: false
        };
    }

    // choose virus
    let mask: number = maskBoard.getValue(pos.x, pos.y);
    mask |= considerRed ? 0 : ColorMask.RED;
    mask |= considerYellow ? 0 : ColorMask.YELLOW;
    mask |= considerBlue ? 0 : ColorMask.BLUE;
    let virusData: IVirusDataPair = chooseVirus(mask);
    if (virusData == null) {
        return {
            successful: false,
            position: pos
        };
    }

    // set masks around virus
    maskBoard.setValue(pos.x, pos.y, ColorMask.ALL);
    maskBoard.setValue(pos.x-2, pos.y, maskBoard.getValue(pos.x-2, pos.y) | virusData.colorMask);
    maskBoard.setValue(pos.x+2, pos.y, maskBoard.getValue(pos.x+2, pos.y) | virusData.colorMask);
    maskBoard.setValue(pos.x, pos.y-2, maskBoard.getValue(pos.x, pos.y-2) | virusData.colorMask);
    maskBoard.setValue(pos.x, pos.y+2, maskBoard.getValue(pos.x, pos.y+2) | virusData.colorMask);

    // success
    return {
        successful: true,
        position: pos,
        color: virusData.color
    };
}

export function buildVirusGameboard(width: number, height: number, redCount: number, yellowCount: number, blueCount: number, virusCeiling: number): Table<ColorType> {
    let remainingRed: number = Math.max(0, redCount);
    let remainingYellow: number = Math.max(0, yellowCount);
    let remainingBlue: number = Math.max(0, blueCount);

    let gameboard: Table<ColorType> = new Table<ColorType>(width, height);
    let maskBoard: Table<number> = new Table<number>(width, height, 0);

    // fail count keeps track of how many iteractions we fail to add a virus to the grid
    let failCount: number = 0;

    // loop until we've added all the viruses that we can
    while ((remainingRed > 0 || remainingYellow > 0 || remainingBlue > 0) && failCount < configJson.propagationFailureLimit) {
        // attempt to add virus
        let addVirusResult: IAddVirusResult = attemptToAddVirus(
                                                    maskBoard, 
                                                    remainingRed > 0,
                                                    remainingYellow > 0,
                                                    remainingBlue > 0,
                                                    virusCeiling);
        if (addVirusResult.successful) {
            // decrement virus count
            switch(addVirusResult.color) {
                case ColorType.RED: remainingRed--; break;
                case ColorType.YELLOW: remainingYellow--; break;
                case ColorType.BLUE: remainingBlue--; break;
            }

            // add virus to gameboard
            gameboard.setValue(addVirusResult.position.x, addVirusResult.position.y, addVirusResult.color);
        }

        // increment failure count if unsuccessful
        else {
            failCount++;
        }
    }

    return gameboard;
}
