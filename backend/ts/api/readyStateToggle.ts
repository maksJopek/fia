import { Request, Response } from "express";
import { makeQuery } from "../../../helpers/helpersBack";
import startGame from "../startGame";

export default async function (req: Request, res: Response) {
    if (req.session === undefined || req.body.state === undefined) {
        res.status(500);
        res.send("");
        return;
    }
    await makeQuery("UPDATE `fia` SET `playersAreReady`=`playersAreReady`+" + (req.body.state ? 1 : -1)
        + " WHERE `id`=" + req.session.gid, []);
    let start = (
        await makeQuery('SELECT playersAreReady=playersCount and playersCount > 1 "start" FROM `fia` WHERE `id`= ?',
        [req.session.gid])
    )[0].start;
    if(start === 1)
        startGame(req, res);
}
