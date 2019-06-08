import { takeEvery, select, call, put } from 'redux-saga/effects'
import { GameAction, createGameRenderGameboard } from '../actions/Game.actions';
import { IControlledFloatingPill, IGridPos } from '../model/IGameState';
import { IGameBoard } from '../model/IGameBoard';
import { createFloatingPillSetPillAction, createFloatingPillDropAction } from '../actions/FloatingPill.actions';
import { hasPillLanded } from '../gameLogic/collisionChecks';
import { generateFloatingPill } from '../gameLogic/generatePill';
import { createAddPillToGameboardAction } from '../actions/GameBoard.actions';
import { getFloatingPillState, getGameboardState } from './selectHelpers';
import { inputSaga } from './input.saga';
import { createUpdateInputAction } from '../actions/Input.actions';
import { findColorMatches } from '../gameLogic/colorMatching';
import { IColorMatch } from '../model/IColorMatch';

export function* updateGameSaga() {
    let floatingPill: IControlledFloatingPill = yield select(getFloatingPillState);

    if (floatingPill.pill != null) {
        let gameboard: IGameBoard = yield select(getGameboardState);

        // handle input
        yield call(inputSaga, floatingPill, gameboard);

        // drop pill
        let updateCount: number = Math.floor(floatingPill.elapsedTime / floatingPill.dropInterval);
        let shouldSetNewPill: boolean = false;
        while (updateCount > 0) {
            floatingPill = yield select(getFloatingPillState);

            // check if pill has rested, then place it
            if (hasPillLanded(floatingPill.pill, gameboard)) {
                let dirtySpaces: IGridPos[] = [
                    {
                        x: floatingPill.pill.position.x + floatingPill.pill.parts[0].position.x,
                        y: floatingPill.pill.position.y + floatingPill.pill.parts[0].position.y
                    },
                    {
                        x: floatingPill.pill.position.x + floatingPill.pill.parts[1].position.x,
                        y: floatingPill.pill.position.y + floatingPill.pill.parts[1].position.y
                    }
                ];

                yield put(createAddPillToGameboardAction(floatingPill.pill));

                gameboard = yield select(getGameboardState);
                
                let matches: IColorMatch[] = findColorMatches(gameboard, dirtySpaces);

                if (matches.length > 0) {
                    console.log("MATCHES - " + JSON.stringify(matches));
                }

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
