import { IPill, IGridPos } from "./IGameState";
import { Table } from "./Table";
import { IGameBoard } from "./IGameBoard";

export interface IDispatchGameActions {
    updateAnimation: (deltaTime: number) => void;
    setPill: (pill: IPill) => void;
    rotatePill: (gameboard: IGameBoard) => void;
    slidePill: (position: number) => void;
    dropPillInterval: (interval: number) => void;
    dropPill: (position: number) => void;
    addPillToGameboard: (pill: IPill) => void;
    markDestroyObjects: (table: Table<boolean>) => void;
    purgeDestroyObjects: () => void;
}
