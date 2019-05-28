import { number } from "prop-types";
import { GameBoardBuildData } from "./actions/model/GameboardActions.model";
import { GridPos } from "./model/common.model";
import { ColorType } from "./model/gameObject.model";

const FAIL_LIMIT: number = 5;
const NUMBER_OF_RESTRICTED_ROWS: number = 3;
const MAX_ATTEMPTS: number = 20;

/**
 * Masks used for indicating where a given space is restricted to a set of colors.
 */
enum ColorMask {
    CLEAR = 0,
    RED = 1,
    YELLOW = 2,
    BLUE = 4,
    ALL = 7
}

interface IVirusDataPair {
    color: ColorType;
    colorMask: ColorMask;
}

function randomlyChooseGridSpace(width: number, height: number): GridPos {
    return {
        x: Math.floor(Math.random() * width),
        y: NUMBER_OF_RESTRICTED_ROWS + Math.floor(Math.random() * (height - NUMBER_OF_RESTRICTED_ROWS))
    }
}

function isAvailable(maskGrid: GameBoardBuildData<number>, width: number, height: number, pos: GridPos): boolean {
    return pos.x >= 0
        && pos.y > NUMBER_OF_RESTRICTED_ROWS
        && pos.x < width
        && pos.y < height
        && maskGrid.getValue(pos.x, pos.y) != ColorMask.ALL;
}

function findAvailable(maskGrid: GameBoardBuildData<number>, width: number, height: number, startPos: GridPos): GridPos {
    let potentialPos: GridPos = Object.assign({}, startPos);
    let step: number = 1;
    let direction: number = 0;
    let attempts: number = 0;
    while (attempts < MAX_ATTEMPTS && !isAvailable(maskGrid, width, height, potentialPos)) {
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
    return (attempts >= MAX_ATTEMPTS) ? null : potentialPos;
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

export function buildVirusGameboard(width: number, height: number, redCount: number, yellowCount: number, blueCount: number): GameBoardBuildData<string> {
    let remainingRed: number = Math.max(0, redCount);
    let remainingYellow: number = Math.max(0, yellowCount);
    let remainingBlue: number = Math.max(0, blueCount);

    let gameboard: GameBoardBuildData<string> = new GameBoardBuildData<string>(width, height, '');
    let maskBoard: GameBoardBuildData<number> = new GameBoardBuildData<number>(width, height, 0);

    // fail count keeps track of how many iteractions we fail to add a virus to the grid
    let failCount: number = 0;

    // loop until we've added all the viruses that we can
    while ((remainingRed > 0 || remainingYellow > 0 || remainingBlue > 0) && failCount < FAIL_LIMIT) {

        // get position
        let pos: GridPos = randomlyChooseGridSpace(width, height);
        pos = findAvailable(maskBoard, width, height, pos);
        if (pos == null) {
            failCount++;
            continue;
        }

        // choose virus
        let mask: number = maskBoard.getValue(pos.x, pos.y);
        mask |= remainingRed > 0 ? 0 : ColorMask.RED;
        mask |= remainingYellow > 0 ? 0 : ColorMask.YELLOW;
        mask |= remainingBlue > 0 ? 0 : ColorMask.BLUE;
        let virusData: IVirusDataPair = chooseVirus(mask);
        if (virusData == null) {
            failCount++;
            continue;
        }

        // add virus
        gameboard.setValue(pos.x, pos.y, virusData.color);
        switch(virusData.color) {
            case ColorType.RED: remainingRed--; break;
            case ColorType.YELLOW: remainingYellow--; break;
            case ColorType.BLUE: remainingBlue--; break;
        }

        // set masks around virus
        maskBoard.setValue(pos.x, pos.y, ColorMask.ALL);
        maskBoard.setValue(pos.x-2, pos.y, maskBoard.getValue(pos.x-2, pos.y) | virusData.colorMask);
        maskBoard.setValue(pos.x+2, pos.y, maskBoard.getValue(pos.x+2, pos.y) | virusData.colorMask);
        maskBoard.setValue(pos.x, pos.y-2, maskBoard.getValue(pos.x, pos.y-2) | virusData.colorMask);
        maskBoard.setValue(pos.x, pos.y+2, maskBoard.getValue(pos.x, pos.y+2) | virusData.colorMask);
    }

    return gameboard;
}
