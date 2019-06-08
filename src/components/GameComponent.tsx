import * as React from "react";
import { connect } from "react-redux";
import gameboardObjectsImage from "../assets/gameboard-objects.gif"
import { IGameState, IPill, IGridPos } from "../model/IGameState";
import { renderGame, IRenderGameParams } from "../gameLogic/renderGame";

const mapStateToProps = (state: IGameState): IGameState => {
    return state;
}

class GameComponent extends React.Component<IGameState> {

    private renderContext: CanvasRenderingContext2D;
    private spriteSheet: HTMLImageElement;

    mapStateToRenderParams(state: IGameState): IRenderGameParams {
        return {
            gameboard: state.gameboard,
            pills: state.floatingPills.pillIds.map<IPill>((id: string) => {
                return state.floatingPills.pills[id];
            }),
            pillVerticalOffset: state.pillWorldYOffset,
            virusAnimationFrame: state.virusGameboardAnimation.frameIndex,
        }
    }

    /**
     * We don't want to re-render the components. The gameloop will call to render the canvas instead.
     * @param nextProps 
     * @param nextState 
     */
    shouldComponentUpdate(nextProps: any, nextState: any): boolean {
        renderGame(this.renderContext, this.spriteSheet, this.mapStateToRenderParams(this.props));
        return false;
    }

    /**
     * When the components mount, begin the game loop.
     */
    componentDidMount() {
        let canvas: HTMLCanvasElement = document.getElementById("gameCanvas") as HTMLCanvasElement;
        this.renderContext = canvas.getContext("2d");
        this.spriteSheet = document.getElementById("spriteSheet") as HTMLImageElement;
    }

    /**
     * Render the HTML components.
     */
    render() {
        return (
            <div>
                <img id="spriteSheet" src={gameboardObjectsImage} hidden={true} />
                <canvas id="gameCanvas" width={640} height={640} />
            </div>
        )
    }
}

export const Game = connect<IGameState>(
    mapStateToProps
)(GameComponent);
