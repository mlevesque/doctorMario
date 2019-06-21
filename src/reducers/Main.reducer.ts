import { combineReducers } from 'redux'
import { gameboardReducer, invalidatedPositionsReducer } from './GameBoard.reducer'
import { IGameState } from '../model/IGameState';
import { gameboardRenderReducer } from './render.reducer';
import { inputsReducer, slideCooldownReducer } from './Input.reducer';
import { flowDelayReducer, flowStateQueueReducer } from './flowState.reducer';
import { floatingPillsReducer, currentDropIntervalReducer, regularDropIntervalReducer, pillWorldYOffsetReducer, dropTimeReducer } from './floatingPill.reducer';
import { spriteAnimationReducer } from './spriteAnimation.reducer';
import { levelReducer } from './level.reducer';
import { scoreReducer } from './score.reducer';

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

    spriteAnimationGroups: spriteAnimationReducer,

    levelData: levelReducer,
    score: scoreReducer,
    
    gameboardRenderCount: gameboardRenderReducer,
});

export default gameReducers;
