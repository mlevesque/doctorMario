import { AnyAction } from "redux";
import { ISpriteAnimationGroup } from "../model/IGameState";

export enum SpriteAnimationAction {
    UPDATE_ANIMATION = 'UPDATE_ANIMATION',
    SET_ANIMATION_GROUP = 'SET_ANIMATION_GROUP'
}

export function createUpdateSpriteAnimationAction(deltaTime: number): AnyAction {
    return {type: SpriteAnimationAction.UPDATE_ANIMATION, payload: deltaTime};
}
export function createSetSpriteAnimationGroupAction(animationGroupId: string, animationGroup: ISpriteAnimationGroup): AnyAction {
    return {
        type: SpriteAnimationAction.SET_ANIMATION_GROUP,
        payload: {
            id: animationGroupId,
            group: animationGroup
        }
    }
}
