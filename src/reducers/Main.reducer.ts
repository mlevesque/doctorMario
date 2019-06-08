import { combineReducers } from 'redux'
import { gameboardReducer } from './GameBoard.reducer'
import { IGameState } from '../model/IGameState';
import { floatingPillReducer } from './FloatingPill.reducer';
import { virusGameboardAnimationReducer } from './VirusGameboardAnimation.reducer';
import { gameboardRenderReducer } from './Render.reducer';
import { inputReducer } from './Input.reducer';
import { flowStateReducer } from './flowState.reducer';

const gameReducers = combineReducers<IGameState>({
    flowState: flowStateReducer,
    inputs: inputReducer,
    gameboard: gameboardReducer,
    controlPill: floatingPillReducer,
    virusGameboardAnimation: virusGameboardAnimationReducer,
    gameboardRenderCount: gameboardRenderReducer,
});

export default gameReducers;
