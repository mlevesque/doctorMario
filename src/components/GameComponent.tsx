import * as React from "react";
import { connect } from "react-redux";
import gameboardObjectsImage from "../assets/gameboard-objects.gif"
import { IRenderGameParams } from "../model/IRenderGameParams";
import { IGameState, IPill, IGridPos } from "../model/IGameState";
import { renderGame } from "../gameLogic/renderGame";
import { IDispatchGameActions } from "../model/IDispatchGameActions";
import { createAddPillToGameboardAction, createDestroyObjectsInGameboardAction, createPurgeDestroyObjectsAction } from "../actions/GameBoard.actions";
import { Table } from "../model/Table";
import { updateGame } from "../gameLogic/updateGame";
import { createAnimationUpdateAction } from "../actions/Animation.actions";
import { createFloatingPillSetPillAction, createFloatingPillSlideAction, createFloatingPillDropAction, createFloatingPillRotateAction, createFloatingPillSetDropIntervalAction } from "../actions/FloatingPill.actions";
import { IInputActions } from "../model/IInputActions";
import { IGameBoard } from "../model/IGameBoard";

const mapStateToProps = (state: IGameState): IGameState => {
    return state;
}

const mapDispatchToProps = (dispatch: any): IDispatchGameActions => {
    return {
        updateAnimation: (deltaTime: number) => {dispatch(createAnimationUpdateAction(deltaTime))},
        setPill: (pill: IPill) => {dispatch(createFloatingPillSetPillAction(pill))},
        rotatePill: (gameboard: IGameBoard) => {dispatch(createFloatingPillRotateAction(gameboard))},
        slidePill: (position: number) => {dispatch(createFloatingPillSlideAction(position))},
        dropPillInterval: (interval: number) => {dispatch(createFloatingPillSetDropIntervalAction(interval))},
        dropPill: (position: number) => {dispatch(createFloatingPillDropAction(position))},
        addPillToGameboard: (pill: IPill) => {dispatch(createAddPillToGameboardAction(pill))},
        markDestroyObjects: (table: Table<boolean>) => {dispatch(createDestroyObjectsInGameboardAction(table))},
        purgeDestroyObjects: () => {dispatch(createPurgeDestroyObjectsAction())},
    }
}

class GameComponent extends React.Component<IGameState & IDispatchGameActions> {

    constructor(props: any) {
        super(props);
        this.inputActions = {
            rotate: false,
            left: false,
            right: false,
            down: false,
        }
    }

    private inputActions: IInputActions;
    private renderContext: CanvasRenderingContext2D;
    private spriteSheet: HTMLImageElement;
    private prevTimestamp: number;

    resetInputPressActions():void {
        this.inputActions.rotate = false;
        this.inputActions.left = false;
        this.inputActions.right = false;
    }

    onKeyDown(e:KeyboardEvent):void {
        switch(e.code) {
            case "Space":
            case "ArrowUp":
                this.inputActions.rotate = true;
                break;
            case "ArrowLeft":
                this.inputActions.left = true;
                break;
            case "ArrowRight":
                this.inputActions.right = true;
                break;
            case "ArrowDown":
                this.inputActions.down = true;
                break;
        }
    }

    onKeyUp(e:KeyboardEvent): void {
        switch(e.code) {
            case "ArrowDown":
                this.inputActions.down = false;
                break;
        }
    }

    mapStateToRenderParams(state: IGameState): IRenderGameParams {
        return {
            gameboard: state.gameboard,
            pill: state.floatingPill.pill,
            virusAnimationFrame: state.virusGameboardAnimation.frameIndex,
        }
    }

    gameLoop(timeStamp: number) {
        let dt: number = timeStamp - this.prevTimestamp;
        updateGame(dt, this.inputActions, this.props, this.props);
        renderGame(this.renderContext, this.spriteSheet, this.mapStateToRenderParams(this.props));
        this.prevTimestamp = timeStamp;
        this.resetInputPressActions();
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
        document.addEventListener('keydown', this.onKeyDown.bind(this), true);
        document.addEventListener('keyup', this.onKeyUp.bind(this), true);
        this.prevTimestamp = 0;
        let canvas: HTMLCanvasElement = document.getElementById("gameCanvas") as HTMLCanvasElement;
        this.renderContext = canvas.getContext("2d");
        this.spriteSheet = document.getElementById("spriteSheet") as HTMLImageElement;
        window.requestAnimationFrame(this.gameLoop.bind(this));
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

export const Game = connect<IGameState, IDispatchGameActions>(
    mapStateToProps,
    mapDispatchToProps
)(GameComponent);
