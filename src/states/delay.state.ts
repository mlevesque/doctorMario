import { FlowState } from "./stateMappings";
import { select, put } from "redux-saga/effects";
import { getFlowStateDelay } from "../sagas/selectHelpers";
import { createNextFlowStateAction } from "../actions/flowState.actions";

/**
 * Handles delay for a state. When teh delay time is met, it will trigger a state change to the
 * given state.
 * @param delay 
 * @param nextState 
 */
export function* delayStateSaga(delay: number) {
    // get time elapsed from store
    const delayTime: number = yield select(getFlowStateDelay);

    // if we have reached our designated delay, then move on to next state
    if (delayTime > delay) {
        yield put(createNextFlowStateAction());
    }
}
