import { IInputActions } from "../model/IInputActions";
import { select, put } from "redux-saga/effects";
import { getInputState } from "./selectHelpers";
import { InputType } from "../model/enums";
import { canPillSlideLeft, canPillSlideRight } from "../gameLogic/collisionChecks";
import { IGameBoard } from "../model/IGameBoard";
import { IPill, IControlledFloatingPill } from "../model/IGameState";
import { createFloatingPillRotateAction, createFloatingPillSlideAction, createFloatingPillSetDropIntervalAction, createFloatingPillResetSlideCooldownAction } from "../actions/FloatingPill.actions";

function isOverSlideCooldown(cooldownTime: number): boolean {
    return cooldownTime > 150;
}

function isKeyPressed(type: InputType, inputActions: IInputActions): boolean {
    const input = inputActions[type];
    return input && input.current && !input.previous;
}

function isKeyReleased(type: InputType, inputActions: IInputActions): boolean {
    const input = inputActions[type];
    return input && !input.current && input.previous;
}

function isKeyDown(type: InputType, inputActions: IInputActions): boolean {
    const input = inputActions[type];
    return input && input.current;
}

function isKeyUp(type: InputType, inputActions: IInputActions): boolean {
    const input = inputActions[type];
    return input && !input.current;
}

export function* inputSaga(pill: IControlledFloatingPill, gameboard: IGameBoard) {
    const inputs: IInputActions = yield select(getInputState);

    // rotate pill
    if (isKeyPressed(InputType.ROTATE, inputs)) {
        yield put(createFloatingPillRotateAction(gameboard));
    }

    // slide pill left
    if (canPillSlideLeft(pill.pill, gameboard)) {
        if (isKeyPressed(InputType.LEFT, inputs)
            || isOverSlideCooldown(pill.slideCooldown) && isKeyDown(InputType.LEFT, inputs)) {
            yield put(createFloatingPillSlideAction(-1));
            yield put(createFloatingPillResetSlideCooldownAction());
        }
    }
    
    // slide pill right
    if (canPillSlideRight(pill.pill, gameboard)) {
        if (isKeyPressed(InputType.RIGHT, inputs)
            || isOverSlideCooldown(pill.slideCooldown) && isKeyDown(InputType.RIGHT, inputs)) {
            yield put(createFloatingPillSlideAction(1));
            yield put(createFloatingPillResetSlideCooldownAction());
        }
    }

    // perform input for dropping
    if (isKeyPressed(InputType.DOWN, inputs)) {
        yield put(createFloatingPillSetDropIntervalAction(100));
    }
    else if (isKeyReleased(InputType.DOWN, inputs)) {
        yield put(createFloatingPillSetDropIntervalAction(800));
    }
}
