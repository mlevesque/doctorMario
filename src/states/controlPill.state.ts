import { put, select, call } from "redux-saga/effects";
import { IPill } from "../model/IGameState";
import { IGameBoard } from "../model/IGameBoard";
import { generateFloatingPill } from "../gameLogic/generatePill";
import { getGameboardState } from "../sagas/selectHelpers";
import { createFloatingPillAddPillAction } from "../actions/FloatingPill.actions";
import { floatingPillUpdateSaga } from "../sagas/pillUpdateSagas";

export function* controlPillStart() {
    // add the floating pill to control
    const gameboard: IGameBoard = yield select(getGameboardState);
    const pill: IPill = yield call(generateFloatingPill, gameboard);
    yield put(createFloatingPillAddPillAction(pill));

    // @TODO Add failure check here
}

export function* controlPillUpdate() {
    yield call(floatingPillUpdateSaga, true);
}
