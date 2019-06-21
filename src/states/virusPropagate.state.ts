import { ILevelData, IVirusCounts } from "../model/IGameState";
import { getLevelDataState } from "../sagas/selectHelpers";
import { select, put } from "redux-saga/effects";
import { createUpdateRemaningVirusesAction } from "../actions/level.actions";
import { ColorType } from "../model/enums";
import { Table } from "../model/Table";
import configJson from "../data/config.json";
import { createBuildGameboardAction } from "../actions/GameBoard.actions";
import { IAddVirusResult, attemptToAddVirus } from "../gameLogic/virusPropagator";
import { ILevelSchema } from "../model/JsonSchemas";
import { getLevelJsonData } from "../gameLogic/JsonDataMethods";
import { createNextFlowStateAction } from "../actions/flowState.actions";

let failures: number = 0;
let virusTable: Table<ColorType>;
let maskTable: Table<number>;

export function propagateVirusesStart() {
    // init virus data
    failures = 0;
    virusTable = new Table<ColorType>(configJson.gridWidth, configJson.gridHeight, null);
    maskTable = new Table<number>(configJson.gridWidth, configJson.gridHeight, 0);
}

export function* propagateVirusesUpdate() {
    // get the number of viruses remaining to propagate
    const levelData: ILevelData = yield select(getLevelDataState);
    const levelSchemaData: ILevelSchema = getLevelJsonData(levelData.level);
    let virusCount: IVirusCounts = Object.assign({}, levelData.remainingCounts);
    let redCount: number = levelSchemaData.redCount - levelData.remainingCounts.red;
    let yellowCount: number = levelSchemaData.yellowCount - levelData.remainingCounts.yellow;
    let blueCount: number = levelSchemaData.blueCount - levelData.remainingCounts.blue;

    // propagate viruses
    let count: number = 0;
    while(count < configJson.virusPropagationPerFrame && failures < configJson.propagationFailureLimit) {
        let result: IAddVirusResult = attemptToAddVirus(maskTable, redCount > 0, yellowCount > 0, blueCount > 0, levelSchemaData.virusCeiling);
        if (result.successful) {
            //add virus
            virusTable.setValue(result.position.x, result.position.y, result.color);
            
            // update counts
            switch(result.color) {
                case ColorType.RED: virusCount.red++; redCount--; break;
                case ColorType.YELLOW: virusCount.yellow++; yellowCount--; break;
                case ColorType.BLUE: virusCount.blue++; blueCount--; break;
            }
        }
        else {
            failures++;
        }
        count++;
    }// end while

    // update the store with the new virus counts
    yield put(createUpdateRemaningVirusesAction(virusCount));

    // update gameboard
    yield put(createBuildGameboardAction(virusTable));

    // check if we are done
    if ((virusCount.red == levelSchemaData.redCount 
            && virusCount.yellow == levelSchemaData.yellowCount 
            && virusCount.blue == levelSchemaData.blueCount)
        || failures >= configJson.propagationFailureLimit) {
        yield put(createNextFlowStateAction());
    }
}
