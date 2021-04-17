import { Request, Response } from "express";
import { fiaTable, dbRes, Color, Colors, Helpers, makeQuery, Chequer, tColors } from "../../../helpers/helpersBack";
import startGame from "../startGame";

export default async function apiLogin(req: Request, res: Response) {
  if (req.session === undefined) {
    res.status(500);
    res.send("");
    return;
  }
  req.session.uid = req.session.id;
  req.session.name = req.body.name;

  let dbRes = (await makeQuery("SELECT * FROM `fia` WHERE `started`= 0 LIMIT 1", [])) as Array<dbRes>,
    row: fiaTable;
  if (dbRes.length === 0) {
    let color = Helpers.getRandomInt(0, 5);
    row = {} as fiaTable;

    row.data = [{
      id: req.session.uid,
      index: 0,
      color: Color[color as keyof Colors],
      name: req.body.name,
    }];
    req.session.color = Color.blue;

    await makeQuery('INSERT INTO `fia`(`data`, `started`) VALUES (?, ?)', [JSON.stringify(row.data), 0]);
    req.session.gid = (await makeQuery('SELECT `id` FROM `fia` WHERE `data`= ?', [JSON.stringify(row.data)]) as any)[0].id;
  } else {
    row = Helpers.dbResToFiaTable(dbRes[0]);
    let playersColors: Array<tColors> = [],
      colors = [...Array(4).keys()];

    for (let playerData of row.data)
      playersColors.push(playerData.color);

    colors = colors.filter(el => !playersColors.includes(el));
    let color = colors[Helpers.getRandomInt(0, colors.length)],
      index = row.data.length;

    row.data.push({
      id: req.session.uid,
      index: index,
      color: color,
      name: req.body.name,
    });

    req.session.gid = row.id;
    req.session.index = index;

    makeQuery('UPDATE `fia` SET `data`= ? WHERE `id`= ?', [JSON.stringify(row.data), row.id]);

    if (row.data.length === 4) {
      startGame(req, res);
    }
  }
  makeQuery("UPDATE `fia` SET `playersCount`=`playersCount`+1 WHERE `id`= ?", [req.session.gid]);
  res.send(JSON.stringify(row.data));
}
