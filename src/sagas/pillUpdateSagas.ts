import { IFloatingPills, IPill, IGridPos, IGameObject } from "../model/IGameState";
import { select, put, call } from "redux-saga/effects";
import { clonePill } from "../gameLogic/helpers";
import { getDropTimeState, getCurrentDropIntervalState, getFloatingPillsState, getGameboardState } from "./selectHelpers";
import { createSetDropTimeAction, createFloatingPillRemovePillAction, createFloatingPillUpdatePillAction } from "../actions/FloatingPill.actions";
import { IGameBoard } from "../model/IGameBoard";
import { hasPillLanded } from "../gameLogic/collisionChecks";
import { createAddInvalidatedPositionsAction, createAddPillToGameboardAction } from "../actions/GameBoard.actions";
import { inputSaga } from "./input.saga";
import { createNextFlowStateAction, createQueueFlowStateAction } from "../actions/flowState.actions";
import { FlowState } from "../states/stateMappings";

export function* setupPillRound() {
    yield put(createQueueFlowStateAction(FlowState.THROW_IN_PILL));
    yield put(createQueueFlowStateAction(FlowState.CONTROL_PILL));
    yield put(createQueueFlowStateAction(FlowState.PLACING_PILL));
    yield put(createQueueFlowStateAction(FlowState.HANDLE_MATCHES));
}

export function getPillPartPositions(pill: IPill): IGridPos[] {
    return pill.parts.map<IGridPos>((part: IGameObject) => {
        return {
            x: part.position.x + pill.position.x,
            y: part.position.y + pill.position.y
        }
    });
}

export function* pillDropUpdate(setLandedPills: boolean) {
    // get list of pills
    const floatingPills: IFloatingPills = yield select(getFloatingPillsState);
    let pills: IPill[] = floatingPills.pillIds.map<IPill>((id: string) => clonePill(floatingPills.pills[id]));

    // determine if it is tiem to drop
    let dropTime: number = yield select(getDropTimeState);
    const dropInterval: number = yield select(getCurrentDropIntervalState);
    let updateCount: number = Math.floor(dropTime / dropInterval);
    
    // update drop time
    yield put(createSetDropTimeAction(dropTime - (dropInterval * updateCount)));

    // if it is time to drop, then we do so
    if (updateCount > 0) {
        // iterate through each pill (we use for loop instead of forEach due to needing to yield)
        let i: number;
        let pillsRemoved: number = 0;
        let pillsLanded: number = 0;
        for(i = 0; i < pills.length; ++i) {
            let pill: IPill = pills[i];
            const gameboard: IGameBoard = yield select(getGameboardState);

            // check if pill has landed
            if (hasPillLanded(pill, gameboard)) {
                
                // if we should set teh landed pills, then do so
                if (setLandedPills) {
                    // invalidate pill positions for match checking later
                    yield put(createAddInvalidatedPositionsAction(getPillPartPositions(pill)));
                    // add pill to gameboard
                    yield put(createAddPillToGameboardAction(pill));
                    // remove pill from floating list
                    yield put(createFloatingPillRemovePillAction(i - pillsRemoved));
                    // increment number of pills removed (allows us to send remove the proper index)
                    pillsRemoved++;
                }

                // increment the number of pills landed
                pillsLanded++;
            }

            // if pill has not landed, then we drop it
            else {
                // drop
                pill.position.y++;
                yield put(createFloatingPillUpdatePillAction(i - pillsRemoved, pill));
            }
        }// next i

        // if all pills have landed, then we will do a flow state change
        if (pillsLanded >= pills.length) {
            yield put(createNextFlowStateAction());
        }
    }// end if
}
