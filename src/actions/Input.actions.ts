import { InputType } from "../model/enums";
import { AnyAction } from "redux";

interface IInputPayload {
    type: InputType,
    keyState: boolean,
}

export enum InputAction {
    SET = "INPUT_SET",
    UPDATE = "INPUT_UPDATE",
}

export function createSetInputAction(type: InputType, state: boolean): AnyAction {
    return {type: InputAction.SET, payload: {type: type, state: state}};
}

export function createUpdateInputAction(): AnyAction {
    return {type: InputAction.UPDATE};
}
