import { startPillRound } from "../sagas/pillUpdateSagas";
import { call } from "redux-saga/effects";

export function* handleMatchesStart() {
    //@TODO add match handling here
    yield call(startPillRound);
}
