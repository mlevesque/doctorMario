import { call } from "redux-saga/effects";
import { startPillRound } from "../sagas/pillUpdateSagas";

export function* startStart() {
    yield call(startPillRound);
}
