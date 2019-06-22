import { setupPillRound } from "../sagas/pillUpdateSagas";
import { call, select, put } from "redux-saga/effects";
import { IGridPos } from "../model/IGameState";
import { gatherDebris, IDebrisResults } from "../gameLogic/debrisGathering";
import { IGameBoard } from "../model/IGameBoard";
import { getGameboardState, getInvalidatedPositionsState, getFlowStateDelay } from "../sagas/selectHelpers";
import { createQueueFlowStateAction, createNextFlowStateAction } from "../actions/flowState.actions";
import { FlowState } from "./stateMappings";
import { createClearInvalidatedPositionsAction, 
         createPurgeDestroyObjectsAction, 
         createAddInvalidatedPositionsAction, 
         createDestroyObjectsInGameboardAction } from "../actions/GameBoard.actions";
import { IColorMatch } from "../model/IColorMatch";
import { findColorMatches, getAllUniqueMatchPositions } from "../gameLogic/colorMatching";
import { createFloatingPillSetPillsAction } from "../actions/FloatingPill.actions";
import configJson from "../data/config.json";

let sortedMatchPositions: IGridPos[][];
let destroyRow: number;

/**
 * Organizes the given match positions by row in a 2D array and returns it.
 * @param gameboardHeight 
 * @param matchPositions 
 */
function organizeMatchPositions(gameboardHeight: number, matchPositions: IGridPos[]): IGridPos[][] {
    let result: IGridPos[][] = new Array<IGridPos[]>(gameboardHeight);
    for (let i = 0; i < gameboardHeight; ++i) {
        result[i] = [];
    }
    matchPositions.forEach((pos: IGridPos) => {
        let index: number = gameboardHeight - pos.y - 1;
        result[index].push(pos);
    });
    return result;
}

/**
 * Sets up data to be used for marking spaces for destruction during the update phase of the state.
 * We need to convert the matches into positions and then organize those positions by reverse row
 * order, so that we can vertically and progressively mark spaces as destroyed.
 * @param gameboard 
 * @param matches 
 */
function* setupDestruction(gameboard: IGameBoard, matches: IColorMatch[]) {
    // convert matches to list of grid positions
    const matchPositions: IGridPos[] = getAllUniqueMatchPositions(gameboard.width, gameboard.height, matches);

    // store match positions by row. We use this for staggering the destroy visuals vertically over the
    //  course of a few frames
    sortedMatchPositions = organizeMatchPositions(gameboard.height, matchPositions);

    // set match positions as our invalidated positions. These will be our starting point for gathering
    // debris pills
    yield put(createAddInvalidatedPositionsAction(matchPositions));
}

/**
 * Performs actions to prepare to complete the state after the delay has completed. We need to
 * determine if there is any pill debris that needs to be handled. Pill debris is any extra
 * pills resting on top of or were connected to the destroyed spaces. These pills need to drop
 * down and rest on the next collision.
 * 
 * If there is debris, then we set up the cycle of states to handle that.
 * If there is no debris, then we start the player control pill state cycle.
 */
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


/**
 * START - HANDLE MATCHES
 * 
 * We check for any color matches around the invalidated positions stored in the state.
 * If we don't find matches, then this state is done and we move to the next state.
 * If matches are found, we organize the positions by row and the update will progressively mark
 * them as destroyed.
 */
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
        destroyRow = 0;
    }

    // if no matches, then start next pill cycle
    else {
        yield call(setupPillRound);
        yield put(createNextFlowStateAction());
    }
}

/**
 * UPDATE - HANDLE MATCHES
 * 
 * We wait for a certain delay and also progressively mark all matched positions as
 * destroyed so that visually, you see the destroyed positions ripple up in destruction.
 */
export function* handleMatchesUpdate() {
    // get time elapsed from store
    const delayTime: number = yield select(getFlowStateDelay);

    // handle marking matches for destruction
    let nextPosition: number = Math.floor(delayTime / configJson.matchDestroyRowsInterval);
    nextPosition = Math.min(nextPosition, sortedMatchPositions.length);
    while(destroyRow < nextPosition) {
        yield put(createDestroyObjectsInGameboardAction(sortedMatchPositions[destroyRow]));
        destroyRow++;
    }

    // if all matches have been marked for destruction, then finish off the remaining delay
    if (destroyRow >= sortedMatchPositions.length) {
        // if we have reached our designated delay, then move on to next state
        if (delayTime > configJson.destroyDelay) {
            yield call(completeState);
        }
    }
}

/**
 * END - HANDLE MATCHES
 * 
 * To finish off the state, we purge all spaces marked as destroyed.
 */
export function* handleMatchesEnd() {
    // purge gameboard objects that are marked as destroyed
    yield put(createPurgeDestroyObjectsAction());
}
