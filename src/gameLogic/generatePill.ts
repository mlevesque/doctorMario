import { IPill, IGridPos } from "../model/IGameState";
import { ColorType, ObjectType, PillRotation } from "../model/enums";
import { IGameBoard } from "../model/IGameBoard";

export function generateFloatingPill(gameboard: IGameBoard): IPill {
    // randomly choose colors
    let colors: ColorType[] = new Array<ColorType>(2);
    for (let i = 0; i < 2; ++i) {
        let num: number = Math.floor(Math.random() * 3);
        switch(num) {
            case 0:
                colors[i] = ColorType.RED;
                break;
            case 1:
                colors[i] = ColorType.YELLOW;
                break;
            case 2:
                colors[i] = ColorType.BLUE;
                break;
        }
    }
    
    return {
        parts: [{
            color: colors[0],
            type: ObjectType.PILL_LEFT,
            position: {x:0, y:0}
        },
        {
            color: colors[1],
            type: ObjectType.PILL_RIGHT,
            position: {x:1, y:0}
        }],
        position: {x:Math.floor(gameboard.width / 2), y:0},
        rotationState: PillRotation.HORIZ,
    }
}
