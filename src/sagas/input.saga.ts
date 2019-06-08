import { IInputActions } from "../model/IInputActions";
import { select, put } from "redux-saga/effects";
import { getInputState, 
         getSlideCooldownState, 
         getRegularDropIntervalState, 
         getDropTimeState,
         getCurrentDropIntervalState} from "./selectHelpers";
import { InputType } from "../model/enums";
import { canPillSlideLeft, canPillSlideRight } from "../gameLogic/collisionChecks";
import { IGameBoard } from "../model/IGameBoard";
import { IPill } from "../model/IGameState";
import { clonePill } from "../gameLogic/helpers";
import { createResetSlideCooldownAction } from "../actions/Input.actions";
import { rotatePill } from "../gameLogic/pillRotation";
import { createFloatingPillUpdatePillAction, 
         createSetCurrentDropIntervalAction, 
         createSetDropTimeAction} from "../actions/FloatingPill.actions";

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


export function* inputSaga(pill: IPill, gameboard: IGameBoard) {
    const inputs: IInputActions = yield select(getInputState);
    let pillChanged: boolean = false;

    // rotate pill
    if (isKeyPressed(InputType.ROTATE, inputs)) {
        pillChanged = rotatePill(pill, gameboard) || pillChanged;
    }

    // slide pill left
    const slideCooldown: number = yield select(getSlideCooldownState);
    if (canPillSlideLeft(pill, gameboard)) {
        if (isKeyPressed(InputType.LEFT, inputs)
            || isOverSlideCooldown(slideCooldown) && isKeyDown(InputType.LEFT, inputs)) {
            pill.position.x--;
            pillChanged = true;
            yield put(createResetSlideCooldownAction());
        }
    }
    
    // slide pill right
    if (canPillSlideRight(pill, gameboard)) {
        if (isKeyPressed(InputType.RIGHT, inputs)
            || isOverSlideCooldown(slideCooldown) && isKeyDown(InputType.RIGHT, inputs)) {
            pill.position.x++;
            pillChanged = true;
            yield put(createResetSlideCooldownAction());
        }
    }

    // perform input for dropping
    if (isKeyPressed(InputType.DOWN, inputs)) {
        // we need to calculate the difference in the interval change in order
        //  to adjust the drop time. This fixes the issue of the pill dropping
        //  down too quickly when pressing down
        const oldInterval: number = yield select(getCurrentDropIntervalState);
        let diff = oldInterval - 100;

        yield put(createSetCurrentDropIntervalAction(100));

        let dropTime: number = yield select(getDropTimeState);
        dropTime = Math.max(dropTime - diff, 0);
        yield put(createSetDropTimeAction(dropTime));
    }
    else if (isKeyReleased(InputType.DOWN, inputs)) {
        const regularInterval: number = yield select(getRegularDropIntervalState);
        yield put(createSetCurrentDropIntervalAction(regularInterval));
    }

    // update the pill
    if (pillChanged) {
        yield put(createFloatingPillUpdatePillAction(0, pill));
    }
}
