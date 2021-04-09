import { Request, Response } from "express";
import { makeQuery, fiaTable, dbRes, dbResToFiaTable, Color, Colors } from "../../../helpers/helpers";

// export default async function apiLogin(req: Request, res: Response) {
export default async function (req: Request, res: Response) {
  if (req.session === undefined) {
    res.send(/* html */ `<script>alert("Something went wrong, try to reload the page")</script>`);
    return;
  }
  req.session.uid = req.session.id;
  req.session.name = req.body.name;

  let dbRes = (await makeQuery("SELECT * FROM `fia` WHERE `started`= 0 LIMIT 1", [])) as Array<dbRes>,
    row: fiaTable;
  if (dbRes.length === 0) {
    row = {} as fiaTable;
    row.data = [{ id: req.session.uid, color: Color.blue, name: req.body.name }];
    req.session.color = Color.blue;

    await makeQuery('INSERT INTO `fia`(`data`, `started`) VALUES (?, ?)', [JSON.stringify(row.data), 0]);
    req.session.gid = (await makeQuery('SELECT `id` FROM `fia` WHERE `data`=?', [JSON.stringify(row.data)]) as any)[0].id;
  } else {
    row = dbResToFiaTable(dbRes[0]);
    let color = Color[row.data.length as keyof Colors];
    row.data.push({
      id: req.session.uid,
      color: Color.blue,
      name: req.body.name
    });

    req.session.gid = row.id;
    req.session.color = color;
    makeQuery('UPDATE `fia` SET `data`=? WHERE `id`=?', [JSON.stringify(row.data), row.id]);

    if (row.data.length === 4) {
      makeQuery("UPDATE `fia` SET `started` = 1 WHERE `id`=?", [row.id]);
      // TODO: Start game from backend
    }
  }
  makeQuery("UPDATE `fia` SET `playersCount`=`playersCount`+1 WHERE `id`=?", [req.session.gid]);
  res.send(JSON.stringify(row.data));
}
