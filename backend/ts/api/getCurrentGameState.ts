import { Request, Response } from "express";
import { Data, makeQuery, getData, API_RES, GameBoard } from "../../../helpers/helpersBack";

export default async function getCurrentGameState(req: Request, res: Response) {
    // console.log("request.session", req.session)
    if (req.session === undefined || req.session.gid === undefined) {
        res.status(400);
        res.send(API_RES.failure);
        return;
    }

    let dbRes: { gameBoard: GameBoard, currentPlayer: number, started: number, data: Data, timeTillTurnEnd: number }
        = (await makeQuery("SELECT `gameBoard`, `currentPlayer`, `started`, `data`, `timeTillTurnEnd`"
            + " FROM `fia` WHERE `id` = ?",
            [req.session.gid]))[0];

    
    if (dbRes.started === 0) {
        res.send(JSON.stringify({ data: dbRes.data }));
    } else {
        res.send(JSON.stringify(dbRes));
    }

    
}