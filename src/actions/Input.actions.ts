import { InputType } from "../model/enums";
import { AnyAction } from "redux";

export enum InputAction {
    SET = 'INPUT_SET',
    UPDATE = 'INPUT_UPDATE',
    RESET_SLIDE_COOLDOWN = 'RESET_SLIDE_COOLDOWN',
}

export function createSetInputAction(type: InputType, state: boolean): AnyAction {
    return { type: InputAction.SET, payload: {type: type, state: state} };
}
export function createUpdateInputAction(): AnyAction {
    return { type: InputAction.UPDATE };
}
export function createResetSlideCooldownAction(): AnyAction {
    return { type: InputAction.RESET_SLIDE_COOLDOWN };
}
