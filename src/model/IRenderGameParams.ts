import { IGameBoard } from "./IGameBoard";
import { IFloatingPill, IPill } from "./IGameState";

export interface IRenderGameParams {
    gameboard: IGameBoard;
    pill: IPill;
    virusAnimationFrame: number;
}