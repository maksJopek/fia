import { Request, Response } from "express";
import { API_RES, makeQuery, nextTurnEndsAt } from "../../../helpers/helpersBack";

export default async function saveGameBoard(req: Request, res: Response) {
    if (req.session === undefined || req.body.gameBoard === undefined) {
        res.status(400);
        res.send(API_RES.failure);
        return;
    }
    console.log("saving gameBoard");
    let query = "UPDATE `fia` SET `currentPlayer` = IF(`currentPlayer` + 1 = `playersCount`, 0, `currentPlayer` + 1), "
        + "`gameBoard` = ?, `timeTillTurnEnd` = ? WHERE `id` = ?"
    await makeQuery(query, [req.body.gameBoard, nextTurnEndsAt(), req.session.gid]);

    res.send(API_RES.success);
}
//UPDATE `fia` SET `currentPlayer` = IF( `currentPlayer` + 1 = `playersCount`, 0, `currentPlayer` + 1 ) WHERE `id` = 169