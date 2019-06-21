import { take, call, select, put } from "redux-saga/effects";
import { SpriteAnimationAction, createSetSpriteAnimationGroupAction } from "../actions/spriteAnimation.actions";
import { AnyAction } from "redux";
import { ISpriteAnimationStore, ISpriteAnimationGroup } from "../model/IGameState";
import { getSpriteAnimationGroupsState } from "./selectHelpers";
import { ISpriteAnimationSchema, ISpriteAnimationFrameSchema } from "../model/JsonSchemas";
import { getAnimationFromId } from "../gameLogic/JsonDataMethods";
import { GameAction } from "../actions/Game.actions";

function getCurrentAnimation(animationIdQueue: string[]): ISpriteAnimationSchema {
    return animationIdQueue.length > 0 ? getAnimationFromId(animationIdQueue[0]) : null;
}

function getAnimationFrameInterval(animation: ISpriteAnimationSchema, frameIndex: number): number {
    let animationFrame: ISpriteAnimationFrameSchema = (animation && frameIndex < animation.animationFrames.length) 
        ? animation.animationFrames[frameIndex] : null;
    return animationFrame ? animationFrame.frameInterval : 0;
}

function* updateAnimationGroupSaga(groupId: string, group: ISpriteAnimationGroup, deltaTime: number) {
    // do nothing if there is no current animation
    if (group.animationIdQueue.length == 0) {
        return;
    }

    // make copy of group so we can modifiy it
    let newGroup: ISpriteAnimationGroup = Object.assign({}, group);

    // add time
    newGroup.elapsedTime += deltaTime;

    // get animation and frame
    let animation: ISpriteAnimationSchema = getCurrentAnimation(newGroup.animationIdQueue);
    let frameInterval: number = getAnimationFrameInterval(animation, newGroup.frameIndex);

    // now we must update the animation group by possibly advancing the animation based on
    //  time elapsed
    let allAnimationsDone: boolean = false;
    while (!allAnimationsDone && frameInterval <= newGroup.elapsedTime) {
        // update to next frame
        newGroup.elapsedTime -= frameInterval;
        newGroup.frameIndex++;

        // now we need to see if we hit the end of the animation
        if (newGroup.frameIndex >= animation.animationFrames.length) {
            // update loop
            newGroup.loopCount++;
            newGroup.frameIndex = 0;

            // now we need to see if we hit the loop count for the animation
            if (newGroup.loopCount > animation.numberOfLoops && animation.numberOfLoops > 0) {
                // reset loop count and pop animation from queue
                newGroup.loopCount = 0;
                newGroup.animationIdQueue.shift();

                // go to next animation
                // if there is no next animation, then we are done
                if (newGroup.animationIdQueue.length == 0) {
                    allAnimationsDone = true;
                }
                else {
                    // get the next animation and frame interval
                    animation = getCurrentAnimation(newGroup.animationIdQueue);
                    frameInterval = getAnimationFrameInterval(animation, 0);
                }
            }
        }
    } // end while

    // animation group is now been modified, so set it in the store
    yield put(createSetSpriteAnimationGroupAction(groupId, newGroup));
}

function* updateAllAnimationsSaga(deltaTime: number) {
    // get animation data
    const spriteAnimations: ISpriteAnimationStore = yield select(getSpriteAnimationGroupsState);

    // update each animation group
    const keyList: string[] = Object.keys(spriteAnimations);
    for (let key of keyList) {
        yield call(updateAnimationGroupSaga, key, spriteAnimations[key], deltaTime);
    }
}

export function* mainSpriteAnimationSaga() {
    while(true) {
        const action: AnyAction = yield take(GameAction.UPDATE);
        yield call(updateAllAnimationsSaga, action.payload);
    }
}
