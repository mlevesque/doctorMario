import { IGameState } from "../model/IGameState";
import { ColorType, ObjectType, InputType } from "../model/enums";

export const InitialGameState:IGameState = {
    inputs: {
        [InputType.ROTATE]: {previous: false, current: false},
        [InputType.LEFT]: {previous: false, current: false},
        [InputType.RIGHT]: {previous: false, current: false},
        [InputType.DOWN]: {previous: false, current: false},
    },

    gameboard: {
        width: 5,
        height: 5,
        grid: [
            [null, {color: ColorType.RED, type: ObjectType.VIRUS}],
            [null, null, {color: ColorType.YELLOW, type: ObjectType.VIRUS}, {color: ColorType.BLUE, type: ObjectType.VIRUS}]
        ]
    },
    controlPill: {
        pill: null,
        dropInterval: 1000,
        elapsedTime: 0,
        slideCooldown: 0,
    },
    virusGameboardAnimation: {
        elapsedTime: 0,
        frameIndex: 0
    },

    gameboardRenderCount: 0
}
