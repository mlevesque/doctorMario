import { pillDropUpdate } from "../sagas/pillUpdateSagas";
import { call } from "redux-saga/effects";

export function* debrisFallUpdate() {
    yield call(pillDropUpdate, false);
}
