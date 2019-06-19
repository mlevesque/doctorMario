import { pillDropUpdate } from "../sagas/pillUpdateSagas";
import { call, put } from "redux-saga/effects";
import { createSetDropTimeAction } from "../actions/FloatingPill.actions";

export function* debrisFallStart() {
    // reset drop time
    yield put(createSetDropTimeAction(0));
}

export function* debrisFallUpdate() {
    yield call(pillDropUpdate);
}
