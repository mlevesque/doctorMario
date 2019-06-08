import { IInputActions } from "../model/IInputActions";
import { InitialGameState } from "./InitialGameState";
import { InputAction } from "../actions/Input.actions";
import { AnyAction } from "redux";
import { GameAction } from "../actions/Game.actions";

export function inputsReducer(state: IInputActions = InitialGameState.inputs, action: AnyAction): IInputActions {
    let newState: IInputActions;
    switch(action.type) {
        ///////////////////////////////////////////////////////////////////////////////////////////
        // SET INPUT
        case InputAction.SET:
            newState = Object.assign({}, state);
            newState[action.payload.type].current = action.payload.state;
            return newState;


        ///////////////////////////////////////////////////////////////////////////////////////////
        // UPDATE INPUT
        case InputAction.UPDATE:
            newState = Object.assign({}, state);
            for (const key in newState) {
                newState[key].previous = newState[key].current;
            }
            return newState;
    }
    return state;
}

export function slideCooldownReducer(state: number = InitialGameState.slideCooldown, action: AnyAction): number {
    switch(action.type) {
        ///////////////////////////////////////////////////////////////////////////////////////////
        // UPDATE
        case GameAction.UPDATE:
            return state + (action.payload as number);

        ///////////////////////////////////////////////////////////////////////////////////////////
        // RESET SLIDE COOLDOWN
        case InputAction.RESET_SLIDE_COOLDOWN:
            return 0;
    }
    return state;
}
