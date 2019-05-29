import { IGameState } from "../model/IGameState";
import { IDispatchGameActions } from "../model/IDispatchGameActions";
import { hasPillLanded } from "./collisionChecks";
import { generateFloatingPill } from "./generatePill";

export function updateGame(dt: number, gameState:IGameState, dispatches:IDispatchGameActions): void {
    // update animations
    dispatches.updateAnimation(dt);

    if (gameState.floatingPill.pill != null) {
        // drop pill
        let updateCount: number = Math.floor(gameState.floatingPill.elapsedTime / gameState.floatingPill.dropInterval);
        let shouldSetNewPill: boolean = false;
        if (updateCount > 0) {
            // check if pill has rested, then place it
            if (hasPillLanded(gameState.floatingPill.pill, gameState.gameboard)) {
                dispatches.addPillToGameboard(gameState.floatingPill.pill);
                shouldSetNewPill = true;
            }
        }

        // drop pill if there are still updates to perform
        if (updateCount > 0) {
            dispatches.dropPill(updateCount);
        }

        // check if we should set a new pill
        if (shouldSetNewPill) {
            dispatches.setPill(generateFloatingPill(gameState.gameboard));
        }
    }
}
