import { put, select, call } from "redux-saga/effects";
import { IPill, IFloatingPills } from "../model/IGameState";
import { IGameBoard } from "../model/IGameBoard";
import { generateFloatingPill } from "../gameLogic/generatePill";
import { getGameboardState, getRegularDropIntervalState, getFloatingPillsState } from "../sagas/selectHelpers";
import { createFloatingPillAddPillAction, createSetCurrentDropIntervalAction, createSetDropTimeAction, createPillWorldYOffsetAction } from "../actions/FloatingPill.actions";
import { pillDropUpdate } from "../sagas/pillUpdateSagas";
import { clonePill } from "../gameLogic/helpers";
import { inputSaga } from "../sagas/input.saga";
import { hasPillLanded } from "../gameLogic/collisionChecks";

function* handlePillShift() {
    // get controlled pill
    // if it is not there, then we do nothing
    const floatingPills: IFloatingPills = yield select(getFloatingPillsState);
    if (floatingPills.pillIds.length == 0) {
        return;
    }
    const pill: IPill = floatingPills.pills[floatingPills.pillIds[0]];

    // if there is collision below the pill, then shift
    const gameboard: IGameBoard = yield select(getGameboardState);
    if (hasPillLanded(pill, gameboard)) {
        yield put(createPillWorldYOffsetAction(4));
    }
    else {
        yield put(createPillWorldYOffsetAction(0));
    }
}


export function* controlPillStart() {
    // add the floating pill to control
    const gameboard: IGameBoard = yield select(getGameboardState);
    const pill: IPill = yield call(generateFloatingPill, gameboard);
    yield put(createFloatingPillAddPillAction(pill));

    // reset drop interval
    const interval: number = yield select(getRegularDropIntervalState);
    yield put(createSetCurrentDropIntervalAction(interval));

    // reset drop time
    yield put(createSetDropTimeAction(0));

    // @TODO Add failure check here
}

export function* controlPillUpdate() {
    // get what should be just a single pill to control,
    // clone it because we will be modifiying it
    let floatingPills: IFloatingPills = yield select(getFloatingPillsState);
    let clonedPill: IPill = clonePill(floatingPills.pills[floatingPills.pillIds[0]]);

    // handle input
    const gameboard: IGameBoard = yield select(getGameboardState);
    yield call(inputSaga, clonedPill, gameboard);

    // handle drop
    yield call(pillDropUpdate);

    // handle pill shift
    yield call(handlePillShift);
}

export function* controlPillEnd() {
    yield put(createPillWorldYOffsetAction(0));
}
