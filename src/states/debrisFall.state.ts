import { pillDropUpdate } from "../sagas/pillUpdateSagas";
import { call, put } from "redux-saga/effects";
import { createSetDropTimeAction, 
    createSetCurrentDropIntervalAction } from "../actions/FloatingPill.actions";
import configJson from "../data/config.json";

/**
 * START - DEBRIS FALL
 */
export function* debrisFallStart() {
    // reset drop time
    yield put(createSetDropTimeAction(0));

    // set drop interval
    yield put(createSetCurrentDropIntervalAction(configJson.debrisDropInterval));
}

/**
 * UPDATE - DEBRIS FALL
 */
export function* debrisFallUpdate() {
    yield call(pillDropUpdate);
}
