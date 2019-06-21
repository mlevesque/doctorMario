import * as React from "react";
import { connect } from "react-redux";
import { IGameState, IPill } from "../model/IGameState";
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

class GameboardComponent extends React.Component<IGameboardRenderProps> {

    private renderContext: CanvasRenderingContext2D;
    private spriteSheet: HTMLImageElement;

    /**
     * If the render number is different, then render on the canvas only. If the gameboard size has
     * changed, then we render all the elements.
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
                <canvas id="gameCanvas" width={this.props.canvasWidth} height={this.props.canvasHeight} />
            </div>
        )
    }
}

export const Gameboard = connect<IGameboardRenderProps>(
    mapStateToProps
)(GameboardComponent);
