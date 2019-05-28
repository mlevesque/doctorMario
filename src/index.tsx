import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import { createStore } from "redux";
import gameReducers from "./reducers/reducers";
import { GameBoard } from "./components/GameBoard";
import { InitialGameState } from "./reducers/InitialGameState";
import { createBuildGameboardAction } from "./actions/actions";
import { GameBoardBuildData } from "./actions/model/GameboardActions.model";
import { ColorType } from "./model/gameObject.model";
import { buildVirusGameboard } from "./virusPropagator";

const store = createStore(gameReducers, InitialGameState);

let data: GameBoardBuildData<string> = buildVirusGameboard(8, 20, 40, 40, 40);
store.dispatch(createBuildGameboardAction(data));

ReactDOM.render(
    <Provider store={store}>
        <GameBoard />
    </Provider>,
    document.getElementById("main")
);
