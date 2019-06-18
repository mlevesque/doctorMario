import { createGameSetFlowStateAction } from "../actions/Game.actions";
import { put } from "redux-saga/effects";
import { FlowState } from "./stateMappings";

export function* startUpdate() {
    yield put(createGameSetFlowStateAction(FlowState.CONTROL_PILL));
}
