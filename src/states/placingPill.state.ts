import { createPillWorldYOffsetAction, createFloatingPillRemovePillAction } from "../actions/FloatingPill.actions";
import { put, select, call } from "redux-saga/effects";
import { IFloatingPills, IPill } from "../model/IGameState";
import { clonePill } from "../gameLogic/helpers";
import { getFloatingPillsState, getDropTimeState, getCurrentDropIntervalState } from "../sagas/selectHelpers";
import { createAddInvalidatedPositionsAction, createAddPillToGameboardAction } from "../actions/GameBoard.actions";
import { getPillPartPositions } from "../sagas/pillUpdateSagas";
import { delayStateSaga } from "./delay.state";

/**
 * START - PLACING PILL
 */
export function* placingPillStart() {
    // offset the placed pill slightly down to give it the behavior that it is being placed.
    yield put(createPillWorldYOffsetAction(4));
}

/**
 * UPDATE - PLACING PILL
 */
export function* placingPillUpdate() {
    const floatDelay: number = yield select(getCurrentDropIntervalState);
    yield call(delayStateSaga, floatDelay);
}

/**
 * END - PLACING PILL
 */
export function* placingPillEnd() {
    // shift pill back to normal position.
    yield put(createPillWorldYOffsetAction(0));

    // insert pill into gameboard
    const floatingPills: IFloatingPills = yield select(getFloatingPillsState);
    let pills: IPill[] = floatingPills.pillIds.map<IPill>((id: string) => clonePill(floatingPills.pills[id]));
    let i: number;
    for (i = 0; i < pills.length; ++i) {
        let pill: IPill = pills[i];
        // indicate for match checking that the pill position should be checked
        yield put(createAddInvalidatedPositionsAction(getPillPartPositions(pill)));
        // add pill to gameboard
        yield put(createAddPillToGameboardAction(pill));
        // remove floating pill
        yield put(createFloatingPillRemovePillAction(0));
    }
}
