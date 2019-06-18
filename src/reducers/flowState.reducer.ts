import { InitialGameState } from "./InitialGameState";
import { GameAction } from "../actions/Game.actions";
import { FlowState } from "../states/stateMappings";

export function flowStateReducer(state: FlowState = InitialGameState.flowState, action: any): FlowState {
    switch(action.type) {
        case GameAction.SET_FLOW_STATE:
            return action.payload;
    }
    return state;
}

export function flowDelayReducer(state: number = InitialGameState.flowDelayTime, action: any): number {
    switch(action.type) {
        // accumulate frame time into delay time via general update
        case GameAction.UPDATE:
            return state + action.payload;

        // reset delay time upon a flow state change
        case GameAction.SET_FLOW_STATE:
            return 0;
    }
    return state;
}
