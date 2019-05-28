import { AnyAction } from "redux";

export enum AnimationAction {
    UPDATE = 'UPDATE',
}

/**
 * Action Creators
 */
export function createAnimationUpdateAction(deltaTime: number): AnyAction {
    return { type: AnimationAction.UPDATE, payload: deltaTime };
}
