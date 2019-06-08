import { takeEvery, select, call, put } from 'redux-saga/effects';
import { IControlledFloatingPill, IGridPos } from "../model/IGameState";
import { getFloatingPillState, getGameboardState } from "./selectHelpers";
import { IGameBoard } from "../model/IGameBoard";
import { hasPillLanded } from "../gameLogic/collisionChecks";
import { createAddPillToGameboardAction } from "../actions/GameBoard.actions";
import { IColorMatch } from "../model/IColorMatch";
import { findColorMatches } from "../gameLogic/colorMatching";
import { createFloatingPillDropAction, createFloatingPillSetPillAction } from "../actions/FloatingPill.actions";
import { inputSaga } from './input.saga';
import { generateFloatingPill } from '../gameLogic/generatePill';

export function* controlPillSaga() {
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
}