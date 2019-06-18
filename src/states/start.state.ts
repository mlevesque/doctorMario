import { call, put } from "redux-saga/effects";
import { setupPillRound } from "../sagas/pillUpdateSagas";
import { createNextFlowStateAction } from "../actions/flowState.actions";

export function* startStart() {
    yield call(setupPillRound);
    yield put(createNextFlowStateAction());
}
