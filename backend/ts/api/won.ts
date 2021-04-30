import { Request, Response } from "express";
import { API_RES, makeQuery } from "../../../helpers/helpersBack";

export default async function won(req: Request, res: Response) {
    if (req.session === undefined || req.session.gid === undefined || req.session.index === undefined) {
        console.log(JSON.stringify(req));
        res.status(400);
        res.send(API_RES.failure);
        return;
    }
    await makeQuery("UPDATE `fia` SET `winner` = ? WHERE `id` = ?", [req.session.index, req.session.gid]);

    res.send(API_RES.success);
}