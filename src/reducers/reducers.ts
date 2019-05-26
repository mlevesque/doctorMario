import { combineReducers } from 'redux'
import { gameboardReducer } from './Gameboard.reducer'
import { GameState } from '../model/GameState.model';

const gameReducers = combineReducers<GameState>({
    gameboard: gameboardReducer
})

export default gameReducers
