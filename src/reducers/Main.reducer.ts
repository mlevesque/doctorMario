import { combineReducers } from 'redux'
import { gameboardReducer } from './GameBoard.reducer'
import { IGameState } from '../model/IGameState';
import { floatingPillReducer } from './FloatingPill.reducer';
import { virusGameboardAnimationReducer } from './VirusGameboardAnimation.reducer';
import { gameboardRenderReducer } from './Render.reducer';
import { inputReducer } from './Input.reducer';

const gameReducers = combineReducers<IGameState>({
    inputs: inputReducer,
    gameboard: gameboardReducer,
    controlPill: floatingPillReducer,
    virusGameboardAnimation: virusGameboardAnimationReducer,
    gameboardRenderCount: gameboardRenderReducer,
})

export default gameReducers
