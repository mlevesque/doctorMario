import { call, put } from "redux-saga/effects";
import { setupPillRound } from "../sagas/pillUpdateSagas";
import { createNextFlowStateAction, createQueueFlowStateAction } from "../actions/flowState.actions";
import { FlowState } from "./stateMappings";
import { createSetLevelAction } from "../actions/level.actions";
import { GameSpeed } from "../model/enums";

export function* startStart() {
    yield put(createSetLevelAction(10, GameSpeed.LOW));

    yield put(createQueueFlowStateAction(FlowState.PROPAGATE_VIRUSES));
    yield call(setupPillRound);
    yield put(createNextFlowStateAction());
}
