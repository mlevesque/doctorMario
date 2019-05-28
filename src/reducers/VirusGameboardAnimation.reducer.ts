import { IVirusGameboardAnimation } from "../model/IGameState";
import { InitialGameState } from "./InitialGameState";
import { AnimationAction } from "../actions/Animation.actions";

// @TODO Make this more data driven
const VIRUS_INTERVAL: number = 400;
const VIRUS_FRAME_COUNT: number = 2;

export function virusGameboardAnimationReducer(
                                    state: IVirusGameboardAnimation = InitialGameState.virusGameboardAnimation, 
                                    action: any): IVirusGameboardAnimation {
    switch(action.type) {
        case AnimationAction.UPDATE:
            let newData: IVirusGameboardAnimation = Object.assign({}, state);
            newData.elapsedTime += action.payload as number;
            newData.frameIndex = (newData.frameIndex + Math.floor(newData.elapsedTime / VIRUS_INTERVAL)) % VIRUS_FRAME_COUNT;
            newData.elapsedTime %= VIRUS_INTERVAL;
            return newData;
    }
    return state;
}
