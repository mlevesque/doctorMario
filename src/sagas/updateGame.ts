import { takeEvery, take, select, call, put, fork } from 'redux-saga/effects'
import { GameAction, createGameRenderGameboard } from '../actions/Game.actions';
import { createUpdateInputAction } from '../actions/Input.actions';
import { getFlowState, getFlowStateDelay } from './selectHelpers';
import { AnyAction } from 'redux';
import { FlowState, IFlowState, FLOW_STATES } from '../states/stateMappings';
import { FlowStateAction } from '../actions/flowState.actions';



function* flowStateChangeActionSaga(prevState: FlowState, nextState: FlowState) {
    // end previous state
    let state: IFlowState = FLOW_STATES[prevState];
    if (state && state.onEnd) {
        yield call(state.onEnd);
    }

    // start next state
    state = FLOW_STATES[nextState];
    if (state && state.onStart) {
        yield call(state.onStart);
    }
}

function* updateGameSaga() {
    // branch off to correct update logic based on game flow
    const flowState: FlowState = yield select(getFlowState);
    const state: IFlowState = FLOW_STATES[flowState];
    if (state && state.onUpdate) {
        yield call(state.onUpdate);
    }

    yield put(createUpdateInputAction());
    yield put(createGameRenderGameboard());
}


export function* mainUpdateSaga() {
    yield takeEvery(GameAction.UPDATE, updateGameSaga);
}

export function* flowStateChangeTriggerSaga() {
    let prevState: FlowState;
    let nextState: FlowState;
    while(true) {
        prevState = yield select(getFlowState);
        let action: AnyAction = yield take(FlowStateAction.NEXT_FLOW_STATE);
        nextState = yield select(getFlowState);
        yield fork(flowStateChangeActionSaga, prevState, nextState);
    }
}

export function* rootSaga () {
    yield fork(mainUpdateSaga);
    yield fork(flowStateChangeTriggerSaga);
}
