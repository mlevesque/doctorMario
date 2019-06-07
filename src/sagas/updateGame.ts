import { takeEvery, select, call, put } from 'redux-saga/effects'
import { GameAction, createGameRenderGameboard } from '../actions/Game.actions';
import { IGameState, IPill, IFloatingPill, IControlledFloatingPill } from '../model/IGameState';
import { IGameBoard } from '../model/IGameBoard';
import { createFloatingPillRotateAction, createFloatingPillSlideAction, createFloatingPillSetDropIntervalAction, createFloatingPillSetPillAction, createFloatingPillDropAction } from '../actions/FloatingPill.actions';
import { canPillSlideLeft, canPillSlideRight, hasPillLanded } from '../gameLogic/collisionChecks';
import { generateFloatingPill } from '../gameLogic/generatePill';
import { createAddPillToGameboardAction } from '../actions/GameBoard.actions';
import { getFloatingPillState, getGameboardState } from './selectHelpers';
import { inputSaga } from './input.saga';
import { createUpdateInputAction } from '../actions/Input.actions';

export function* updateGameSaga() {
    let floatingPill: IControlledFloatingPill = yield select(getFloatingPillState);

    if (floatingPill.pill != null) {
        const pill: IPill = floatingPill.pill;
        const gameboard: IGameBoard = yield select(getGameboardState);

        // handle input
        yield call(inputSaga, floatingPill, gameboard);

        // drop pill
        floatingPill = yield select(getFloatingPillState);
        let updateCount: number = Math.floor(floatingPill.elapsedTime / floatingPill.dropInterval);
        let shouldSetNewPill: boolean = false;
        while (updateCount > 0) {
            // check if pill has rested, then place it
            if (hasPillLanded(pill, gameboard)) {
                yield put(createAddPillToGameboardAction(pill));
                shouldSetNewPill = true;
            }

            yield put(createFloatingPillDropAction(1));
            updateCount--;
        }

        // check if we should set a new pill
        if (shouldSetNewPill) {
            yield put(createFloatingPillSetPillAction(generateFloatingPill(gameboard)));
        }
    }

    yield put(createUpdateInputAction());
    yield put(createGameRenderGameboard());
}

export function* mainUpdateSaga() {
    yield takeEvery(GameAction.UPDATE, updateGameSaga);
}
