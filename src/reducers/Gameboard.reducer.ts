import { IGameBoard, IGridSpace, IGridDimensions } from "../model/IGameBoard";
import { InitialGameState } from "./InitialGameState";
import { Table } from "../model/Table";
import { IPill, IGameObject } from "../model/IGameState";
import { ColorType, ObjectType } from "../model/enums";
import { GameboardAction } from "../actions/GameBoard.actions";

/**
 * Builds grid with given dimensions and returns it.
 * @param width 
 * @param height 
 */
function allocateGrid(width: number, height: number): IGridSpace[][] {
    let newGrid: IGridSpace[][] = new Array<IGridSpace[]>(height);
    for (let y = 0; y < height; ++y) {
        newGrid[y] = new Array<IGridSpace>(width);
    }
    return newGrid;
}

/**
 * Reducer for gameboard data.
 * @param state 
 * @param payload 
 */
export function gameboardReducer(state: IGameBoard = InitialGameState.gameboard, action: any): IGameBoard {
    let newState: IGameBoard = null;
    switch (action.type) {


        // ============================================================
        case GameboardAction.BUILD_GAMEBOARD:
            let board: Table<string> = action.payload as Table<string>;
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


        // ============================================================
        case GameboardAction.ADD_PILL_TO_GAMEBOARD:
            // get pill data
            let pillData: IPill = action.payload as IPill;

            // copy pill parts and transform their positions from Object space to Gameboard space
            let parts: IGameObject[] = pillData.parts.map((value: IGameObject) => {
                let gb: IGameObject = Object.assign({}, value);
                gb.position.x += pillData.position.x;
                gb.position.y += pillData.position.y;
                return gb;
            });

            // we need to handle the case where a pill may be straddling the top of the gameboard
            // in this case, we want to change the object types to single pills because one of
            // them will be lost
            let convertToSingular: boolean = false;
            parts.forEach((part: IGameObject) => {
                if (part.position.y < 0) {
                    convertToSingular = true;
                }
            });
            if (convertToSingular) {
                parts.forEach((part: IGameObject) => {
                    part.type = ObjectType.PILL_SINGLE;
                });
            }

            // build new grid and add the pill parts to the right positions
            newState = Object.assign({}, state);
            newState.grid = state.grid.map( (row: IGridSpace[], y: number) => {
                return row.map( (value: IGridSpace, x: number) => {
                    let newSpace: IGridSpace = null;
                    pillData.parts.forEach((part: IGameObject) => {
                        if (part.position.x == x && part.position.y == y) {
                            newSpace = {
                                color: part.color,
                                type: part.type
                            };
                        }
                    });
                    if (newSpace == null) {
                        newSpace = value == null ? null : Object.assign({}, value);
                    }
                    return newSpace;
                });
            });
            return newState;


        // ============================================================
        case GameboardAction.DESTROY_OBJECTS_IN_GAMEBOARD:
            let destroyTable: Table<boolean> = action.payload as Table<boolean>;
            newState = Object.assign({}, state);
            newState.grid = state.grid.map( (row: IGridSpace[], y: number) => {
                return row.map( (value: IGridSpace, x: number) => {
                    if (value == null) {
                        return null;
                    }
                    let newSpace: IGridSpace = Object.assign({}, value);
                    newSpace.type = ObjectType.DESTROYED;
                    return newSpace;
                });
            });
            return newState;


        // ============================================================
        case GameboardAction.DESTROY_OBJECTS_IN_GAMEBOARD:
            newState = Object.assign({}, state);
            newState.grid = state.grid.map( (row: IGridSpace[], y: number) => {
                return row.map( (value: IGridSpace, x: number) => {
                    if (value != null && value.type == ObjectType.DESTROYED) {
                        return null;
                    }
                    else {
                        return Object.assign({}, )
                    }
                });
            });
            return newState;


        // ============================================================
        case GameboardAction.CLEAR_GAMEBOARD:
            newState = Object.assign({}, state);
            newState.grid = allocateGrid(newState.width, newState.height);
            return newState;


        default:
            return state;
    }
}
