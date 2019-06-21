import * as React from "react";
import { connect } from "react-redux";
import gameboardObjectsImage from "../assets/gameboard-objects.gif"
import { IGameState, IPill, IGridPos, ISpriteAnimationStore } from "../model/IGameState";
import { renderGame, IGameboardRenderProps } from "../gameLogic/renderGame";
import configJson from "../data/config.json";

const mapStateToProps = (state: IGameState): IGameboardRenderProps => {
    return {
        gameboard: state.gameboard,
        pills: state.floatingPills.pillIds.map<IPill>((id: string) => {
            return state.floatingPills.pills[id];
        }),
        pillVerticalOffset: state.pillWorldYOffset,
        animationGroups: state.spriteAnimationGroups,
        renderNumber: state.gameboardRenderCount,
        canvasWidth: state.gameboard.width * configJson.gridSpaceSize,
        canvasHeight: state.gameboard.height * configJson.gridSpaceSize
    }
}

class GameComponent extends React.Component<IGameboardRenderProps> {

    private renderContext: CanvasRenderingContext2D;
    private spriteSheet: HTMLImageElement;

    /**
     * We don't want to re-render the components. The gameloop will call to render the canvas instead.
     * @param nextProps 
     * @param nextState 
     */
    shouldComponentUpdate(nextProps: IGameboardRenderProps, nextState: any): boolean {
        if (nextProps.canvasWidth != this.props.canvasWidth || nextProps.canvasHeight != this.props.canvasHeight) {
            return true;
        }
        if (nextProps.renderNumber != this.props.renderNumber) {
            renderGame(this.renderContext, this.spriteSheet, this.props);
            return false;
        }
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
                <canvas id="gameCanvas" width={this.props.canvasWidth} height={this.props.canvasHeight} />
            </div>
        )
    }
}

export const Game = connect<IGameboardRenderProps>(
    mapStateToProps
)(GameComponent);
