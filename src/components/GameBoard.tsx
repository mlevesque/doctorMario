import * as React from "react";
import { GridSpaceData } from "../model/Gameboard.model";
import { connect } from "react-redux";
import { renderGameBoard } from "../canvasRender/gameboard.render";

interface StateFromProps {
    grid: GridSpaceData[][];
}

const mapStateToProps = (state: any) => {
    return {
        grid: state.gameboard.grid
    }
}

class GameBoardComponent extends React.Component<StateFromProps> {

    componentDidMount() {
        const self = this;
        setInterval(() => {
            renderGameBoard(self.context, self.props.grid);
        }, 10);
    }

    render() {
        return (
            <div>
                <canvas ref={(c) => this.context = c.getContext('2d')} width={640} height={425} />
            </div>
        )
    }
}

export const GameBoard = connect<StateFromProps>(
    mapStateToProps
)(GameBoardComponent);
