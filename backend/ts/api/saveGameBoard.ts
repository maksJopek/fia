import { Request, Response } from "express";
import { API_RES, makeQuery } from "../../../helpers/helpersBack";

export default async function saveGameBoard(req: Request, res: Response) {
    if(req.session === undefined || req.body.gameBoard === undefined) {
        res.status(400);
        res.send(API_RES.failure);
        return;
    }

    await makeQuery("UPDATE `fia` SET `gameBoard` = ? WHERE `id` = ? ", [
        req.body.gameBoard, req.session.gid
    ]);

    res.send(API_RES.success);
}