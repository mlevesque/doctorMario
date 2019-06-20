import { ISpriteAnimationStore, ISpriteAnimationGroup } from "../model/IGameState";
import { InitialGameState } from "./InitialGameState";
import { AnyAction } from "redux";
import { SpriteAnimationAction } from "../actions/spriteAnimation.actions";

export function spriteAnimationReducer(state: ISpriteAnimationStore = InitialGameState.spriteAnimationGroups, action: AnyAction): ISpriteAnimationStore {
    switch(action.type) {
        case SpriteAnimationAction.SET_ANIMATION_GROUP:
            let id: string = action.payload.id as string;
            let group: ISpriteAnimationGroup = Object.assign({}, action.payload.group);
            return Object.assign({}, state, {
                [id]: group
            });
    }
    return state;
}
