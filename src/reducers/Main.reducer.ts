import { combineReducers } from 'redux'
import { gameboardReducer, invalidatedPositionsReducer } from './GameBoard.reducer'
import { IGameState } from '../model/IGameState';
import { virusGameboardAnimationReducer } from './VirusGameboardAnimation.reducer';
import { gameboardRenderReducer } from './render.reducer';
import { inputsReducer, slideCooldownReducer } from './Input.reducer';
import { flowDelayReducer, flowStateQueueReducer } from './flowState.reducer';
import { floatingPillsReducer, currentDropIntervalReducer, regularDropIntervalReducer, pillWorldYOffsetReducer, dropTimeReducer } from './floatingPill.reducer';

const gameReducers = combineReducers<IGameState>({
    flowStateQueue: flowStateQueueReducer,
    flowDelayTime: flowDelayReducer,

    inputs: inputsReducer,
    slideCooldown: slideCooldownReducer,

    gameboard: gameboardReducer,
    invalidatedPositions: invalidatedPositionsReducer,

    floatingPills: floatingPillsReducer,
    currentDropInterval: currentDropIntervalReducer,
    regularDropInterval: regularDropIntervalReducer,
    dropTime: dropTimeReducer,
    pillWorldYOffset: pillWorldYOffsetReducer,

    virusGameboardAnimation: virusGameboardAnimationReducer,
    
    gameboardRenderCount: gameboardRenderReducer,
});

export default gameReducers;
