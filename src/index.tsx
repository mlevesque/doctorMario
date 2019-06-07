import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import { createStore, Store, applyMiddleware } from "redux";
import { Game } from "./components/GameComponent";
import { InitialGameState } from "./reducers/InitialGameState";
import { createBuildGameboardAction } from "./actions/GameBoard.actions";
import { Table } from "./model/Table";
import { buildVirusGameboard } from "./gameLogic/virusPropagator";
import gameReducers from "./reducers/Main.reducer";
import { ColorType, InputType } from "./model/enums";
import { createFloatingPillSetPillAction } from "./actions/FloatingPill.actions";
import { generateFloatingPill } from "./gameLogic/generatePill";
import { createGameUpdateAction } from "./actions/Game.actions";
import createSagaMiddleware from "@redux-saga/core";
import { mainUpdateSaga } from "./sagas/updateGame";
import { createSetInputAction } from "./actions/Input.actions";

const sagaMiddleware = createSagaMiddleware();
const store: Store = createStore(gameReducers, InitialGameState, applyMiddleware(sagaMiddleware));

let data: Table<ColorType> = buildVirusGameboard(8, 20, 4, 4, 4);
store.dispatch(createBuildGameboardAction(data));
store.dispatch(createFloatingPillSetPillAction(generateFloatingPill(store.getState().gameboard)));


ReactDOM.render(
    <Provider store={store}>
        <Game />
    </Provider>,
    document.getElementById("main")
);


function setupListener(eventType: string, keyState: boolean): void {
    document.addEventListener(eventType, (e: KeyboardEvent): void => {
        switch(e.code) {
            case "Space":
            case "ArrowUp":
                store.dispatch(createSetInputAction(InputType.ROTATE, keyState));
                break;
            case "ArrowLeft":
                store.dispatch(createSetInputAction(InputType.LEFT, keyState));
                break;
            case "ArrowRight":
                store.dispatch(createSetInputAction(InputType.RIGHT, keyState));
                break;
            case "ArrowDown":
                store.dispatch(createSetInputAction(InputType.DOWN, keyState));
                break;
        }
    });
}
setupListener("keydown", true);
setupListener("keyup", false);


sagaMiddleware.run(mainUpdateSaga);
let prevTimestamp: number = 0;
function update(timeStamp: number): void {
    let dt: number = timeStamp - prevTimestamp;
    store.dispatch(createGameUpdateAction(dt));
    prevTimestamp = timeStamp;
    window.requestAnimationFrame(update);
}
window.requestAnimationFrame(update);
