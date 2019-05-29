import { IPill, IGridPos } from "./IGameState";
import { Table } from "./Table";

export interface IDispatchGameActions {
    updateAnimation: (deltaTime: number) => void;
    setPill: (pill: IPill) => void;
    slidePill: (position: number) => void;
    dropPill: (position: number) => void;
    addPillToGameboard: (pill: IPill) => void;
    markDestroyObjects: (table: Table<boolean>) => void;
    purgeDestroyObjects: () => void;
}
