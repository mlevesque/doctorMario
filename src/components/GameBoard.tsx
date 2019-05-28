import * as React from "react";
import { GridSpaceData } from "../model/Gameboard.model";
import { connect } from "react-redux";
import { renderGameBoard, DataForGameBoardRender } from "../canvasRender/gameboard.render";
import { INTERVAL_LENGTH } from "../constants";
import gameboardObjectsImage from "../assets/gameboard-objects.gif"
import { createBuildGameboardAction } from "../actions/actions";
import { GameBoardBuildData } from "../actions/model/GameboardActions.model";
import { ColorType } from "../model/gameObject.model";
import { buildVirusGameboard } from "../virusPropagator";

const VIRUS_INTERVAL: number = 300;

interface StateFromProps {
    grid: GridSpaceData[][];
}

interface ComponentState {
    spriteSheet: HTMLImageElement;
}

const mapStateToProps = (state: any) => {
    return {
        grid: state.gameboard.grid
    }
}

class GameBoardComponent extends React.Component<StateFromProps, ComponentState> {

    constructor(props: any) {
        super(props);
        this.state = {spriteSheet: null}
    }

    private spriteSheet: HTMLImageElement;
    private previousTime: number;
    private remainingVirusTime: number;
    private virusIndex: number;

    gameLoop(timeStamp: number) {
        this.remainingVirusTime += timeStamp - this.previousTime;
        this.virusIndex += Math.floor(this.remainingVirusTime / VIRUS_INTERVAL);
        this.virusIndex %= 2;
        this.remainingVirusTime %= VIRUS_INTERVAL;

        let data: DataForGameBoardRender = {
            virusAnimationIndex: this.virusIndex,
            spriteSheet: this.spriteSheet,
            grid: this.props.grid
        };
        renderGameBoard(this.context, data);

        this.previousTime = timeStamp;

        window.requestAnimationFrame(this.gameLoop.bind(this));
    }

    componentDidMount() {
        this.spriteSheet = document.getElementById("spriteSheet") as HTMLImageElement;
        this.previousTime = 0;
        this.remainingVirusTime = 0;
        this.virusIndex = 0;
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }

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

export const GameBoard = connect<StateFromProps>(
    mapStateToProps
)(GameBoardComponent);
