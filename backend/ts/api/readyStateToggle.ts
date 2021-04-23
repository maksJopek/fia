import { Request, Response } from "express";
import { makeQuery, Data, getData, API_RES, waitForQueue } from "../../../helpers/helpersBack";
import startGame from "../startGame";
import {global} from "../index";

export default async function (req: Request, res: Response) {
    if (req.session === undefined || req.body.state === undefined || req.session.gid === undefined) {
        res.status(500);
        res.send(API_RES.failure);
        return;
    }

    if(global.stop === true) {
        await waitForQueue();
    }
    global.stop = true;

    let data: { data: Data, started: number } =
        (await makeQuery("SELECT `data`, `started` FROM `fia` WHERE `id` = ?", [req.session.gid]))[0],
        i = 1,
        started = false;

    if (data.started === 0) {

        for (let player of data.data) {
            if (player.id === req.session.uid)
                player.ready = req.body.state ? true : false;
            else if (player.ready === true)
                i++;
        }

        await makeQuery("UPDATE `fia` SET `data` = ?, `playersAreReady`=`playersAreReady`+ ? WHERE `id`= ?",
            [data.data, (req.body.state ? 1 : -1), req.session.gid]);

        if (data.data.length > 1 && data.data.length === i) {
            startGame(req.session.gid);
            started = true;
        }

    }
    global.stop = false;
    res.send(`{"success": true, "started": ${started}}`);
}
