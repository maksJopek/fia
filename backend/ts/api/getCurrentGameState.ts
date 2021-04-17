import { Request, Response } from "express";
import { Data, makeQuery } from "../../../helpers/helpersBack";

export default async function getCurrentGameState(req: Request, res: Response) {
    if (req.session === undefined /* || req.body.state === undefined */) {
        res.status(500);
        res.send("");
        return;
    }

    let dbRes: {gameBoard: Data, currentPlayer: number} 
        = (await makeQuery("SELECT `gameBoard`, `currentPlayer` FROM `fia` WHERE `id` = ?", [req.session.gid]))[0],
        currentPlayer = dbRes.currentPlayer === req.session.index;
    
    res.send(JSON.stringify({gameBoard: dbRes.gameBoard, currentPlayer}));
}