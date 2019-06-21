import React from "react";
import spriteSheet from "../assets/spritesheet.gif";
import { Gameboard } from "./Gameboard";

class MainGameComponent extends React.Component {
    render() {
        return (
            <div>
                <img id="spriteSheet" src={spriteSheet} hidden={true} />
                <Gameboard />
            </div>
        )
    }
}

export default MainGameComponent;