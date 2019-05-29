import { IGameState, IPill } from "../model/IGameState";
import { IDispatchGameActions } from "../model/IDispatchGameActions";
import { hasPillLanded, canPillSlideLeft, canPillSlideRight } from "./collisionChecks";
import { generateFloatingPill } from "./generatePill";
import { IInputActions } from "../model/IInputActions";

export function updateGame(dt: number, inputData:IInputActions, gameState:IGameState, dispatches:IDispatchGameActions): void {
    // update animations
    dispatches.updateAnimation(dt);

    if (gameState.floatingPill.pill != null) {
        let pill: IPill = gameState.floatingPill.pill;

        // perform input for rotation
        if (inputData.rotate) {
            dispatches.rotatePill(gameState.gameboard);
        }

        // perform input for sliding
        if (inputData.left && canPillSlideLeft(pill, gameState.gameboard)) {
            dispatches.slidePill(-1);
        }
        else if (inputData.right && canPillSlideRight(pill, gameState.gameboard)) {
            dispatches.slidePill(1);
        }

        // perform input for dropping
        if (inputData.down) {
            dispatches.dropPillInterval(100);
        }
        else {
            dispatches.dropPillInterval(800);
        }

        // drop pill
        let updateCount: number = Math.floor(gameState.floatingPill.elapsedTime / gameState.floatingPill.dropInterval);
        let shouldSetNewPill: boolean = false;
        while (updateCount > 0) {
            // check if pill has rested, then place it
            if (hasPillLanded(pill, gameState.gameboard)) {
                dispatches.addPillToGameboard(pill);
                shouldSetNewPill = true;
            }
            dispatches.dropPill(1);
            updateCount--;
        }

        // check if we should set a new pill
        if (shouldSetNewPill) {
            dispatches.setPill(generateFloatingPill(gameState.gameboard));
        }
    }
}
