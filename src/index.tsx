import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import { createStore } from "redux";
import gameReducers from "./reducers/reducers";
import { GameBoard } from "./components/GameBoard";
import { InitialGameState } from "./reducers/InitialGameState";

const store = createStore(gameReducers, InitialGameState);

ReactDOM.render(
    <Provider store={store}>
        <GameBoard />
    </Provider>,
    document.getElementById("example")
);
