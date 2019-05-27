import * as React from "react";
import { GridSpaceData } from "../model/Gameboard.model";
import { connect } from "react-redux";
import { renderGameBoard, DataForGameBoardRender } from "../canvasRender/gameboard.render";
import { INTERVAL_LENGTH } from "../constants";
import gameboardObjectsImage from "../assets/gameboard-objects.gif"

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

    componentDidMount() {
        const self = this;
        const spriteSheet: HTMLImageElement = document.getElementById("spriteSheet") as HTMLImageElement;
        setInterval(() => {
            let data: DataForGameBoardRender = {
                ctx: self.context,
                spriteSheet: spriteSheet,
                grid: self.props.grid
            };
            renderGameBoard(data);
        }, INTERVAL_LENGTH);
    }

    render() {
        return (
            <div>
                <div>Test</div>
                <img id="spriteSheet" src={gameboardObjectsImage} hidden={true} />
                <canvas ref={(c) => this.context = c.getContext('2d')} width={640} height={425} />
            </div>
        )
    }
}

export const GameBoard = connect<StateFromProps>(
    mapStateToProps
)(GameBoardComponent);
