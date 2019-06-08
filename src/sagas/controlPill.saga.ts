import { select, call, put } from 'redux-saga/effects';
import { IControlledFloatingPill, IGridPos, IFloatingPills, IPill, IGameObject } from "../model/IGameState";
import { getFloatingPillsState, getGameboardState, getDropTimeState, getCurrentDropIntervalState } from "./selectHelpers";
import { IGameBoard } from "../model/IGameBoard";
import { hasPillLanded } from "../gameLogic/collisionChecks";
import { createAddPillToGameboardAction, createAddInvalidatedPositionsAction } from "../actions/GameBoard.actions";
import { IColorMatch } from "../model/IColorMatch";
import { findColorMatches } from "../gameLogic/colorMatching";
import { createFloatingPillAddPillAction, createFloatingPillRemovePillAction, createFloatingPillUpdatePillAction, createSetDropTimeAction } from "../actions/FloatingPill.actions";
import { inputSaga } from './input.saga';
import { generateFloatingPill } from '../gameLogic/generatePill';
import { createGameSetFlowStateAction } from '../actions/Game.actions';
import { FlowState } from '../model/enums';
import { clonePill } from '../gameLogic/helpers';

function getPillPartPositions(pill: IPill): IGridPos[] {
    return pill.parts.map<IGridPos>((part: IGameObject) => {
        return {
            x: part.position.x + pill.position.x,
            y: part.position.y + pill.position.y
        }
    });
}

function* pillDropSaga(isControlledPill: boolean) {
    // get list of pills
    const floatingPills: IFloatingPills = yield select(getFloatingPillsState);
    let pills: IPill[] = floatingPills.pillIds.map<IPill>((id: string) => clonePill(floatingPills.pills[id]));

    // determine if it is tiem to drop
    let dropTime: number = yield select(getDropTimeState);
    const dropInterval: number = yield select(getCurrentDropIntervalState);
    let updateCount: number = Math.floor(dropTime / dropInterval);
    
    // update drop time
    yield put(createSetDropTimeAction(dropTime - (dropInterval * updateCount)));

    // handle each drop tick. Ideally, this should only iterate once
    let haveAllPillsLanded: boolean = true;
    let pillsRemoved: number = 0;
    while (updateCount > 0) {

        // iterate through each pill (we use for loop instead of forEach due to needing to yield)
        let i: number;
        for(i = 0; i < pills.length; ++i) {
            let pill: IPill = pills[i];
            const gameboard: IGameBoard = yield select(getGameboardState);

            // check if pill has landed
            if (hasPillLanded(pill, gameboard)) {
                
                // if we are not controlling the pills, then we will place them immediately
                if (!isControlledPill) {
                    // invalidate pill positions for match checking later
                    yield put(createAddInvalidatedPositionsAction(getPillPartPositions(pill)));
                    // add pill to gameboard
                    yield put(createAddPillToGameboardAction(pill));
                    // remove pill from floating list
                    yield put(createFloatingPillRemovePillAction(i - pillsRemoved));
                    // increment number of pills removed (allows us to send remove the proper index)
                    pillsRemoved++;
                }
            }

            // if pill has not landed, then we drop it
            else {
                // drop
                pill.position.y++;
                yield put(createFloatingPillUpdatePillAction(i - pillsRemoved, pill));

                // mark that not all pills will land if we are on the last update count for this frame
                haveAllPillsLanded = updateCount > 1;
            }
        }// next i

        updateCount--;
    } // end while

    // if all pills have landed, then we will do a flow state change
    // if (haveAllPillsLanded) {
    //     if (isControlledPill) {
    //         yield put(createGameSetFlowStateAction(FlowState.PLACING_PILL));
    //     }
    //     else {
    //         yield put(createGameSetFlowStateAction(FlowState.DESTROY_OBJECTS));
    //     }
    // }
}


export function* controlPillInitSaga() {
    // add the floating pill to control
    const gameboard: IGameBoard = yield select(getGameboardState);
    const pill: IPill = yield call(generateFloatingPill, gameboard);
    yield put(createFloatingPillAddPillAction(pill));

    // @TODO Add failure check here
}

export function* floatingPillUpdateSaga(isControlledPill: boolean) {
    // if there is no floating pill to control, then something has gone wrong.
    // Don't do anything for now (but maybe add some sort of handling of this later?)
    let floatingPills: IFloatingPills = yield select(getFloatingPillsState);
    if (floatingPills.pillIds.length == 0) {
        return;
    }

    if (isControlledPill) {
        // get what should be just a single pill to control,
        // clone it because we will be modifiying it
        let clonedPill: IPill = clonePill(floatingPills.pills[floatingPills.pillIds[0]]);

        // handle input
        const gameboard: IGameBoard = yield select(getGameboardState);
        yield call(inputSaga, clonedPill, gameboard);
    }

    // handle pill drop
    yield call(pillDropSaga, isControlledPill);
}
