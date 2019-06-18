import { IGameState } from "../model/IGameState";
import { ColorType, ObjectType, InputType } from "../model/enums";
import { FlowState } from "../states/stateMappings";

export const InitialGameState:IGameState = {
    flowState: FlowState.START,
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
            [null, {color: ColorType.RED, type: ObjectType.VIRUS}],
            [null, null, {color: ColorType.YELLOW, type: ObjectType.VIRUS}, {color: ColorType.BLUE, type: ObjectType.VIRUS}]
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

    virusGameboardAnimation: {
        elapsedTime: 0,
        frameIndex: 0
    },

    gameboardRenderCount: 0
}
