import { setupPillRound } from "../sagas/pillUpdateSagas";
import { call, select, put } from "redux-saga/effects";
import { IGridPos } from "../model/IGameState";
import { gatherDebris, IDebrisResults } from "../gameLogic/debrisGathering";
import { IGameBoard } from "../model/IGameBoard";
import { getGameboardState, getInvalidatedPositionsState, getFlowStateDelay } from "../sagas/selectHelpers";
import { createQueueFlowStateAction, createNextFlowStateAction } from "../actions/flowState.actions";
import { FlowState } from "./stateMappings";
import { createClearInvalidatedPositionsAction, createPurgeDestroyObjectsAction, createAddInvalidatedPositionsAction, createDestroyObjectsInGameboardAction } from "../actions/GameBoard.actions";
import { IColorMatch } from "../model/IColorMatch";
import { findColorMatches, getAllUniqueMatchPositions } from "../gameLogic/colorMatching";
import { createFloatingPillSetPillsAction } from "../actions/FloatingPill.actions";
import configJson from "../data/config.json";

function* setupDestruction(gameboard: IGameBoard, matches: IColorMatch[]) {
    // convert matches to list of grid positions
    const matchPositions: IGridPos[] = getAllUniqueMatchPositions(gameboard.width, gameboard.height, matches);

    // set match positions as our invalidated positions. These will be our starting point for gathering
    // debris pills
    yield put(createAddInvalidatedPositionsAction(matchPositions));

    // marke gameboard obejcts as destroyed
    yield put(createDestroyObjectsInGameboardAction(matchPositions));
}

function* completeState() {
    // clear spaces marked as destroyed
    yield put(createPurgeDestroyObjectsAction());

    // gather debris
    const gameboard: IGameBoard = yield select(getGameboardState);
    const dirtySpaces: IGridPos[] = yield select(getInvalidatedPositionsState);
    const debris: IDebrisResults = gatherDebris(gameboard, dirtySpaces);

    // clear dirty spaces
    yield put(createClearInvalidatedPositionsAction());

    // if there is debris, then initiate debris drop cycle
    if (debris.pills.length > 0) {
        yield put(createFloatingPillSetPillsAction(debris.pills));
        yield put(createDestroyObjectsInGameboardAction(debris.positions));
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


export function* handleMatchesStart() {
    // find matches
    const gameboard: IGameBoard = yield select(getGameboardState);
    const dirtySpaces: IGridPos[] = yield select(getInvalidatedPositionsState);
    const matches: IColorMatch[] = findColorMatches(gameboard, dirtySpaces);

    // once we have our matches, clear out the old dirty spaces
    yield put(createClearInvalidatedPositionsAction());

    // if there are matches, then set up matches to be destroyed
    if (matches.length > 0) {
        yield call(setupDestruction, gameboard, matches);
    }

    // if no matches, then start next pill cycle
    else {
        yield call(setupPillRound);
        yield put(createNextFlowStateAction());
    }
}

export function* handleMatchesUpdate() {
    // get time elapsed from store
    const delayTime: number = yield select(getFlowStateDelay);

    // if we have reached our designated delay, then move on to next state
    if (delayTime > configJson.destroyDelay) {
        yield call(completeState);
    }
}

export function* handleMatchesEnd() {
    // purge gameboard objects that are marked as destroyed
    yield put(createPurgeDestroyObjectsAction());
}
