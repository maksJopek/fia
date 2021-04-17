import { Request, Response } from "express";
import { makeQuery } from "../../../helpers/helpersBack";

export default async function (req: Request, res: Response) {
    if (req.session === undefined) {
        res.send(/* html */ `<script>alert("Something went wrong, try to reload the page")</script>`);
        return;
    }
    // console.log("uid:", req.session.uid, "gid:", req.session.gid);
    if (req.session.uid !== undefined) {
        let data = await makeQuery('SELECT `data` FROM `fia` WHERE `id`=?', [req.session.gid]);
        res.send(JSON.stringify({
            status: true,
            data: data
        }))
    }
    else {
        res.send(JSON.stringify({ status: false }));
    }
}