import { GameState } from "../model/GameState.model";
import { TypeColor } from "../model/common.model";
import { ConnectorDirection } from "../model/Gameboard.model";

export const InitialGameState:GameState = {
    gameboard: {
        width: 5,
        height: 5,
        grid: [
            [{color: TypeColor.RED, connector: ConnectorDirection.NONE, isVirus: false}],
            [null, null, {color: TypeColor.RED, connector: ConnectorDirection.NONE, isVirus: false}]
        ]
    }
}
