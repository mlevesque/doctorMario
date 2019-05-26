import { GameBoardData, GridSpaceData, ConnectorDirection, GameBoardDimensions } from "../model/Gameboard.model";
import { ADD_PILL_TO_GAMEBOARD, REMOVE_FROM_GAMEBOARD, CLEAR_GAMEBOARD, BUILD_GAMEBOARD } from "../actions/actions";
import { PillData, HalfPillData } from "../model/PillData.model";
import { GridPos } from "../model/common.model";
import { InitialGameState } from "./InitialGameState";

function allocateGrid(width: number, height: number): GridSpaceData[][] {
    return new Array(height).fill(new Array(width).fill(null));
}

export function gameboardReducer(state: GameBoardData = InitialGameState.gameboard, payload: any) {
    let newState: GameBoardData = null;
    switch (payload.type) {
        case BUILD_GAMEBOARD:
            let dimensions: GameBoardDimensions = payload as GameBoardDimensions;
            newState = {
                width: dimensions.width,
                height: dimensions.height,
                grid: allocateGrid(dimensions.width, dimensions.height)
            }
            return newState;

        case ADD_PILL_TO_GAMEBOARD:
            // convert action payload to pill data
            let pillData: PillData = payload as PillData;

            // these will be the new grid space data for each half. We are keeping track of them here
            // in order to perform the last step of setting up the connectors
            let firstHalf: GridSpaceData = null;
            let secondHalf: GridSpaceData = null;

            // build new grid
            newState = Object.assign({}, state);
            newState.grid = state.grid.map( (row: GridSpaceData[], y:Number) => {
                return row.map( (value: GridSpaceData, x: Number) => {
                    // determine if either half of the pill sould be placed at the given grid space
                    if (pillData.firstHalf && pillData.firstHalf.pos.x == x && pillData.firstHalf.pos.y == y) {
                        firstHalf = {
                            color: pillData.firstHalf.color, 
                            connector: ConnectorDirection.NONE, 
                            isVirus: false};
                        return firstHalf;
                    }
                    else if (pillData.secondHalf && pillData.secondHalf.pos.x == x && pillData.secondHalf.pos.y == y) {
                        secondHalf = {
                            color: pillData.secondHalf.color, 
                            connector: ConnectorDirection.NONE, 
                            isVirus: false};
                        return secondHalf;
                    }
                    else {
                        return value;
                    }
                });
            });

            // determine connector directions
            if (firstHalf && secondHalf) {
                let xDiff = pillData.firstHalf.pos.x - pillData.secondHalf.pos.x;
                let yDiff = pillData.firstHalf.pos.y - pillData.secondHalf.pos.y;
                if (xDiff == 0) {
                    if (yDiff == -1) {
                        firstHalf.connector = ConnectorDirection.UP;
                        secondHalf.connector = ConnectorDirection.DOWN;
                    }
                    else if (yDiff == 1) {
                        firstHalf.connector = ConnectorDirection.DOWN;
                        secondHalf.connector = ConnectorDirection.UP;
                    }
                }
                else if (yDiff == 0) {
                    if (xDiff == -1) {
                        firstHalf.connector = ConnectorDirection.LEFT;
                        secondHalf.connector = ConnectorDirection.RIGHT;
                    }
                    else if (xDiff == 1) {
                        firstHalf.connector = ConnectorDirection.RIGHT;
                        secondHalf.connector = ConnectorDirection.LEFT;
                    }
                }
            }
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
