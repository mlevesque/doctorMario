import { put, select, call } from "redux-saga/effects";
import { IPill } from "../model/IGameState";
import { IGameBoard } from "../model/IGameBoard";
import { generateFloatingPill } from "../gameLogic/generatePill";
import { getGameboardState, getRegularDropIntervalState } from "../sagas/selectHelpers";
import { createFloatingPillAddPillAction, createSetCurrentDropIntervalAction } from "../actions/FloatingPill.actions";
import { floatingPillUpdateSaga } from "../sagas/pillUpdateSagas";

export function* controlPillStart() {
    // add the floating pill to control
    const gameboard: IGameBoard = yield select(getGameboardState);
    const pill: IPill = yield call(generateFloatingPill, gameboard);
    yield put(createFloatingPillAddPillAction(pill));

    // reset drop interval
    const interval: number = yield select(getRegularDropIntervalState);
    yield put(createSetCurrentDropIntervalAction(interval));

    // @TODO Add failure check here
}

export function* controlPillUpdate() {
    yield call(floatingPillUpdateSaga, true);
}
