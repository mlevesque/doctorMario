import { GameBoardData, GridSpaceData, IGameBoardDimensions } from "../model/Gameboard.model";
import { ADD_PILL_TO_GAMEBOARD, REMOVE_FROM_GAMEBOARD, CLEAR_GAMEBOARD, BUILD_GAMEBOARD } from "../actions/actions";
import { InitialGameState } from "./InitialGameState";
import { Pill } from "../model/gameObject.model";
import { GridPos } from "../model/common.model";

/**
 * Builds grid with given dimensions and returns it.
 * @param width 
 * @param height 
 */
function allocateGrid(width: number, height: number): GridSpaceData[][] {
    return new Array(height).fill(new Array(width).fill(null));
}

/**
 * Reducer for gameboard data.
 * @param state 
 * @param payload 
 */
export function gameboardReducer(state: GameBoardData = InitialGameState.gameboard, payload: any) {
    let newState: GameBoardData = null;
    switch (payload.type) {


        case BUILD_GAMEBOARD:
            let dimensions: IGameBoardDimensions = payload as IGameBoardDimensions;
            newState = {
                width: dimensions.width,
                height: dimensions.height,
                grid: allocateGrid(dimensions.width, dimensions.height)
            }
            return newState;

        
        case ADD_PILL_TO_GAMEBOARD:
            // convert action payload to pill data
            let pillData: Pill = payload as Pill;

            // set up data to be added to grid
            let firstHalf: GridSpaceData = pillData.parts.length > 0 
                ? {color: pillData.parts[0].color, type: pillData.parts[0].type}
                : null;
            let secondHalf: GridSpaceData = pillData.parts.length > 1
                ? {color: pillData.parts[1].color, type: pillData.parts[1].type}
                : null;
            let firstPos: GridPos = firstHalf != null ? pillData.parts[0].position : {x:-1, y:-1};
            let secondPos: GridPos = secondHalf != null ? pillData.parts[1].position : {x:-1, y:-1};

            // build new grid - find where to add the pill data
            newState = Object.assign({}, state);
            newState.grid = state.grid.map( (row: GridSpaceData[], y: number) => {
                return row.map( (value: GridSpaceData, x: number) => {
                    
                    // check if we add first half here
                    if (firstPos.x == x && firstPos.y == y) {
                        return firstHalf;
                    }

                    // check if we add second half here
                    else if (secondPos.x == x && secondPos.y == y) {
                        return secondHalf;
                    }

                    // otherwise retunr original
                    else {
                        return value;
                    }

                });
            });
            return newState;


        case REMOVE_FROM_GAMEBOARD:
            let gridPos: GridPos = payload as GridPos;
            newState = Object.assign({}, state);
            newState.grid = state.grid.map( (row: GridSpaceData[], y:Number) => {
                return row.map( (value: GridSpaceData, x: Number) => {
                    if (gridPos.x == x && gridPos.y == y) {
                        return null;
                    }
                    else {
                        return value;
                    }
                });
            });
            return newState;


        case CLEAR_GAMEBOARD:
            newState = Object.assign({}, state);
            newState.grid = allocateGrid(newState.width, newState.height);
            return newState;

            
        default:
            return state;
    }
}
