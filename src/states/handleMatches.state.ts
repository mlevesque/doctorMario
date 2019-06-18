import { setupPillRound } from "../sagas/pillUpdateSagas";
import { call, select, put } from "redux-saga/effects";
import { delayStateSaga } from "./delay.state";
import { IPill, IGridPos } from "../model/IGameState";
import { gatherDebris } from "../gameLogic/debrisGathering";
import { IGameBoard } from "../model/IGameBoard";
import { getGameboardState, getInvalidatedPositionsState, getFlowStateDelay } from "../sagas/selectHelpers";
import { createQueueFlowStateAction, createNextFlowStateAction } from "../actions/flowState.actions";
import { FlowState } from "./stateMappings";
import { createClearInvalidatedPositionsAction, createPurgeDestroyObjectsAction } from "../actions/GameBoard.actions";

export function* handleMatchesStart() {
    //@TODO add match handling here
    yield call(setupPillRound);
}

export function* handleMatchesUpdate() {
    // get time elapsed from store
    const delayTime: number = yield select(getFlowStateDelay);

    // if we have reached our designated delay, then move on to next state
    if (delayTime > 1000) {
        // clear spaces marked as destroyed
        yield put(createPurgeDestroyObjectsAction());

        // gather debris
        const gameboard: IGameBoard = yield select(getGameboardState);
        const dirtySpaces: IGridPos[] = yield select(getInvalidatedPositionsState);
        const debris: IPill[] = gatherDebris(gameboard, dirtySpaces);

        // clear dirty spaces
        yield put(createClearInvalidatedPositionsAction());

        // if there is debris, then initiate debris drop cycle
        if (debris.length > 0) {
            //@TODO add debris to floating pills

            yield put(createQueueFlowStateAction(FlowState.DEBRIS_FALL));
            yield put(createQueueFlowStateAction(FlowState.HANDLE_MATCHES));
        }

        // otherwise, we start the control pill cycle
        else {
            yield call(setupPillRound);
        }

        // move on to next state
        yield put(createNextFlowStateAction());
    }
}
