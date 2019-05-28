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

const store = createStore(gameReducers, InitialGameState);

let data: Table<ColorType> = buildVirusGameboard(8, 20, 40, 40, 40);
store.dispatch(createBuildGameboardAction(data));

ReactDOM.render(
    <Provider store={store}>
        <Game />
    </Provider>,
    document.getElementById("main")
);
