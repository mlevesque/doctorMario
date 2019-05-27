import { GameState } from "../model/GameState.model";
import { ColorType, ObjectType } from "../model/gameObject.model";

export const InitialGameState:GameState = {
    gameboard: {
        width: 5,
        height: 5,
        grid: [
            [null, {color: ColorType.RED, type: ObjectType.VIRUS}],
            [null, null, {color: ColorType.YELLOW, type: ObjectType.VIRUS}, {color: ColorType.BLUE, type: ObjectType.VIRUS}]
        ]
    }
}
