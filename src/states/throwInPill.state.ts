import { createNextFlowStateAction } from "../actions/flowState.actions";
import { put } from "redux-saga/effects";

export function* throwInPillStart() {
    //@TODO add animation handling for throwing in pill
    yield put(createNextFlowStateAction());
}
