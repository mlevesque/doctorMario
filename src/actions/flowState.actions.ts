import { FlowState } from "../states/stateMappings";
import { AnyAction } from "redux";

export enum FlowStateAction {
    QUEUE_FLOW_STATE = "ADD_FLOW_STATE",
    NEXT_FLOW_STATE = "NEXT_FLOW_STATE",
    CLEAR_FLOW_STATE_QUEUE = "CLEAR_FLOW_STATE_QUEUE"
}

export function createQueueFlowStateAction(state: FlowState): AnyAction {
    return {type: FlowStateAction.QUEUE_FLOW_STATE, payload: state};
}
export function createNextFlowStateAction(): AnyAction {
    return {type: FlowStateAction.NEXT_FLOW_STATE};
}
export function createClearFlowStateQueue(): AnyAction {
    return {type: FlowStateAction.CLEAR_FLOW_STATE_QUEUE};
}
