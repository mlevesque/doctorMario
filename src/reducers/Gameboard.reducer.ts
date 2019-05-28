import { GameBoardData, GridSpaceData, IGameBoardDimensions } from "../model/Gameboard.model";
import { ADD_PILL_TO_GAMEBOARD, REMOVE_FROM_GAMEBOARD, CLEAR_GAMEBOARD, BUILD_GAMEBOARD } from "../actions/actions";
import { InitialGameState } from "./InitialGameState";
import { Pill, ColorType, ObjectType } from "../model/gameObject.model";
import { GridPos } from "../model/common.model";
import { GameBoardBuildData } from "../actions/model/GameboardActions.model";

/**
 * Builds grid with given dimensions and returns it.
 * @param width 
 * @param height 
 */
function allocateGrid(width: number, height: number): GridSpaceData[][] {
    let newGrid: GridSpaceData[][] = new Array<GridSpaceData[]>(height);
    for (let y = 0; y < height; ++y) {
        newGrid[y] = new Array<GridSpaceData>(width);
    }
    return newGrid;
}

/**
 * Reducer for gameboard data.
 * @param state 
 * @param payload 
 */
export function gameboardReducer(state: GameBoardData = InitialGameState.gameboard, action: any) {
    let newState: GameBoardData = null;
    switch (action.type) {


        case BUILD_GAMEBOARD:
            let board: GameBoardBuildData<string> = action.payload as GameBoardBuildData<string>;
            newState = {
                width: board.width,
                height: board.height,
                grid: allocateGrid(board.width, board.height)
            }
            for (let y = 0; y < board.height; ++y) {
                for (let x = 0; x < board.width; ++x) {
                    if (board.getValue(x, y) != null) {
                        newState.grid[y][x] = {color: (board.getValue(x, y) as ColorType), type: ObjectType.VIRUS};
                    }
                    else {
                        newState.grid[y][x] = null;
                    }
                }
            }
            return newState;

        
        case ADD_PILL_TO_GAMEBOARD:
            // convert action payload to pill data
            let pillData: Pill = action.payload as Pill;

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
            let gridPos: GridPos = action.payload as GridPos;
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
