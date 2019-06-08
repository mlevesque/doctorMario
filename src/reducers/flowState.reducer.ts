import { FlowState } from "../model/enums";
import { InitialGameState } from "./InitialGameState";
import { GameAction } from "../actions/Game.actions";

export function flowStateReducer(state: FlowState = InitialGameState.flowState, action: any): FlowState {
    switch(action.type) {
        case GameAction.SET_FLOW_STATE:
            return action.payload;
    }
    return state;
}
