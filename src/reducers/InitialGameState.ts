import { IGameState } from "../model/IGameState";
import { ColorType, ObjectType } from "../model/enums";

export const InitialGameState:IGameState = {
    gameboard: {
        width: 5,
        height: 5,
        grid: [
            [null, {color: ColorType.RED, type: ObjectType.VIRUS}],
            [null, null, {color: ColorType.YELLOW, type: ObjectType.VIRUS}, {color: ColorType.BLUE, type: ObjectType.VIRUS}]
        ]
    },
    floatingPill: {
        pill: null,
        dropInterval: 1000
    },
    virusGameboardAnimation: {
        elapsedTime: 0,
        frameIndex: 0
    }
}
