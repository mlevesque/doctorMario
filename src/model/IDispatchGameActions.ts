import { IPill } from "./IGameState";
import { Table } from "./Table";

export interface IDispatchGameActions {
    addPillToGameboard: (pill: IPill) => void;
    markDestroyObjects: (table: Table<boolean>) => void;
    purgeDestroyObjects: () => void;
}
