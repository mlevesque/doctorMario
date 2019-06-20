import { AnyAction } from "redux";
import { ISpriteAnimationGroup } from "../model/IGameState";

export enum SpriteAnimationAction {
    SET_ANIMATION_GROUP = 'SET_ANIMATION_GROUP'
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
