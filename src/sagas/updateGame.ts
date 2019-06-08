import { takeEvery, take, select, call, put, fork } from 'redux-saga/effects'
import { GameAction, createGameRenderGameboard, createGameSetFlowStateAction } from '../actions/Game.actions';
import { createUpdateInputAction } from '../actions/Input.actions';
import { FlowState } from '../model/enums';
import { controlPillUpdateSaga, controlPillInitSaga } from './controlPill.saga';
import { getFlowState, getFlowStateDelay } from './selectHelpers';
import { AnyAction } from 'redux';

function* delayStateSaga(delay: number, nextState: FlowState) {
    const delayTime: number = yield select(getFlowStateDelay);
    if (delayTime > delay) {
        yield put(createGameSetFlowStateAction(nextState));
    }
}

function* flowStateChangeActionSaga(prevState: FlowState, nextState: FlowState) {
    // call complete state sagas
    switch (prevState) {
    }

    // call initialize state sagas
    switch (nextState) {
        case FlowState.CONTROL_PILL:
            yield call(controlPillInitSaga);
            break;
    }
}

function* updateGameSaga() {
    // branch off to correct logic based on game flow
    const flowState: FlowState = yield select(getFlowState);
    switch (flowState) {
        // Control pil state refers to when a single pill is falling and the player can control it
        case FlowState.CONTROL_PILL:
            yield call(controlPillUpdateSaga);
            break;
        case FlowState.PLACING_PILL:
            yield call(delayStateSaga, 500, FlowState.CONTROL_PILL);
            break;
    }

    yield put(createUpdateInputAction());
    yield put(createGameRenderGameboard());
}


export function* mainUpdateSaga() {
    yield takeEvery(GameAction.UPDATE, updateGameSaga);
}
export function* flowStateChangeTriggerSaga() {
    let prevState: FlowState;
    while(true) {
        prevState = yield select(getFlowState);
        let action: AnyAction = yield take(GameAction.SET_FLOW_STATE);
        yield call(flowStateChangeActionSaga, prevState, action.payload);
    }
}

export function* rootSaga () {
    yield fork(mainUpdateSaga);
    yield fork(flowStateChangeTriggerSaga);
}
