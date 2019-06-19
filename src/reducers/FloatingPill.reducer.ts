import { IPill, IFloatingPills, IGridPos, IControlledFloatingPill, IPillHash, IGameObject } from "../model/IGameState";
import { FloatingPillAction } from "../actions/FloatingPill.actions";
import { InitialGameState } from "./InitialGameState";
import { AnyAction } from "redux";
import { clonePill } from "../gameLogic/helpers";
import { GameAction } from "../actions/Game.actions";

function findIntertionIndexRec(state: IFloatingPills, a: number, b: number, y: number): number {
    if (a === b) {
        return a;
    }

    // get center index
    let pivot: number = Math.floor(a + (b - a) / 2);
    const pivotY: number = state.pills[state.pillIds[pivot]].position.y;
    if (pivotY === y) {
        return pivot;
    }
    else if (pivotY > y) {
        return findIntertionIndexRec(state, pivot + 1, b, y);
    }
    else {
        return findIntertionIndexRec(state, a, pivot - 1, y);
    }
}
function findIntertionIndex(state: IFloatingPills, y: number): number {
    return findIntertionIndexRec(state, 0, state.pillIds.length, y);
}


export function floatingPillsReducer(
                            state: IFloatingPills = InitialGameState.floatingPills,
                            action: AnyAction): IFloatingPills {
    let index: number;
    let id: string;
    let newHash: IPillHash
    switch(action.type) {

        ///////////////////////////////////////////////////////////////////////////////////////////
        // SET PILLS
        case FloatingPillAction.SET_PILLS:
            // first sort list of pills by y position, descending
            let pills: IPill[] = action.payload as IPill[];
            pills.sort((a: IPill, b: IPill) => {
                return b.position.y - a.position.y;
            });

            // build hash and list
            newHash = {};
            let newList: string[] = [];
            pills.forEach((value: IPill, index: number) => {
                id = String(index);
                newHash[id] = clonePill(value);
                newList.push(id);
            });
            return {
                pillIds: newList,
                pills: newHash,
                nextIdValue: newList.length
            };

        ///////////////////////////////////////////////////////////////////////////////////////////
        // ADD PILL
        case FloatingPillAction.ADD_PILL:
            // add pill to hash object
            const pill: IPill = action.payload as IPill;
            id = String(state.nextIdValue);
            newHash = Object.assign({}, state.pills, {
                [id]: clonePill(pill)
            });

            // figure out where to insert object into id array
            // we want to keep the array sorted by pill y position
            let insertIndex: number = findIntertionIndex(state, pill.position.y);

            return {
                pillIds: [...state.pillIds.slice(0, insertIndex),
                          id,
                          ...state.pillIds.slice(insertIndex)],
                pills: newHash,
                nextIdValue: state.nextIdValue + 1
            };


        
        ///////////////////////////////////////////////////////////////////////////////////////////
        // REMOVE PILL
        case FloatingPillAction.REMOVE_PILL:
            index = action.payload as number;
            if (index >= 0 && index < state.pillIds.length) {
                id = state.pillIds[index];
                let newHash: IPillHash = Object.keys(state.pills).reduce(
                    (acc, cur) => cur === id ? acc : {...acc, [cur]: state.pills[cur]}, {}
                );
                return {
                    pillIds: [...state.pillIds.slice(0, index), ...state.pillIds.slice(index+1)],
                    pills: newHash,
                    nextIdValue: state.nextIdValue
                };
            }
            break;


        ///////////////////////////////////////////////////////////////////////////////////////////
        // UPDATE PILL
        case FloatingPillAction.UPDATE_PILL:
            index = action.payload.pillIndex as number;
            if (index >= 0 && index < state.pillIds.length) {
                id = state.pillIds[index];
                return {
                    pillIds: [...state.pillIds],
                    pills: {
                        ...state.pills,
                        [id]: clonePill(action.payload.pill as IPill)
                    },
                    nextIdValue: state.nextIdValue
                };
            }
            break;

    }
    return state;
}

export function currentDropIntervalReducer(state: number = InitialGameState.currentDropInterval, action: AnyAction): number {
    switch(action.type) {
        case FloatingPillAction.SET_CURRENT_DROP_INTERVAL:
            return action.payload as number;
    }
    return state;
}

export function regularDropIntervalReducer(state: number = InitialGameState.regularDropInterval, action: AnyAction): number {
    switch(action.type) {
        case FloatingPillAction.SET_REGULAR_DROP_INTERVAL:
            return action.payload as number;
    }
    return state;
}

export function dropTimeReducer(state: number = InitialGameState.dropTime, action: AnyAction): number {
    switch(action.type) {
        case GameAction.UPDATE:
            return state + (action.payload as number);
        case FloatingPillAction.SET_DROP_TIME:
            return (action.payload as number);
    }
    return state;
}

export function pillWorldYOffsetReducer(state: number = InitialGameState.pillWorldYOffset, action: AnyAction): number {
    switch(action.type) {
        case FloatingPillAction.SET_PILL_WORLD_Y_OFFSET:
            return action.payload as number;
    }
    return state;
}
