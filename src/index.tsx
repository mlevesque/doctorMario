import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import { createStore } from "redux";
import { Game } from "./components/GameComponent";
import { InitialGameState } from "./reducers/InitialGameState";
import { createBuildGameboardAction } from "./actions/GameBoard.actions";
import { Table } from "./model/Table";
import { buildVirusGameboard } from "./gameLogic/virusPropagator";
import gameReducers from "./reducers/Main.reducer";
import { ColorType } from "./model/enums";
import { createFloatingPillSetPillAction } from "./actions/FloatingPill.actions";
import { generateFloatingPill } from "./gameLogic/generatePill";

const store = createStore(gameReducers, InitialGameState);

let data: Table<ColorType> = buildVirusGameboard(8, 20, 3, 3, 3);
store.dispatch(createBuildGameboardAction(data));
store.dispatch(createFloatingPillSetPillAction(generateFloatingPill(store.getState().gameboard)));

ReactDOM.render(
    <Provider store={store}>
        <Game />
    </Provider>,
    document.getElementById("main")
);
