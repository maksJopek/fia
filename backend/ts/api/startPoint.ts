import { Request, Response } from "express";
import { makeQuery } from "../../../helpers/helpersBack";

export default async function (req: Request, res: Response) {
    if (req.session !== undefined && req.session.gid !== undefined) {
        let data = (await makeQuery('SELECT `data` FROM `fia` WHERE `id`=?', [req.session.gid]))[0];
        res.send(JSON.stringify({
            status: true,
            data: data,
            uid: req.session.uid
        }))
    }
    else {
        res.send(JSON.stringify({ status: false }));
    }
}