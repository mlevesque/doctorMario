import { IInputActions } from "../model/IInputActions";
import { InitialGameState } from "./InitialGameState";
import { InputAction } from "../actions/Input.actions";

export function inputReducer(state: IInputActions = InitialGameState.inputs, action: any): IInputActions {
    let newState: IInputActions;
    switch(action.type) {
        case InputAction.SET:
            newState = Object.assign({}, state);
            newState[action.payload.type].current = action.payload.state;
            return newState;
        case InputAction.UPDATE:
            newState = Object.assign({}, state);
            for (const key in newState) {
                newState[key].previous = newState[key].current;
            }
            return newState;
    }
    return state;
}
