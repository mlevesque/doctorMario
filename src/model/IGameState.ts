import { IGameBoard } from "./IGameBoard";
import { ColorType, ObjectType, PillRotation } from "./enums";
import { IInputActions } from "./IInputActions";
import { FlowState } from "../states/stateMappings";

/**
 * Positional data within the gameboard.
 */
export interface IGridPos {
    x: number;
    y: number;
}

/**
 * Describes one half of a pill.
 */
export interface IGameObject {
    color: ColorType;
    type: ObjectType;
    position: IGridPos;
}

/**
 * Describes a pill object.
 */
export interface IPill {
    parts: IGameObject[];
    position: IGridPos;
    rotationState: PillRotation;
}

export interface IPillHash {
    [id: string]: IPill;
}
export interface IFloatingPills {
    pillIds: string[];
    pills: IPillHash;
    nextIdValue: number;
}

export type IControlledFloatingPill = IFloatingPills & {slideCooldown: number};

export interface IVirusGameboardAnimation {
    elapsedTime: number;
    frameIndex: number;
}

export interface ISpriteAnimationGroup {
    animationIdQueue: string[];
    elapsedTime: number;
    frameIndex: number;
    loopCount: number;
}

export interface ISpriteAnimationStore {
    [groupId: string]: ISpriteAnimationGroup;
}

/**
 * The full redux state.
 */
export interface IGameState {
    // flow state
    flowStateQueue: FlowState[];
    flowDelayTime: number;

    // input
    inputs: IInputActions;
    slideCooldown: number;

    // gameboard
    gameboard: IGameBoard;
    invalidatedPositions: IGridPos[];

    // pills
    floatingPills: IFloatingPills;
    currentDropInterval: number;
    regularDropInterval: number;
    dropTime: number;
    pillWorldYOffset: number;

    // animation
    virusGameboardAnimation: IVirusGameboardAnimation;
    spriteAnimationGroups: ISpriteAnimationStore;

    // rendering
    gameboardRenderCount: number;
}
