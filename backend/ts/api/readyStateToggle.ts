import { Request, Response } from "express";
import { makeQuery, checkApiRes } from "../../../helpers/helpers";

export default async function (req: Request, res: Response) {
    if (req.session === undefined || req.body.state == undefined) {
        res.send(/* html */ `<script>alert("Something went wrong, try to reload the page")</script>`);
        return;
    }
    makeQuery("UPDATE `fia` SET `playersAreReady`=`playersAreReady`+" + (req.body.state ? 1 : 0)
        + " WHERE `id`=" + req.session.gid, []).then(dbRes => checkApiRes(dbRes, res));
}
