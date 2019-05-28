import { combineReducers } from 'redux'
import { gameboardReducer } from './GameBoard.reducer'
import { IGameState } from '../model/IGameState';
import { floatingPillReducer } from './FloatingPill.reducer';

const gameReducers = combineReducers<IGameState>({
    gameboard: gameboardReducer,
    floatingPill: floatingPillReducer
})

export default gameReducers
