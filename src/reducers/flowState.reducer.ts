import { InitialGameState } from "./InitialGameState";
import { GameAction } from "../actions/Game.actions";
import { FlowState } from "../states/stateMappings";
import { FlowStateAction } from "../actions/flowState.actions";
import { AnyAction } from "redux";

export function flowStateQueueReducer(state: FlowState[] = InitialGameState.flowStateQueue, action: AnyAction): FlowState[] {
    switch(action.type) {
        // pushes state to next queue.
        case FlowStateAction.QUEUE_FLOW_STATE:
            return [...state, action.payload];

        // pop top state from queue. If this makes the queue empty, then null is put in queue.
        case FlowStateAction.NEXT_FLOW_STATE:
            let newState: FlowState[] = state.slice(1);
            return newState.length > 0 ? newState : [null];

        // clears all queued states except the current one
        case FlowStateAction.CLEAR_FLOW_STATE_QUEUE:
            return state.slice(0, 1);
    }
    return state;
}

export function flowDelayReducer(state: number = InitialGameState.flowDelayTime, action: any): number {
    switch(action.type) {
        // accumulate frame time into delay time via general update
        case GameAction.UPDATE:
            return state + action.payload;

        // reset delay time upon a flow state change
        case FlowStateAction.NEXT_FLOW_STATE:
            return 0;
    }
    return state;
}
