import { controlPillStart, controlPillUpdate } from "./controlPill.state";
import { startStart } from "./start.state";
import { placingPillStart, placingPillEnd, placingPillUpdate } from "./placingPill.state";
import { throwInPillStart } from "./throwInPill.state";
import { handleMatchesStart } from "./handleMatches.state";

/**
 * Values for all game flow states during gameplay.
 */
export enum FlowState {
    START = 0,
    THROW_IN_PILL,          // Mario throws in a new pill
    CONTROL_PILL,           // Player moves and places pill
    PLACING_PILL,           // Player controlled pill is in process of being placed
    HANDLE_MATCHES,         // game objects go through destroy animation around newly placed pill
    DEBRIS_FALL             // remainder pill debris fall after destruction
}

export interface IFlowState {
    onStart: () => void;
    onUpdate: () => void;
    onEnd: () => void;
}

export interface IFlowStateMappings {
    [key: string]: IFlowState;
}

export const FLOW_STATES: IFlowStateMappings = {
    [FlowState.START]: {
        onStart: startStart,
        onUpdate: null,
        onEnd: null
    },
    [FlowState.THROW_IN_PILL]: {
        onStart: throwInPillStart,
        onUpdate: null,
        onEnd: null
    },
    [FlowState.CONTROL_PILL]: {
        onStart: controlPillStart,
        onUpdate: controlPillUpdate,
        onEnd: null
    },
    [FlowState.PLACING_PILL]: {
        onStart: placingPillStart,
        onUpdate: placingPillUpdate,
        onEnd: placingPillEnd
    },
    [FlowState.HANDLE_MATCHES]: {
        onStart: handleMatchesStart,
        onUpdate: null,
        onEnd: null
    },
    [FlowState.DEBRIS_FALL]: {
        onStart: null,
        onUpdate: null,
        onEnd: null
    }
}
