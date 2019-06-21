import { IGameState } from "../model/IGameState";
import { ColorType, ObjectType, InputType } from "../model/enums";

export const InitialGameState:IGameState = {
    flowStateQueue: [null],
    flowDelayTime: 0,

    inputs: {
        [InputType.ROTATE]: {previous: false, current: false},
        [InputType.LEFT]: {previous: false, current: false},
        [InputType.RIGHT]: {previous: false, current: false},
        [InputType.DOWN]: {previous: false, current: false},
    },
    slideCooldown: 0,

    gameboard: {
        width: 5,
        height: 5,
        grid: [
        ]
    },
    invalidatedPositions: [],
    
    floatingPills: {
        pillIds: [],
        pills: {},
        nextIdValue: 1
    },
    currentDropInterval: 800,
    regularDropInterval: 800,
    dropTime: 0,
    pillWorldYOffset: 0,

    spriteAnimationGroups: {
        ["red-virus-animation"]: {
            animationIdQueue: ["red-virus-animation"],
            elapsedTime: 0,
            frameIndex: 0,
            loopCount: 0
        },
        ["yellow-virus-animation"]: {
            animationIdQueue: ["yellow-virus-animation"],
            elapsedTime: 0,
            frameIndex: 0,
            loopCount: 0
        },
        ["blue-virus-animation"]: {
            animationIdQueue: ["blue-virus-animation"],
            elapsedTime: 0,
            frameIndex: 0,
            loopCount: 0
        },
    },

    gameboardRenderCount: 0
}
