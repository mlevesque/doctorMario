import { takeEvery, select, call, put } from 'redux-saga/effects'
import { GameAction, createGameRenderGameboard } from '../actions/Game.actions';
import { createUpdateInputAction } from '../actions/Input.actions';
import { FlowState } from '../model/enums';
import { controlPillSaga } from './controlPill.saga';
import { getFlowState } from './selectHelpers';

export function* updateGameSaga() {
    // branch off to correct logic based on game flow
    const flowState: FlowState = yield select(getFlowState);
    switch (flowState) {
        // Control pil state refers to when a single pill is falling and the player can control it
        case FlowState.CONTROL_PILL:
            yield call(controlPillSaga);
            break;
    }

    yield put(createUpdateInputAction());
    yield put(createGameRenderGameboard());
}

export function* mainUpdateSaga() {
    yield takeEvery(GameAction.UPDATE, updateGameSaga);
}
