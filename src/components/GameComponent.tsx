import * as React from "react";
import { connect } from "react-redux";
import gameboardObjectsImage from "../assets/gameboard-objects.gif"
import { IRenderGameParams } from "../model/IRenderGameParams";
import { IGameState, IPill } from "../model/IGameState";
import { renderGame } from "../gameLogic/renderGame";
import { IDispatchGameActions } from "../model/IDispatchGameActions";
import { createAddPillToGameboardAction, createDestroyObjectsInGameboardAction, createPurgeDestroyObjectsAction } from "../actions/GameBoard.actions";
import { Table } from "../model/Table";
import { updateGame } from "../gameLogic/updateGame";

const VIRUS_INTERVAL: number = 300;

const mapStateToProps = (state: IGameState): IGameState => {
    return state;
}

const mapDispatchToProps = (dispatch: any): IDispatchGameActions => {
    return {
        addPillToGameboard: (pill: IPill) => {createAddPillToGameboardAction(pill)},
        markDestroyObjects: (table: Table<boolean>) => {createDestroyObjectsInGameboardAction(table)},
        purgeDestroyObjects: () => {createPurgeDestroyObjectsAction()},
    }
}

class GameComponent extends React.Component<IGameState & IDispatchGameActions> {

    constructor(props: any) {
        super(props);
    }

    private spriteSheet: HTMLImageElement;
    private prevTimestamp: number;

    mapStateToRenderParams(state: IGameState): IRenderGameParams {
        return {
            gameboard: state.gameboard,
            pill: state.floatingPill.pill,
            virusAnimationFrame: 0,
        }
    }

    gameLoop(timeStamp: number) {
        let dt: number = timeStamp - this.prevTimestamp;
        updateGame(dt, this.props, this.props);
        renderGame(this.context, this.spriteSheet, this.mapStateToRenderParams(this.props));
        this.prevTimestamp = timeStamp;
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * We don't want to re-render the components. The gameloop will call to render the canvas instead.
     * @param nextProps 
     * @param nextState 
     */
    shouldComponentUpdate(nextProps: any, nextState: any): boolean {
        return false;
    }

    /**
     * When the components mount, begin the game loop.
     */
    componentDidMount() {
        this.prevTimestamp = 0;
        this.spriteSheet = document.getElementById("spriteSheet") as HTMLImageElement;
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * Render the HTML components.
     */
    render() {
        return (
            <div>
                <div>Test</div>
                <img id="spriteSheet" src={gameboardObjectsImage} hidden={true} />
                <canvas ref={(c) => this.context = c.getContext('2d')} width={640} height={640} />
            </div>
        )
    }
}

export const Game = connect<IGameState, IDispatchGameActions>(
    mapStateToProps,
    mapDispatchToProps
)(GameComponent);
