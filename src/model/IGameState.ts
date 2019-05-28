import { IGameBoard } from "./IGameBoard";
import { ColorType, ObjectType, PillRotation, FlowState } from "./enums";

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

export interface IFloatingPill {
    pill: IPill;
    dropInterval: number;
}

export interface IVirusGameboardAnimation {
    elapsedTime: number;
    frameIndex: number;
}

/**
 * The full redux state.
 */
export interface IGameState {
    gameboard: IGameBoard;
    floatingPill: IFloatingPill;
    virusGameboardAnimation: IVirusGameboardAnimation;
}
