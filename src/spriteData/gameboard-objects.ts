import data from './gameboard-objects.json';
import { GridPos, TypeColor } from '../model/common.model';
import { ConnectorDirection } from '../model/Gameboard.model';

interface IGameboardObjectsJson {
    VIRUS: {
        [colorKey: string]: GridPos[];
    };

    PILL: {
        [colorKey: string]: {
            [typeKey: string]: GridPos;
        };
    };
}

function getColorObject(color: TypeColor): any {
    switch (color) {
        case TypeColor.RED:
            return 'RED';
        case TypeColor.BLUE:
            return 'BLUE';
        case TypeColor.YELLOW:
            return 'YELLOW'
        default:
            return '';
    }
}

function getPillTypeTag(connector: ConnectorDirection): string {
    switch (connector) {
        case ConnectorDirection.UP:
            return 'DOWN';
        case ConnectorDirection.DOWN:
                return 'UP';
        case ConnectorDirection.LEFT:
                return 'RIGHT';
        case ConnectorDirection.RIGHT:
                return 'LEFT';
        case ConnectorDirection.NONE:
                return 'SINGLE';
        default:
            return '';
    }
}

/**
 * The size in pixels of the width and height of the sprite.
 */
export const GAMEBOARD_SPRITE_SIZE: number = 64;

/**
 * Returns the position location of the virus sprite in the image pulled from the json data.
 * 
 * @param color 
 * @param frame 
 */
export function getGameboardVirusSpriteData(color: TypeColor, frame: number): GridPos {
    return (data as IGameboardObjectsJson).VIRUS[getColorObject(color)][frame];
}

/**
 * Returns the position location of the pill sprite in the image pulled from the json data.
 * @param color 
 * @param connector 
 */
export function getGameboardPillSpriteData(color: TypeColor, connector: ConnectorDirection): GridPos {
    return (data as IGameboardObjectsJson).PILL[getColorObject(color)][getPillTypeTag(connector)];
}
